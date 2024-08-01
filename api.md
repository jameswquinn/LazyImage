# LazyImage API Documentation

## Props

The LazyImage component accepts the following props:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| src | string | Yes | - | The source URL of the image to be loaded |
| alt | string | Yes | - | Alternative text for the image |
| width | number | Yes | - | The width of the image container |
| height | number | Yes | - | The height of the image container |
| placeholderSrc | string | No | - | URL of a placeholder image to show while the main image is loading |
| srcSet | string | No | - | Comma-separated list of image URLs and their widths for responsive images |
| sizes | string | No | - | Media conditions indicating which image size to use |

Any additional props passed to the component will be forwarded to the underlying `<img>` element.

## Usage

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

## Behavior

- The component will lazy load images as they enter the viewport.
- If WebP images are not supported by the browser, it will automatically fall back to JPEG.
- If the Intersection Observer API is not supported, it will load images immediately.
- A loading spinner will be shown while the image is loading.
- If the image fails to load, an error message will be displayed.
