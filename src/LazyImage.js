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

// Function to check specific WebP features
const checkWebPFeature = (feature) => {
  return new Promise((resolve) => {
    const kTestImages = {
      lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
      lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
      alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA=="
    };
    const img = new Image();
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
    img.src = "data:image/webp;base64," + kTestImages[feature];
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
    webPSupport: { lossy: null, lossless: null, alpha: null },
    supportsLazyLoading: 'loading' in HTMLImageElement.prototype,
    intersectionObserverSupported: 'IntersectionObserver' in window,
    slowNetwork: false,
  });

  useEffect(() => {
    const detectFeatures = async () => {
      if (format === 'webp') {
        const webPSupport = {
          lossy: await checkWebPFeature('lossy'),
          lossless: await checkWebPFeature('lossless'),
          alpha: await checkWebPFeature('alpha')
        };
        setFeatures(prev => ({ ...prev, webPSupport }));
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
            slowNetwork: ['slow-2g', '2g'].includes(navigator.connection.effectiveType)
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

      let observer;
      let timeoutId;

      const handleIntersection = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Clear any existing timeout
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            // Set a small delay before triggering the load
            timeoutId = setTimeout(() => {
              setInView(true);
              setLoadState('loading');
              observer.unobserve(entry.target);
            }, 100); // 100ms delay to handle rapid scrolling
          } else {
            // If the image is no longer in view, clear the timeout
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
          }
        });
      };

      observer = new IntersectionObserver(handleIntersection, observerOptions);

      if (elementRef.current) observer.observe(elementRef.current);

      return () => {
        if (elementRef.current) observer.unobserve(elementRef.current);
        if (timeoutId) clearTimeout(timeoutId);
      };
    } else {
      // Fallback: start loading after a short delay
      const timer = setTimeout(() => {
        setInView(true);
        setLoadState('loading');
      }, 1000);
      return () => clearTimeout(timer);
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
  critical = false,
  ...props
}) => {
  const [inView, setInView] = useState(critical);
  const [loadState, setLoadState] = useState(critical ? 'loading' : 'initial');
  const [attemptsLeft, setAttemptsLeft] = useState(retryAttempts);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [webpPolyfillLoaded, setWebpPolyfillLoaded] = useState(false);
  const elementRef = useRef(null);
  const [networkCondition, setNetworkCondition] = useState('fast');
  const abortControllerRef = useRef(null);

  const features = useFeatureDetection(format);
  useLazyLoading(features, elementRef, setInView, setLoadState);

  useEffect(() => {
    const updateNetworkCondition = () => {
      if ('connection' in navigator && 'effectiveType' in navigator.connection) {
        setNetworkCondition(navigator.connection.effectiveType);
      }
    };
    updateNetworkCondition();
    window.addEventListener('online', updateNetworkCondition);
    window.addEventListener('offline', updateNetworkCondition);
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkCondition);
    }
    return () => {
      window.removeEventListener('online', updateNetworkCondition);
      window.removeEventListener('offline', updateNetworkCondition);
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateNetworkCondition);
      }
    };
  }, []);

  const getRetryDelay = useCallback((attempt) => {
    return Math.min(1000 * 2 ** attempt, 30000); // Max delay of 30 seconds
  }, []);

  const handleLoad = useCallback(() => {
    setLoadState('loaded');
    if (elementRef.current) {
      elementRef.current.classList.add('fade-in');
    }
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleError = useCallback(async (error) => {
    console.error('Image load error:', error);

    if (error.name === 'AbortError') {
      console.log('Image load aborted due to network change or component unmount');
      return;
    }

    if (error.name === 'SecurityError') {
      console.error('CORS issue detected');
      setLoadState('error');
      if (onError) onError(new Error('CORS error: Image could not be loaded due to security restrictions'));
      return;
    }

    if (format === 'webp' && !features.webPSupport.lossy && !fallbackAttempted) {
      setCurrentSrc(src.replace(/\.webp$/, '.jpg'));
      setFallbackAttempted(true);
    } else if (fallbackAttempted && !webpPolyfillLoaded) {
      try {
        await loadWebpHeroPolyfill();
        setWebpPolyfillLoaded(true);
        setCurrentSrc(src);
        console.log('WebP polyfill loaded successfully');
      } catch (polyfillError) {
        console.error('Failed to load WebP polyfill:', polyfillError);
        handleRetry();
      }
    } else {
      handleRetry();
    }
  }, [format, features.webPSupport, fallbackAttempted, webpPolyfillLoaded, src, onError]);

  const handleRetry = useCallback(() => {
    if (attemptsLeft > 0) {
      const delay = getRetryDelay(retryAttempts - attemptsLeft);
      setAttemptsLeft(attemptsLeft - 1);
      setLoadState('initial');
      setTimeout(() => {
        if (networkCondition !== 'offline') {
          setLoadState('loading');
        }
      }, delay);
    } else {
      setLoadState('error');
      if (onError) onError(new Error('Image failed to load after multiple attempts'));
    }
  }, [attemptsLeft, retryAttempts, networkCondition, getRetryDelay, onError]);

  useEffect(() => {
    if (networkCondition === '2g' || networkCondition === 'slow-2g') {
      if (lowResSrc) {
        setCurrentSrc(lowResSrc);
      }
    } else {
      setCurrentSrc(src);
    }

    // Abort any ongoing fetch when network conditions change
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Reset loading state when network condition changes
    if (loadState === 'loading') {
      setLoadState('initial');
      setTimeout(() => setLoadState('loading'), 0);
    }
  }, [networkCondition, lowResSrc, src, loadState]);

  useEffect(() => {
    return () => {
      // Abort any ongoing fetch when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const imageProps = {
    ref: elementRef,
    src: features.supportsLazyLoading || inView ? currentSrc : undefined,
    srcSet,
    sizes,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    loading: critical || features.supportsLazyLoading ? 'eager' : 'lazy',
    width,
    height,
    crossOrigin: "anonymous",
    ...props,
  };

  if (format === 'svg') {
    return (
      <object
        data={currentSrc}
        type="image/svg+xml"
        width={width}
        height={height}
        aria-label={alt}
        onLoad={handleLoad}
        onError={handleError}
      >
        {alt}
      </object>
    );
  }

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
            {...imageProps}
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
      {(inView || features
