# LazyImage Component CSS

This document provides an overview of the CSS styles used in the LazyImage component. Understanding these styles will help you integrate the component into your project and customize its appearance if needed.

## File Structure

The styles are defined in `LazyImage.css`. This file should be in the same directory as your LazyImage component or in your project's styles directory.

## Usage

To use these styles, import the CSS file in your LazyImage component:

```javascript
import './LazyImage.css';
```

Adjust the import path if the CSS file is located elsewhere in your project structure.

## Style Classes

The CSS file defines several classes for different elements and states of the LazyImage component:

1. `.lazy-image-container`: The main container for the image.
2. `.lazy-image-placeholder`: Styles for the placeholder image or content.
3. `.lazy-image-loaded`: Styles for the actual image once it's loaded.
4. `.lazy-image-loading`: Styles for the loading state.
5. `.spinner`: Styles for the loading spinner animation.
6. `.lazy-image-error`: Styles for the error state.
7. `.lazy-iframe-container`: Styles for iframe content (if applicable).
8. `.lazy-iframe-placeholder`: Styles for iframe placeholders.
9. `.lazy-iframe-loading`: Styles for iframe loading state.
10. `.lazy-iframe-error`: Styles for iframe error state.

## Key Features

- **Smooth Transitions**: The component uses CSS transitions for smooth fading effects when loading images.
- **Flexible Sizing**: The images are set to cover their containers while maintaining aspect ratio.
- **Loading Spinner**: A CSS-only loading spinner is implemented for the loading state.
- **Error Handling**: Clear styling for error states to provide user feedback.
- **Responsive Design**: Basic responsive adjustments for smaller screens.
- **Accessibility**: High contrast mode support for better visibility in different display settings.

## Customization

To customize the appearance of the LazyImage component, you can either:

1. Modify the `LazyImage.css` file directly.
2. Override the styles in your own CSS file by using more specific selectors.

### Example of Overriding Styles

```css
/* In your own CSS file */
.my-custom-container .lazy-image-container {
  background-color: #e0e0e0; /* Change the background color */
}

.my-custom-container .spinner {
  border-top-color: #ff0000; /* Change the spinner color to red */
}
```

## Accessibility Considerations

- The CSS includes a media query for forced-colors mode, ensuring the component is usable in high contrast settings.
- Error messages use contrasting colors for better readability.
- The spinner uses border colors that adapt to high contrast mode.

## Performance Considerations

- The CSS uses hardware-accelerated properties (`transform`, `opacity`) for smooth animations.
- The file size is small and shouldn't significantly impact load times.
- Media queries are used to adjust styles for different screen sizes and display modes.

## Browser Support

The CSS uses standard properties and should work in all modern browsers. Some considerations:

- The `object-fit` property is used for image sizing, which has good support in modern browsers but may need a fallback for older browsers.
- The `@media (forced-colors: active)` query is used for high contrast mode, which is supported in modern browsers but will be ignored in browsers that don't support it.

## Contributing

If you have suggestions for improving the styles or want to add new features, please feel free to contribute. Ensure that any changes maintain the existing functionality and are thoroughly tested across different browsers and devices.

When contributing, consider:
- Cross-browser compatibility
- Accessibility implications
- Performance impact
- Responsiveness across different device sizes
