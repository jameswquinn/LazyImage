# LazyImage Component

LazyImage is a Preact component for lazy loading images with support for WebP, placeholders, and fallbacks.

## Features

- Lazy loading of images as they enter the viewport
- WebP support with automatic fallback to JPEG
- Placeholder image support
- Loading spinner
- Error handling with customizable error messages
- Responsive image support with srcSet and sizes
- Customizable styling

## Installation

1. Copy the `LazyImage.js` and `LazyImage.css` files into your project.
2. Install the necessary dependencies:

```bash
npm install preact
```

## Usage

Import the LazyImage component in your Preact application:

```jsx
import { h } from 'preact';
import LazyImage from './LazyImage';

const MyComponent = () => (
  <LazyImage
    src="https://example.com/image.jpg"
    alt="Example image"
    width={300}
    height={200}
    placeholderSrc="https://example.com/placeholder.jpg"
  />
);
```

For more detailed usage examples, refer to the API documentation.

## Browser Support

LazyImage uses the Intersection Observer API for lazy loading. For browsers that don't support this API, it will fall back to loading images immediately. A polyfill is automatically loaded for better compatibility.

## Customization

The appearance of the LazyImage component can be customized by overriding the CSS classes. Refer to the CSS README for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
