import { h } from 'preact';
import { useEffect, useRef, useState, useCallback, useMemo } from 'preact/hooks';
import PropTypes from 'prop-types';
import './LazyImage.css';

// Utility Functions

// Base64 encoded light gray 1x1 pixel GIF
const lightGrayGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Utility function to check if the browser supports WebP images
const checkWebPSupport = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    const timeout = setTimeout(() => resolve(false), 5000); // 5-second timeout
    webP.onload = webP.onerror = () => {
      clearTimeout(timeout);
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }).catch(() => false);
};

// Utility function to check specific WebP features
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
  }).catch(() => false);
};

// Utility function to load a polyfill script with timeout
const loadPolyfill = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    const timeout = setTimeout(() => reject(new Error('Script load timeout')), 10000); // 10-second timeout
    script.addEventListener('load', () => clearTimeout(timeout));
    document.head.appendChild(script);
  });
};

// Custom Hooks

// Custom hook for feature detection
const useFeatureDetection = (format) => {
  const [features, setFeatures] = useState({
    webPSupport: { lossy: null, lossless: null, alpha: null },
    supportsLazyLoading: 'loading' in HTMLImageElement.prototype,
    intersectionObserverSupported: 'IntersectionObserver' in window,
    slowNetwork: false,
  });

  useEffect(() => {
    const detectFeatures = async () => {
      try {
        if (format === 'webp') {
          const webPSupport = {
            lossy: await checkWebPFeature('lossy'),
            lossless: await checkWebPFeature('lossless'),
            alpha: await checkWebPFeature('alpha')
          };
          setFeatures(prev => ({ ...prev, webPSupport }));
        }

        if (!features.intersectionObserverSupported) {
          await loadPolyfill('https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver');
          setFeatures(prev => ({ ...prev, intersectionObserverSupported: true }));
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
      } catch (error) {
        console.error('Feature detection error:', error);
      }
    };

    detectFeatures();
  }, [format, features.intersectionObserverSupported]);

  return features;
};

// Custom hook for lazy loading
const useLazyLoading = (features, elementRef, options) => {
  const [inView, setInView] = useState(options.critical);

  useEffect(() => {
    if (features.supportsLazyLoading || options.critical) {
      setInView(true);
      return;
    }

    if (features.intersectionObserverSupported) {
      const observerOptions = {
        rootMargin: options.threshold || '200px 0px',
        threshold: 0.01,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      if (elementRef.current) observer.observe(elementRef.current);

      return () => {
        if (elementRef.current) observer.unobserve(elementRef.current);
      };
    } else {
      // Fallback: start loading after a short delay
      const timer = setTimeout(() => setInView(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [features, elementRef, options.critical, options.threshold]);

  return inView;
};

// Custom hook for handling image loading states
const useImageLoadState = (retryAttempts, retryDelay) => {
  const [loadState, setLoadState] = useState('initial');
  const [attemptsLeft, setAttemptsLeft] = useState(retryAttempts);

  const handleLoad = useCallback(() => {
    setLoadState('loaded');
  }, []);

  const handleError = useCallback(() => {
    if (attemptsLeft > 0) {
      setAttemptsLeft(prev => prev - 1);
      setLoadState('retrying');
      setTimeout(() => setLoadState('loading'), retryDelay);
    } else {
      setLoadState('error');
    }
  }, [attemptsLeft, retryDelay]);

  return { loadState, handleLoad, handleError };
};

// Custom hook for WebP polyfill
const useWebPPolyfill = (format, fallbackSrc) => {
  const [currentSrc, setCurrentSrc] = useState(fallbackSrc);
  const [webpPolyfillLoaded, setWebpPolyfillLoaded] = useState(false);

  useEffect(() => {
    if (format === 'webp' && !webpPolyfillLoaded) {
      loadPolyfill('https://cdn.jsdelivr.net/npm/webp-hero@1.0.0/dist/webp-hero.min.js')
        .then(() => {
          setWebpPolyfillLoaded(true);
          setCurrentSrc(fallbackSrc);
        })
        .catch(error => console.error('Failed to load WebP polyfill:', error));
    }
  }, [format, fallbackSrc, webpPolyfillLoaded]);

  return { currentSrc, webpPolyfillLoaded };
};

// Subcomponents

// Component to handle image placeholders
const ImagePlaceholder = ({ placeholderSrc, placeholderContent, placeholderStyle, backgroundImage }) => (
  <div
    class="lazy-image-placeholder"
    style={{ backgroundImage: `url(${backgroundImage})`, ...placeholderStyle }}
    aria-hidden="true"
  >
    {placeholderSrc && !placeholderContent && (
      <img src={placeholderSrc} alt="Placeholder" class="lazy-image-placeholder" aria-hidden="true" />
    )}
    {placeholderContent}
  </div>
);

// Component to show loading spinner
const LoadingSpinner = () => (
  <div class="lazy-image-loading" aria-live="polite">
    <div class="spinner" role="progressbar" aria-valuetext="Loading image" />
  </div>
);

// Component to handle error state
const ErrorState = ({ onError }) => (
  <div class="lazy-image-error" role="alert">
    <span role="img" aria-label="Error">⚠️</span>
    <p>Image failed to load. Please try refreshing the page.</p>
  </div>
);

// Main LazyImage Component
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
  threshold,
  ...props
}) => {
  const elementRef = useRef(null);
  const features = useFeatureDetection(format);
  const inView = useLazyLoading(features, elementRef, { critical, threshold });
  const { loadState, handleLoad, handleError } = useImageLoadState(retryAttempts, retryDelay);
  const { currentSrc, webpPolyfillLoaded } = useWebPPolyfill(format, src);

  const [quality, setQuality] = useState('low');

  useEffect(() => {
    if (loadState === 'loaded' && quality === 'low') {
      const highQualityImage = new Image();
      highQualityImage.src = src;
      highQualityImage.onload = () => setQuality('high');
    }
  }, [loadState, quality, src]);

  const imageProps = useMemo(() => ({
    ref: elementRef,
    src: features.supportsLazyLoading || inView ? currentSrc : undefined,
    srcSet,
    sizes,
    alt,
    onLoad: (e) => {
      handleLoad();
      if (onLoad) onLoad(e);
    },
    onError: (e) => {
      handleError();
      if (onError) onError(e);
    },
    loading: critical || features.supportsLazyLoading ? 'eager' : 'lazy',
    width,
    height,
    crossOrigin: 'anonymous',
    ...props,
  }), [features.supportsLazyLoading, inView, currentSrc, srcSet, sizes, alt, critical, width, height, props, handleLoad, handleError, onLoad, onError]);

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
          <ImagePlaceholder
            placeholderSrc={placeholderSrc}
            placeholderContent={placeholderContent}
            placeholderStyle={placeholderStyle}
            backgroundImage={backgroundImage}
          />
        )}
        {inView && (
          <iframe
            {...imageProps}
            src={currentSrc}
            title={alt}
          />
        )}
        {loadState === 'loading' && <LoadingSpinner />}
        {loadState === 'error' && <ErrorState onError={onError} />}
      </div>
    );
  }

  return (
    <div 
      class="lazy-image-container" 
      style={{ width, height }} 
      ref={elementRef}
      role={loadState === 'loaded' ? 'img' : undefined}
      aria-label={loadState === 'loaded' ? alt : undefined}
    >
      <ImagePlaceholder
        placeholderSrc={placeholderSrc}
        placeholderContent={placeholderContent}
        placeholderStyle={placeholderStyle}
        backgroundImage={backgroundImage}
      />
      {loadState === 'loading' && <LoadingSpinner />}
      {(inView || features.supportsLazyLoading || critical) && (
        <picture>
          {format === 'webp' && (features.webPSupport.lossy || webpPolyfillLoaded) && (
            <source srcSet={srcSet} sizes={sizes} type="image/webp" />
          )}
          <source srcSet={srcSet} sizes={sizes} />
          <img
            {...imageProps}
            src={quality === 'high' ? currentSrc : (lowResSrc || currentSrc)}
            alt={alt}
            class={`lazy-image-loaded ${loadState === 'error' ? 'lazy-image-error' : ''}`}
            aria-live={loadState === 'error' ? 'assertive' : 'polite'}
          />
        </picture>
      )}
      {loadState === 'error' && <ErrorState onError={onError} />}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholderSrc: PropTypes.string,
  placeholderContent: PropTypes.node,
  placeholderStyle: PropTypes.object,
  srcSet: PropTypes.string,
  sizes: PropTypes.string,
  lowResSrc: PropTypes.string,
  retryAttempts: PropTypes.number,
  retryDelay: PropTypes.number,
  isIframe: PropTypes.bool,
  backgroundImage: PropTypes.string,
  format: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  critical: PropTypes.bool,
  threshold: PropTypes.string,
};

export default LazyImage;
