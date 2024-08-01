import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import './LazyImage.css';  // Import the CSS file

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
  ...props 
}) => {
  const [inView, setInView] = useState(false);
  const [loadState, setLoadState] = useState('initial'); // 'initial', 'loading', 'loaded', 'error'
  const [webPSupported, setWebPSupported] = useState(null);
  const [intersectionObserverSupported, setIntersectionObserverSupported] = useState('IntersectionObserver' in window);
  const imgRef = useRef(null);

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

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [intersectionObserverSupported]);

  const handleLoad = () => {
    setLoadState('loaded');
  };

  const handleError = () => {
    setLoadState('error');
  };

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
        />
      )}
      {loadState === 'loading' && (
        <div className="lazy-image-loading" />
      )}
      {inView && webPSupported !== null && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-image ${loadState === 'loaded' ? 'loaded' : ''}`}
          {...props}
        />
      )}
      {loadState === 'error' && (
        <div className="lazy-image-error">
          <span className="lazy-image-error-icon">⚠️</span>
          <p>Image failed to load</p>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
