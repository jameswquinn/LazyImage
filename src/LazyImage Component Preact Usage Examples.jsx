// Simple Example
import { h } from 'preact';
import LazyImage from './LazyImage';

export const SimpleExample = () => (
  <LazyImage
    src="https://example.com/image.jpg"
    alt="A simple example image"
    width={300}
    height={200}
  />
);

// Responsive Example
import { h } from 'preact';
import LazyImage from './LazyImage';

export const ResponsiveExample = () => (
  <LazyImage
    src="https://example.com/image-1000w.jpg"
    alt="A responsive example image"
    width="100%"
    height="auto"
    srcSet="https://example.com/image-300w.jpg 300w, 
            https://example.com/image-600w.jpg 600w, 
            https://example.com/image-1000w.jpg 1000w"
    sizes="(max-width: 300px) 100vw, 
           (max-width: 600px) 50vw, 
           33vw"
    placeholderSrc="https://example.com/placeholder.jpg"
  />
);

// Complex Example
import { h } from 'preact';
import { useState } from 'preact/hooks';
import LazyImage from './LazyImage';

export const ComplexExample = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <LazyImage
        src="https://example.com/large-image.webp"
        alt="A complex example with WebP and fallback"
        width={800}
        height={600}
        format="webp"
        lowResSrc="https://example.com/low-res-image.jpg"
        srcSet="https://example.com/large-image-400w.webp 400w, 
                https://example.com/large-image-800w.webp 800w, 
                https://example.com/large-image-1200w.webp 1200w"
        sizes="(max-width: 400px) 100vw, 
               (max-width: 800px) 50vw, 
               33vw"
        placeholderContent={
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#f0f0f0' 
          }}>
            Loading...
          </div>
        }
        critical={false}
        retryAttempts={5}
        retryDelay={2000}
        onLoad={() => {
          console.log('Image loaded successfully');
          setImageLoaded(true);
        }}
        onError={(error) => console.error('Image load failed:', error)}
      />
      {imageLoaded && (
        <div style={{ 
          position: 'absolute', 
          bottom: '10px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.5)', 
          color: 'white', 
          padding: '5px' 
        }}>
          Image Loaded!
        </div>
      )}
    </div>
  );
};
