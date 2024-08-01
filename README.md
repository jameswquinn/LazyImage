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

```javascript
import LazyImage from 'lazy-image-component';
```

Then use it in your JSX:

```javascript
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

## How It Works

The LazyImage component follows a series of logical steps to efficiently load and display images or iframes:

1. It first determines whether it's dealing with an image or an iframe.
2. For images, it checks for native lazy loading support, using it if available.
3. If native lazy loading isn't supported, it falls back to using the Intersection Observer API.
4. When Intersection Observer isn't supported, it attempts to load a polyfill.
5. It checks for WebP support and uses WebP images when possible for better performance.
6. The component assesses network conditions and may use a low-resolution image on slow connections.
7. As the image loads, it displays a loading spinner or custom placeholder.
8. Upon successful load, the image fades in smoothly.
9. If loading fails, it attempts to retry a configurable number of times before showing an error message.

Throughout this process, the component manages accessibility considerations and provides appropriate feedback to users and assistive technologies.

## Comparison to lazysizes

While lazysizes is a popular and feature-rich lazy loading library, our LazyImage component offers several advantages in certain use cases. Here's a comparison:

### LazyImage Advantages:

1. **React Integration**: LazyImage is built specifically for React applications, providing a more seamless integration with React's component model and lifecycle.

2. **No Additional Markup**: Unlike lazysizes, which requires additional classes and attributes in your HTML, LazyImage encapsulates all lazy loading logic within the component.

3. **Built-in WebP Support**: LazyImage includes native support for WebP images with automatic fallback, without requiring additional plugins.

4. **Iframe Support**: LazyImage can lazy load both images and iframes using the same component, simplifying implementation.

5. **React Server-Side Rendering**: LazyImage is designed to work well with server-side rendering in React applications.

6. **Customizable Placeholders**: LazyImage allows for easy implementation of custom placeholder content while images are loading.

7. **Automatic Polyfill Loading**: LazyImage automatically loads necessary polyfills for older browsers, reducing setup complexity.

### lazysizes Advantages:

1. **Framework Agnostic**: lazysizes works with any JavaScript framework or vanilla JavaScript, not just React applications.

2. **Extensive Plugin Ecosystem**: lazysizes has a wide range of plugins for additional functionality.

3. **Lighter Weight**: For simple use cases, lazysizes might have a smaller footprint as it's not tied to React.

4. **Mature and Battle-tested**: lazysizes has been around longer and is used in many production environments.

### When to Choose LazyImage:

- You're working on a React-based project and want a component that integrates seamlessly.
- You need built-in support for WebP images and iframes.
- You prefer a declarative approach with all logic encapsulated in a component.

### When to Choose lazysizes:

- Your project is not React-based or you need a framework-agnostic solution.
- You require some of the specific plugins or features offered by lazysizes.
- You're working on a very large site and need the battle-tested reliability of a more mature library.

Both LazyImage and lazysizes are excellent choices for implementing lazy loading. The best choice depends on your specific project requirements, tech stack, and preferences.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
