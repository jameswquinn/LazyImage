import { h } from 'preact';
import { useEffect, useRef, useState, useCallback } from 'preact/hooks';
import './LazyImage.css';

// Helper function to check WebP support
const checkWebPSupport = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Helper function to dynamically load WebP polyfill
const loadWebPPolyfill = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/webp-hero@0.0.2/dist-cjs/polyfills.js';
    script.onload = () => {
      const webpMachine = new window.webpHero.WebpMachine();
      webpMachine.polyfillDocument().then(resolve).catch(reject);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Helper function to load Intersection Observer polyfill
const loadIntersectionObserverPolyfill = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const LazyImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  placeholderSrc,
  errorComponent,
  retryAttempts = 3,
  retryDelay = 2000,
  timeout = 10000,
  onLoad,
  onError,
  lowBandwidth = false,
  maintainAspectRatio = false,
  ...props 
}) => {
  const [inView, setInView] = useState(false);
  const [loadState, setLoadState] = useState('initial');
  const [webPSupported, setWebPSupported] = useState(null);
  const [intersectionObserverSupported, setIntersectionObserverSupported] = useState('IntersectionObserver' in window);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleImageLoad = useCallback(() => {
    setLoadState('loaded');
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    if (retryCount < retryAttempts) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        setLoadState('loading');
        // Try next format in fallback chain
        setCurrentSrc(prevSrc => {
          if (prevSrc.endsWith('.webp')) return prevSrc.replace('.webp', '.jpg');
          if (prevSrc.endsWith('.jpg')) return prevSrc.replace('.jpg', '.png');
          return prevSrc; // No more fallbacks, will probably fail again
        });
      }, retryDelay * Math.pow(2, retryCount));
    } else {
      setLoadState('error');
      if (onError) onError();
    }
  }, [retryCount, retryAttempts, retryDelay, onError]);

  useEffect(() => {
    const checkSupport = async () => {
      const isWebPSupported = await checkWebPSupport();
      setWebPSupported(isWebPSupported);
      if (!isWebPSupported) {
        try {
          await loadWebPPolyfill();
          console.log('WebP polyfill loaded successfully');
        } catch (error) {
          console.error('Failed to load WebP polyfill:', error);
        }
      }

      if (!intersectionObserverSupported) {
        try {
          await loadIntersectionObserverPolyfill();
          setIntersectionObserverSupported(true);
          console.log('Intersection Observer polyfill loaded successfully');
        } catch (error) {
          console.error('Failed to load Intersection Observer polyfill:', error);
        }
      }
    };

    checkSupport();

    let observer;

    const setupIntersectionObserver = () => {
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setInView(true);
                setLoadState('loading');
                observer.unobserve(entry.target);
              }
            });
          },
          {
            rootMargin: '200px 0px',
            threshold: 0.01,
          }
        );

        if (imgRef.current) {
          observer.observe(imgRef.current);
        }
      } else {
        setInView(true);
        setLoadState('loading');
      }
    };

    if (intersectionObserverSupported) {
      setupIntersectionObserver();
    } else {
      setInView(true);
      setLoadState('loading');
    }

    // Check if initially in viewport
    if (imgRef.current && imgRef.current.getBoundingClientRect().top < window.innerHeight) {
      setInView(true);
      setLoadState('loading');
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [intersectionObserverSupported]);

  useEffect(() => {
    if (loadState === 'loading') {
      timeoutRef.current = setTimeout(() => {
        if (loadState !== 'loaded') {
          handleImageError();
        }
      }, timeout);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loadState, timeout, handleImageError]);

  useEffect(() => {
    // Reset state when src changes
    setLoadState('initial');
    setRetryCount(0);
    setCurrentSrc(src);
  }, [src]);

  // Low bandwidth mode
  useEffect(() => {
    if (lowBandwidth && currentSrc === src) {
      setCurrentSrc(src.replace(/\.(webp|jpg|png)$/, '-low.$1'));
    }
  }, [lowBandwidth, src, currentSrc]);

  const imageStyle = maintainAspectRatio
    ? { objectFit: 'contain', width: '100%', height: '100%' }
    : { width: '100%', height: '100%', objectFit: 'cover' };

  return (
    <div 
      className="lazy-image-container"
      style={{ width, height }}
    >
      {placeholderSrc && loadState !== 'loaded' && (
        <img
          src={placeholderSrc}
          alt=""
          className="lazy-image-placeholder"
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
      {loadState === 'loading' && (
        <div className="lazy-image-loading" role="alert" aria-label="Image is loading" />
      )}
      {inView && webPSupported !== null && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`lazy-image ${loadState === 'loaded' ? 'loaded' : ''}`}
          style={imageStyle}
          {...props}
        />
      )}
      {loadState === 'error' && (
        errorComponent || (
          <div className="lazy-image-error" role="alert">
            <span className="lazy-image-error-icon" aria-hidden="true">⚠️</span>
            <p>Image failed to load</p>
          </div>
        )
      )}
    </div>
  );
};

export default LazyImage;
