# Theme System Documentation

## Overview

Your SellerRep application now has a complete dark/light theme system using CSS custom properties (variables). The theme system respects user preferences and saves the selection to localStorage.

## Color Variables

### Dark Theme (Default)

```css
--bg: #0f1115 /* Main background */ --card: #151923 /* Card background */
  --ink: #e6e6e6 /* Main text color */ --muted: #a9b1c3
  /* Muted/secondary text */ --accent: #f9d648 /* Accent yellow */
  --link: #7cc0ff /* Link/primary blue */ --ok: #39d98a /* Success green */
  --warn: #ffb020 /* Warning orange */ --no: #ff5d5d /* Error/danger red */
  --border: #2a3140 /* Border color */;
```

### Light Theme

```css
--bg: #f8f9fc /* Main background */ --card: #ffffff /* Card background */
  --ink: #000000 /* Main text color */ --muted: #000000
  /* Muted/secondary text */ --accent: #f5b042 /* Accent yellow */
  --link: #0066cc /* Link/primary blue */ --ok: #1f8b4c /* Success green */
  --warn: #cc7a00 /* Warning orange */ --no: #c23d3d /* Error/danger red */
  --border: #dce3ec /* Border color */;
```

## How It Works

### 1. Theme Toggle Button

A theme toggle button (☀️ / 🌙) is displayed in the top-right corner of the application. Click it to switch between dark and light themes.

### 2. Theme Persistence

The selected theme is saved to localStorage with the key `sellerRep-theme`:

- Value: `'dark'` for dark theme
- Value: `'light'` for light theme

### 3. System Preference Detection

If no saved preference exists, the system will check the user's OS theme preference using:

```javascript
window.matchMedia("(prefers-color-scheme: dark)").matches;
```

### 4. Smooth Transitions

All color properties have smooth CSS transitions for a pleasant theme switching experience:

```css
transition:
  background-color 0.3s ease,
  color 0.3s ease;
```

## File Structure

### New Files

- `frontend/public/theme.js` - Theme initialization and toggle logic
- `frontend/src/components/ThemeToggle.jsx` - React component for theme toggle button

### Modified Files

- `frontend/public/index.html` - Updated to load theme.js early
- `frontend/src/index.css` - CSS variables and base styles
- `frontend/src/App.css` - Global component styles
- `frontend/src/App.jsx` - Integrated ThemeToggle component
- `frontend/src/pages/*.css` - All page styles updated to use variables
- `frontend/src/pages/Admin/*.css` - Admin page styles updated

## Using Theme Colors in Your Code

### In CSS Files

```css
.my-component {
  background: var(--card);
  color: var(--ink);
  border: 1px solid var(--border);
}

.my-button {
  background: var(--link);
  color: var(--bg);
}
```

### In JSX (Inline Styles)

```jsx
<div
  style={{
    backgroundColor: "var(--card)",
    color: "var(--ink)",
  }}
>
  Content
</div>
```

### JavaScript

```javascript
const bgColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--bg")
  .trim();
```

## Backward Compatibility

Legacy color variable names are also available for compatibility:

- `--primary-color` → maps to `--link`
- `--secondary-color` → maps to `--muted`
- `--success-color` → maps to `--ok`
- `--danger-color` → maps to `--no`
- `--warning-color` → maps to `--warn`
- `--border-color` → maps to `--border`
- `--text-dark` → maps to `--ink`
- `--text-light` → maps to `--muted`

## Customization

### Adding a New Theme Color

1. Add the variable to `:root` for dark theme
2. Add the variable override to `:root.light-theme`
3. Update CSS components to use the new variable

Example:

```css
:root {
  --custom: #some-color;
}

:root.light-theme {
  --custom: #another-color;
}
```

### Modifying Theme Colors

Simply update the hex values in `frontend/src/index.css`:

```css
:root {
  --link: #new-color; /* Dark theme link color */
}

:root.light-theme {
  --link: #new-color; /* Light theme link color */
}
```

All components using `var(--link)` will automatically update.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Custom Properties (CSS Variables) support required
- Works with CSS-in-JS and inline styles

## Troubleshooting

### Theme not applying on first load?

The `theme.js` script must load before the React app renders. Check that it's in the `<head>` section of `index.html` before other scripts.

### Theme not persisting?

Check if localStorage is enabled in the browser and not disabled by settings.

### Colors not smooth transitioning?

Ensure all elements have `transition` properties. The base styles apply to `body` and major components.

## Future Enhancements

Consider adding:

- Multiple theme options (beyond dark/light)
- Per-component theme overrides
- Theme scheduler (auto-switch at specific times)
- Advanced color palette customization UI
