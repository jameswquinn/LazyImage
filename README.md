# LazyImage Component

LazyImage is a versatile and performant React component for lazy loading images and iframes. It provides a smooth user experience with placeholder content, loading indicators, and error handling, while optimizing performance through lazy loading and responsive image techniques.

## Features

- Lazy loading of images and iframes
- Support for WebP images with automatic fallback
- Responsive image loading with srcSet and sizes
- Custom placeholders and loading indicators
- Error handling with configurable retry mechanism
- Optimized for slow network conditions
- Accessibility features with proper ARIA attributes
- Smooth fade-in effect for loaded images
- Automatic feature detection and polyfill loading for older browsers

## Installation

```bash
npm install lazy-image-component
```

or

```bash
yarn add lazy-image-component
```

## Usage

Import the LazyImage component in your React application:

```jsx
import LazyImage from 'lazy-image-component';
```

Then use it in your JSX:

```jsx
<LazyImage
  src="path/to/image.jpg"
  alt="Description of the image"
  width={800}
  height={600}
  placeholderSrc="path/to/placeholder.jpg"
  srcSet="path/to/image-320w.jpg 320w, path/to/image-480w.jpg 480w, path/to/image-800w.jpg 800w"
  sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"
/>
```

## API

For a full list of available props and detailed usage examples, please refer to the [API Documentation](./API.md).

## Browser Support

LazyImage is designed to work in all modern browsers. For older browsers that don't support the Intersection Observer API, a polyfill is automatically loaded to ensure compatibility.

## Performance Considerations

- LazyImage uses the Intersection Observer API (with a polyfill for older browsers) to efficiently detect when images enter the viewport.
- Images are only loaded when they come into view, reducing initial page load time and saving bandwidth.
- The component supports WebP images with automatic fallback, allowing for smaller file sizes in supporting browsers.
- For slow network conditions, a low-resolution version of the image can be specified to load first.

## Accessibility

LazyImage is built with accessibility in mind:
- Proper `alt` text is required for all images.
- ARIA attributes are used to communicate loading and error states to screen readers.
- The component ensures that non-visual users don't download images unnecessarily.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
