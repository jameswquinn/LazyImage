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

## Detailed Prop Descriptions

### src (required)
The source URL of the image or iframe to be loaded. This is the primary content that will be lazy-loaded.

### alt (required)
Alternative text for the image. This is crucial for accessibility. For iframes, this text is used as the iframe's title.

### width
The width of the image or iframe. Can be a number (interpreted as pixels) or a string (e.g., '100%').

### height
The height of the image or iframe. Can be a number (interpreted as pixels) or a string (e.g., '100%').

### placeholderSrc
URL of an image to be shown while the main image is loading. This should typically be a small, low-quality image that loads quickly.

### placeholderContent
A React node to be displayed while the image or iframe is loading. This can be used instead of or in addition to placeholderSrc.

### placeholderStyle
An object containing CSS styles to be applied to the placeholder.

### srcSet
A string containing image sources and their sizes for responsive images. This follows the standard srcset attribute format.

### sizes
A string specifying image sizes for different viewport sizes. This is used in conjunction with srcSet for responsive images.

### lowResSrc
URL of a low-resolution version of the image. This is used on slow network connections to provide faster initial load times.

### retryAttempts
The number of times the component should attempt to reload the image or iframe if it fails to load. Default is 3.

### retryDelay
The delay in milliseconds between retry attempts. Default is 1000ms (1 second).

### isIframe
Set to true if the component should load an iframe instead of an image. This changes the component's behavior and rendering.

### backgroundImage
URL or data URI of an image to use as the background of the placeholder. Default is a light gray 1x1 pixel GIF.

### format
Specifies the image format. Set to 'webp' to enable WebP support with automatic fallback for non-supporting browsers.

### onLoad
A callback function that is called when the image or iframe successfully loads.

### onError
A callback function that is called if the image or iframe fails to load after all retry attempts.

## Usage Examples

### Basic Usage

```javascript
<LazyImage
  src="path/to/image.jpg"
  alt="A beautiful landscape"
  width={800}
  height={600}
/>
```

### With Responsive Images

```javascript
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

```javascript
<LazyImage
  src="path/to/image.webp"
  alt="A WebP image"
  format="webp"
  width={600}
  height={400}
/>
```

### Loading an Iframe

```javascript
<LazyImage
  src="https://www.example.com/embed"
  alt="An embedded iframe"
  isIframe={true}
  width="100%"
  height={400}
/>
```

### With Custom Placeholder

```javascript
<LazyImage
  src="path/to/image.jpg"
  alt="Image with custom placeholder"
  width={500}
  height={300}
  placeholderContent={<div>Loading...</div>}
  placeholderStyle={{ backgroundColor: '#f0f0f0', color: '#333' }}
/>
```

### With Low-Res Image for Slow Networks

```javascript
<LazyImage
  src="path/to/high-res-image.jpg"
  lowResSrc="path/to/low-res-image.jpg"
  alt="Image with low-res fallback"
  width={800}
  height={600}
/>
```

### With Load and Error Callbacks

```javascript
<LazyImage
  src="path/to/image.jpg"
  alt="Image with callbacks"
  width={600}
  height={400}
  onLoad={() => console.log('Image loaded successfully')}
  onError={(error) => console.error('Image failed to load', error)}
/>
```

## Notes

- The component automatically handles lazy loading based on browser support. It will use native lazy loading if available, falling back to Intersection Observer API with a polyfill for older browsers.
- WebP images are automatically handled when the `format` prop is set to 'webp'. The component will use WebP in supporting browsers and fall back to the specified `src` in non-supporting browsers.
- For best performance, provide appropriately sized images and use the `srcSet` and `sizes` props for responsive images.
- When using with iframes, ensure that the content being loaded is from a trusted source and complies with your site's Content Security Policy (CSP).
