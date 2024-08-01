import { h } from 'preact';
import LazyImage from './LazyImage';

const ExampleComponent = () => {
  return (
    <div>
      {/* Basic usage */}
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Example image"
        width={300}
        height={200}
      />

      {/* With placeholder */}
      <LazyImage
        src="https://example.com/large-image.jpg"
        alt="Large image with placeholder"
        width={600}
        height={400}
        placeholderSrc="https://example.com/placeholder.jpg"
      />

      {/* WebP image with JPEG fallback */}
      <LazyImage
        src="https://example.com/image.webp"
        alt="WebP image with fallback"
        width={400}
        height={300}
      />

      {/* Responsive image with srcSet and sizes */}
      <LazyImage
        src="https://example.com/image-1x.jpg"
        srcSet="https://example.com/image-1x.jpg 1x, https://example.com/image-2x.jpg 2x"
        sizes="(max-width: 600px) 100vw, 600px"
        alt="Responsive image"
        width={600}
        height={400}
      />

      {/* Image with additional props */}
      <LazyImage
        src="https://example.com/profile.jpg"
        alt="Profile picture"
        width={150}
        height={150}
        style={{ borderRadius: '50%' }}
        onClick={() => console.log('Image clicked')}
      />

      {/* LazyImage in a grid layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <LazyImage
            key={num}
            src={`https://example.com/image${num}.jpg`}
            alt={`Grid image ${num}`}
            width={200}
            height={150}
          />
        ))}
      </div>

      {/* LazyImage with error handling */}
      <LazyImage
        src="https://example.com/nonexistent-image.jpg"
        alt="This image will fail to load"
        width={300}
        height={200}
        onError={() => console.log('Image failed to load')}
      />
    </div>
  );
};

export default ExampleComponent;
