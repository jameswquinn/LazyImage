# LazyImage Component API Documentation

## Props

The LazyImage component accepts the following props:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| src | string | Yes | - | The source URL of the image or iframe |
| alt | string | Yes | - | Alternative text for the image (also used as iframe title) |
| width | number or string | No | - | The width of the image or iframe |
| height | number or string | No | - | The height of the image or iframe |
| placeholderSrc | string | No | - | URL of a placeholder image to show while loading |
| placeholderContent | node | No | - | React node to display as placeholder content |
| placeholderStyle | object | No | - | Additional styles for the placeholder |
| srcSet | string | No | - | The srcset attribute for responsive images |
| sizes | string | No | - | The sizes attribute for responsive images |
| lowResSrc | string | No | - | URL of a low-resolution version of the image for slow networks |
| retryAttempts | number | No | 3 | Number of retry attempts if loading fails |
| retryDelay | number | No | 1000 | Delay (in ms) between retry attempts |
| isIframe | boolean | No | false | Set to true if loading an iframe instead of an image |
| backgroundImage | string | No | lightGrayGif | URL or data URI for the background of the placeholder |
| format | string | No | '' | Image format (set to 'webp' to enable WebP support) |
| onLoad | function | No | - | Callback function called when the image/iframe loads successfully |
| onError | function | No | - | Callback function called when the image/iframe fails to load |

## Usage Examples

### Basic Usage

```jsx
<LazyImage
  src="path/to/image.jpg"
  alt="A beautiful landscape"
  width={800}
  height={600}
/>
```

### With Responsive Images

```jsx
<LazyImage
  src="path/to/image.jpg"
  alt="A responsive image"
  srcSet="path/to/image-320w.jpg 320w, path/to/image-480w.jpg 480w, path/to/image-800w.jpg 800w"
  sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"
  width="100%"
  height="auto"
/>
```

### With WebP Support

```jsx
<LazyImage
  src="path/to/image.webp"
  alt="A WebP image"
  format="webp"
  width={600}
  height={400}
/>
```

### Loading an Iframe

```jsx
<LazyImage
  src="https://www.example.com/embed"
  alt="An embedded iframe"
  isIframe={true}
  width="100%"
  height={400}
/>
```

### With Custom Placeholder

```jsx
<LazyImage
  src="path/to/image.jpg"
  alt="Image with custom placeholder"
  width={500}
  height={300}
  placeholderContent={<div>Loading...</div>}
  placeholderStyle={{ backgroundColor: '#f0f0f0', color: '#333' }}
/>
```

## Features

- Lazy loading of images and iframes
- Support for WebP images with fallback to other formats
- Responsive image loading with srcSet and sizes
- Custom placeholders and loading indicators
- Error handling with retry mechanism
- Support for slow network conditions
- Accessibility features with proper ARIA attributes
- Fade-in effect for loaded images
- Automatic feature detection and polyfill loading for older browsers
