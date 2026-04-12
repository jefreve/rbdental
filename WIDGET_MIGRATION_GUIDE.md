# Widget Migration Guide: From React App to Embeddable Widget

This guide explains how to transform a standard React/Vite application into a self-contained, embeddable JavaScript widget that can be used on any external website with a single `<script>` tag.

## 1. Vite Configuration (Library Mode)
To bundle the entire app into a single JavaScript file, we use Vite's `lib` mode.

- **Format:** `iife` (Immediately Invoked Function Expression) is required for browser script tags.
- **CSS Injection:** Use `vite-plugin-css-injected-by-js` to bundle all CSS into the JS file, avoiding external `.css` files.
- **Environment Variables:** Define `process.env.NODE_ENV` in `vite.config.ts` to prevent "process is not defined" errors in the browser.

## 2. Shadow DOM for Style Isolation
To prevent the host website's CSS from breaking the widget (and vice versa), the entire app is wrapped in a Shadow DOM.

- **Implementation:** Use a `WidgetContainer` component that creates a shadow root.
- **Shadow DOM Isolation:** Wraps the app in a Shadow Root to prevent style leakage.
- **Selective Style Injection:** Clones all `<style>` tags from the host document into the shadow root (to support CSS-in-JS/Vite injections) but ignores `<link>` tags to prevent host site CSS/Font leakage.

## 3. Robust Self-Mounting Logic
The entry point (`main.tsx`) must handle the asynchronous nature of modern websites (like Next.js).

- **Retry Polling:** The script polls for a specific container ID (e.g., `rb-booking-widget-root`).
- **Dynamic Positioning:** Use `absolute` and `inset-0` to fill exactly the placeholder provided by the host.
- **Fallback:** If the specific container isn't found, the widget can auto-mount to the bottom of the `body`.

## 4. External Customization
The widget reads `data-` attributes from the host container to allow real-time branding adjustments without needing a rebuild.

### Available Attributes
| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-primary-color` | Changes the main brand color (buttons, icons, highlights) | `#e11d48` |
| `data-secondary-color` | Changes the background of some UI elements | `#f8fafc` |
| `data-font-family` | Changes the entire widget typography | `'Outfit', sans-serif` |
| `data-show-logo` | Toggle visibility of the footer logo (`true`/`false`) | `true` |
| `data-logo-url` | URL path for the clinic logo (required if show-logo is true) | `/img/logo.png` |

### How to use
```html
<div id="rb-booking-widget-root" 
     data-primary-color="#000000" 
     data-font-family="Georgia"
     data-show-logo="true"
     data-logo-url="https://yoursite.com/logo.png">
</div>
```

---
*Last updated: 2026-04-12*
