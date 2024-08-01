import { h } from 'preact';
import { useEffect, useRef, useState, useCallback } from 'preact/hooks';
import './LazyImage.css';

// Base64 encoded light gray 1x1 pixel GIF
const lightGrayGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Function to check if the browser supports WebP images
const checkWebPSupport = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => resolve(webP.height === 2);
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Function to dynamically load the Intersection Observer polyfill
const loadIntersectionObserverPolyfill = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Function to dynamically load the webp-hero polyfill
const loadWebpHeroPolyfill = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/webp-hero@0.0.2/dist-cjs/polyfills.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const useFeatureDetection = (format) => {
  const [features, setFeatures] = useState({
    webPSupported: null,
    supportsLazyLoading: 'loading' in HTMLImageElement.prototype,
    intersectionObserverSupported: 'IntersectionObserver' in window,
    slowNetwork: false,
  });

  useEffect(() => {
    const detectFeatures = async () => {
      if (format === 'webp') {
        const webPSupported = await checkWebPSupport();
        setFeatures(prev => ({ ...prev, webPSupported }));
      }

      if (!features.intersectionObserverSupported) {
        try {
          await loadIntersectionObserverPolyfill();
          setFeatures(prev => ({ ...prev, intersectionObserverSupported: 'IntersectionObserver' in window }));
          console.log('IntersectionObserver polyfill loaded successfully');
        } catch (error) {
          console.error('Failed to load IntersectionObserver polyfill:', error);
        }
      }

      if ('connection' in navigator && 'effectiveType' in navigator.connection) {
        const updateNetworkStatus = () => {
          setFeatures(prev => ({
            ...prev,
            slowNetwork: navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g'
          }));
        };
        updateNetworkStatus();
        navigator.connection.addEventListener('change', updateNetworkStatus);
        return () => navigator.connection.removeEventListener('change', updateNetworkStatus);
      }
    };

    detectFeatures();
  }, [format, features.intersectionObserverSupported]);

  return features;
};

const useLazyLoading = (features, elementRef, setInView, setLoadState) => {
  useEffect(() => {
    if (features.supportsLazyLoading) {
      setInView(true);
      setLoadState('loading');
      return;
    }

    if (features.intersectionObserverSupported) {
      const observerOptions = {
        rootMargin: '200px 0px',
        threshold: 0.01,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            setLoadState('loading');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      if (elementRef.current) observer.observe(elementRef.current);

      return () => {
        if (elementRef.current) observer.unobserve(elementRef.current);
      };
    } else {
      // If Intersection Observer is not supported even after attempting to load the polyfill,
      // we fall back to loading the image immediately
      setInView(true);
      setLoadState('loading');
    }
  }, [features, elementRef, setInView, setLoadState]);
};

const LazyImage = ({
  src,
  alt,
  width,
  height,
  placeholderSrc,
  placeholderContent,
  placeholderStyle,
  srcSet,
  sizes,
  lowResSrc,
  retryAttempts = 3,
  retryDelay = 1000,
  isIframe = false,
  backgroundImage = lightGrayGif,
  format = '',
  onLoad,
  onError,
  ...props
}) => {
  const [inView, setInView] = useState(false);
  const [loadState, setLoadState] = useState('initial');
  const [attemptsLeft, setAttemptsLeft] = useState(retryAttempts);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [webpPolyfillLoaded, setWebpPolyfillLoaded] = useState(false);
  const elementRef = useRef(null);

  const features = useFeatureDetection(format);
  useLazyLoading(features, elementRef, setInView, setLoadState);

  const handleLoad = useCallback(() => {
    setLoadState('loaded');
    if (elementRef.current) {
      elementRef.current.classList.add('fade-in');
    }
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleError = useCallback(async () => {
    if (format === 'webp' && !features.webPSupported && !fallbackAttempted) {
      // Try loading fallback format
      setCurrentSrc(src.replace(/\.webp$/, '.jpg'));
      setFallbackAttempted(true);
    } else if (fallbackAttempted && !webpPolyfillLoaded) {
      // Both WebP and fallback failed, try loading webp-hero polyfill
      try {
        await loadWebpHeroPolyfill();
        setWebpPolyfillLoaded(true);
        // Revert to original WebP source
        setCurrentSrc(src);
        console.log('WebP polyfill loaded successfully');
      } catch (error) {
        console.error('Failed to load WebP polyfill:', error);
        if (attemptsLeft > 0) {
          setAttemptsLeft(attemptsLeft - 1);
          setLoadState('initial');
          setTimeout(() => setLoadState('loading'), retryDelay);
        } else {
          setLoadState('error');
          if (onError) onError(new Error('Image failed to load after multiple attempts'));
        }
      }
    } else if (attemptsLeft > 0) {
      setAttemptsLeft(attemptsLeft - 1);
      setLoadState('initial');
      setTimeout(() => setLoadState('loading'), retryDelay);
    } else {
      setLoadState('error');
      if (onError) onError(new Error('Image failed to load after multiple attempts'));
    }
  }, [format, features.webPSupported, fallbackAttempted, webpPolyfillLoaded, src, attemptsLeft, retryDelay, onError]);

  useEffect(() => {
    if (features.slowNetwork && lowResSrc) {
      setCurrentSrc(lowResSrc);
    }
  }, [features.slowNetwork, lowResSrc]);

  const commonProps = {
    ref: elementRef,
    src: features.supportsLazyLoading ? currentSrc : undefined,
    srcSet,
    sizes,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    loading: features.supportsLazyLoading ? 'lazy' : undefined,
    width,
    height,
    ...props,
  };

  if (isIframe) {
    return (
      <div class="lazy-iframe-container" style={{ width, height }}>
        {backgroundImage && !inView && (
          <div
            class="lazy-iframe-placeholder"
            style={{ backgroundImage: `url(${backgroundImage})`, ...placeholderStyle }}
          >
            {placeholderContent}
          </div>
        )}
        {inView && (
          <iframe
            {...commonProps}
            src={currentSrc}
            title={alt}
          />
        )}
        {loadState === 'loading' && (
          <div class="lazy-iframe-loading" aria-live="polite">
            <div class="spinner" role="progressbar" aria-valuetext="Loading iframe content" />
          </div>
        )}
        {loadState === 'error' && (
          <div class="lazy-iframe-error" role="alert">
            <span role="img" aria-label="Error">⚠️</span>
            <p>Iframe content failed to load. Please try refreshing the page.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div class="lazy-image-container" style={{ width, height }}>
      {placeholderSrc && loadState !== 'loaded' && !placeholderContent && (
        <img
          src={placeholderSrc}
          alt={`Placeholder for ${alt}`}
          class="lazy-image-placeholder"
          aria-hidden="true"
        />
      )}
      {placeholderContent && loadState !== 'loaded' && (
        <div 
          class="lazy-image-placeholder" 
          style={{ backgroundImage: `url(${backgroundImage})`, ...placeholderStyle }}
          aria-hidden="true"
        >
          {placeholderContent}
        </div>
      )}
      {loadState === 'loading' && (
        <div class="lazy-image-loading" aria-live="polite">
          <div class="spinner" role="progressbar" aria-valuetext="Loading image" />
        </div>
      )}
      {(inView || features.supportsLazyLoading) && (
        <picture>
          {format === 'webp' && (features.webPSupported || webpPolyfillLoaded) && (
            <source srcSet={srcSet} sizes={sizes} type="image/webp" />
          )}
          <source srcSet={srcSet} sizes={sizes} />
          <img
            {...commonProps}
            class={`lazy-image-loaded ${loadState === 'error' ? 'lazy-image-error' : ''}`}
            aria-live={loadState === 'error' ? 'assertive' : 'polite'}
          />
        </picture>
      )}
      {loadState === 'error' && (
        <div class="lazy-image-error" role="alert">
          <span role="img" aria-label="Error">⚠️</span>
          <p>Image failed to load. Please try refreshing the page.</p>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
