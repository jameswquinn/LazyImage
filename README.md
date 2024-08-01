# LazyImage Component

LazyImage is a highly optimized, feature-rich React component for lazy loading images and iframes. It provides a seamless experience for users across different devices and network conditions while optimizing performance and resource usage.

## Features

- Lazy loading with multiple fallback mechanisms
- WebP support with automatic fallback
- Placeholder support (image or custom content)
- Low-resolution image option for slow networks
- Retry mechanism with exponential backoff
- Responsive image support (srcSet and sizes)
- Special handling for SVG images
- iframe support
- Accessibility features
- Comprehensive error handling
- Adapts to changing network conditions

## Installation

```bash
npm install lazy-image-component
```

or

```bash
yarn add lazy-image-component
```

## Usage

Here's a basic example of how to use the LazyImage component:

```jsx
import LazyImage from 'lazy-image-component';

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

## API

For a full list of props and their descriptions, please see the [API documentation](./API.md).

## Browser Support

LazyImage aims to support all modern browsers. For older browsers:
- A polyfill for Intersection Observer is automatically loaded if needed
- A polyfill for WebP (webp-hero) is attempted if WebP images fail to load

Ensure you have the necessary polyfills available in your project for maximum compatibility.

## Performance Considerations

- Uses native lazy loading when available
- Implements Intersection Observer for efficient lazy loading in supported browsers
- Adapts to network conditions, using lower resolution images on slow connections
- Implements retry mechanism with exponential backoff to handle temporary network issues

## Accessibility

- Provides proper alt text for images
- Uses ARIA attributes for loading and error states
- Ensures compatibility with screen readers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure that your code adheres to the existing style and that all tests pass before submitting a pull request.

## License

This project is licensed under the MIT License.
