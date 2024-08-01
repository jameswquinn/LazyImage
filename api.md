# LazyImage Component API Documentation

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | - | The source URL of the image |
| alt | string | - | Alternative text for the image |
| width | number/string | - | Width of the image |
| height | number/string | - | Height of the image |
| placeholderSrc | string | - | Source URL for a placeholder image |
| placeholderContent | node | - | React node to use as placeholder content |
| placeholderStyle | object | - | Style object for the placeholder |
| srcSet | string | - | Comma-separated list of image sources for different sizes |
| sizes | string | - | Sizes attribute for responsive images |
| lowResSrc | string | - | Low resolution version of the image for slow connections |
| retryAttempts | number | 3 | Number of retry attempts on load failure |
| retryDelay | number | 1000 | Initial delay (in ms) between retry attempts |
| isIframe | boolean | false | Set to true if the content is an iframe instead of an image |
| backgroundImage | string | lightGrayGif | Background image to use behind placeholders |
| format | string | '' | Image format (e.g., 'webp', 'svg') |
| critical | boolean | false | If true, the image will load immediately without lazy loading |
| onLoad | function | - | Callback function called when the image loads successfully |
| onError | function | - | Callback function called when the image fails to load |

## Usage

```jsx
import LazyImage from './LazyImage';

function MyComponent() {
  return (
    <LazyImage
      src="https://example.com/image.jpg"
      alt="Example image"
      width={300}
      height={200}
      placeholderSrc="https://example.com/placeholder.jpg"
      lowResSrc="https://example.com/low-res-image.jpg"
      srcSet="https://example.com/image-300w.jpg 300w, https://example.com/image-600w.jpg 600w"
      sizes="(max-width: 600px) 300px, 600px"
      format="webp"
      critical={false}
      onLoad={() => console.log('Image loaded')}
      onError={(error) => console.error('Image load error:', error)}
    />
  );
}
```

## Features

- Lazy loading with native support, Intersection Observer, or fallback timeout
- WebP support with automatic fallback to JPEG/PNG
- Placeholder image or content while loading
- Low-resolution image option for slow networks
- Retry mechanism with exponential backoff
- Support for responsive images with srcSet and sizes
- Special handling for SVG images
- iframe support
- Accessibility features including proper ARIA attributes
- Handles network condition changes

## Browser Support

The component aims to support all modern browsers. For older browsers:
- A polyfill for Intersection Observer is automatically loaded if needed
- A polyfill for WebP (webp-hero) is attempted if WebP images fail to load

Note: Ensure you have the necessary polyfills available in your project for maximum compatibility.
