# LazyImage CSS README

The LazyImage component uses a separate CSS file for styling. This document explains the structure of the CSS and how to customize it.

## CSS Classes

- `.lazy-image-container`: The main container for the LazyImage component.
- `.lazy-image-placeholder`: Styles for the placeholder image.
- `.lazy-image-loading`: Styles for the loading spinner.
- `.lazy-image`: Styles for the main image.
- `.lazy-image.loaded`: Styles applied to the main image when it's fully loaded.
- `.lazy-image-error`: Styles for the error message container.
- `.lazy-image-error-icon`: Styles for the error icon.

## Customization

To customize the appearance of the LazyImage component, you can override these classes in your own CSS file. For example:

```css
.lazy-image-container {
  background: #e0e0e0; /* Change the background color */
}

.lazy-image-loading {
  border-top-color: #ff0000; /* Change the color of the loading spinner */
}

.lazy-image-error {
  color: #ff0000; /* Change the color of the error message */
}
```

Make sure your custom styles are loaded after the original LazyImage.css file to ensure they take precedence.

## Animations

The component includes a 'spin' animation for the loading spinner. You can customize this animation by modifying the `@keyframes spin` rule in your CSS.
