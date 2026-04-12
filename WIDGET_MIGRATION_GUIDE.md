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
The widget can be customized using either a global JavaScript object (recommended) or HTML `data-` attributes.

### Option A: Global JavaScript Object (Preferred)
Define a configuration object in your host site's script before or after loading the widget. This is the cleanest way to manage multiple settings.

```javascript
window.RB_WIDGET_CONFIG = {
  branding: {
    primaryColor: '#000000',
    fontFamily: 'Georgia, serif',
    borderRadius: '12px',
    showLogo: true,
    logoUrl: '/assets/my-logo.png'
  },
  texts: {
    welcomeTitle: 'Chiedi una consulenza',
    mainButton: 'Inizia Ora'
  },
  layout: {
    scrollableSteps: {
      home: false,       // Fixes home teaser to container height
      success: false,    // Prevents unnecessary bounce on confirmation
      contact: true      // Ensures long forms are scrollable
    }
  },
  branding: {
    typography: {
      baseSize: '14px',     // Default body text
      titleSize: '20px',    // Main step titles
      buttonSize: '16px',   // Buttons and clickable list items
      headingSize: '13px',  // Small uppercase headers
      smallSize: '11px'     // Tiny details and error messages
    }
  }
};
```

### Option B: HTML Data Attributes
Useful for quick adjustments or non-developer environments.

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-primary-color` | Main brand color | `#e11d48` |
| `data-font-family` | Widget typography | `'Outfit', sans-serif` |
| `data-show-logo` | Toggle footer logo (`true`/`false`) | `true` |
| `data-logo-url` | Path for the clinic logo | `/img/logo.png` |
| `data-typography-base` | Base font size | `14px` |

## 5. Layout & Scrolling Control
The widget allows granular control over vertical scrolling for each step. This is critical when the host site container is very tall or very small.

- **Scenario: Tall Container (>700px):** Disable scroll for "home" and "success" to create a premium, non-bouncing app-like feel.
- **Scenario: Small Container (<500px):** Keep all steps scrollable (`true`) to ensure buttons at the bottom are reachable.

## 6. Typography System
The widget uses CSS variables (`--f-base`, `--f-title`, etc.) for all text elements. This ensures perfect alignment with the host site's visual identity.

- **`baseSize`**: Standard information and labels.
- **`titleSize`**: H1/H2 headings at the top of each view.
- **`buttonSize`**: Main action buttons and interactive service names.
- **`headingSize`**: Small, bold, uppercase section labels.
- **`smallSize`**: Disclaimer texts, errors, and footnotes.

---
*Priority: Global JS Object > Data Attributes > Default Config*

---
*Last updated: 2026-04-12 (implemented configurable typography)*
