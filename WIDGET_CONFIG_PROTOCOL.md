# Protocollo di Configurazione Booking Widget R.B. Dental (v2.5 Final)

Questo protocollo permette un'integrazione "pixel-perfect" con il sito ospite tramite l'oggetto globale `window.RB_WIDGET_CONFIG`.

## 1. Struttura Configurazione
```javascript
window.RB_WIDGET_CONFIG = {
  branding: {
    primaryColor: '#005b88',
    fontFamily: 'Inter',
    borderRadius: '24px',
    typography: {
      titleSize: '22px',
      titleWeight: '800',
      titleColor: '#005b88',
      titleLetterSpacing: '0.15em',
      buttonLetterSpacing: '0.25em',
      baseWeight: '400'
    }
  },
  layout: {
    headerStyle: 'minimal',
    verticalGap: '3rem',
    showButtonIcon: false,
    dashboardUrl: '/dashboard', // <--- DA PERSONALIZZARE (es: '/dashboard', 'user-area.php', etc)
    scrollableSteps: {
      home: false,
      contact: true
    }
  },
  texts: {
    welcomeTitle: 'PRENOTA UNA VISITA',
    welcomeSubtitle: '',
    mainButton: 'INIZIA ORA'
  }
};
```

## 2. Guida all'Integrazione per Piattaforma

### 🚀 Next.js (App Router)
Usa il componente `Script` con la strategia `beforeInteractive` per caricare la configurazione prima del widget.
```tsx
import Script from 'next/script';

export default function BookingPage() {
  return (
    <>
      <Script id="widget-config" strategy="beforeInteractive">
        {`
          window.RB_WIDGET_CONFIG = {
            layout: { 
              dashboardUrl: '/account/appointments' // Percorso relativo interno a Next.js
            }
          };
        `}
      </Script>
      <div id="rb-booking-widget-root"></div>
      <Script src="https://rbdental-widget.vercel.app/widget.iife.js" strategy="afterInteractive" />
    </>
  );
}
```

### 🌐 WordPress / PHP
Inserisci lo script nel `header.php` o in un blocco HTML personalizzato.
```html
<script>
  window.RB_WIDGET_CONFIG = {
    layout: { 
      dashboardUrl: 'https://miosito.it/area-pazienti/' // URL assoluto
    }
  };
</script>
<div id="rb-booking-widget-root"></div>
<script src="https://rbdental-widget.vercel.app/widget.iife.js"></script>
```

### 📄 HTML Statico
```html
<script>
  window.RB_WIDGET_CONFIG = {
    layout: { 
      dashboardUrl: 'dashboard-v2.html' // Pagina locale
    }
  };
</script>
```

## 3. Note Tecniche
- **Limitazioni**: Se una proprietà non è elencata qui, non è attualmente modificabile.
- **Dashboard Link**: Il widget apre il link in una nuova scheda (`target="_blank"`) per non interrompere la navigazione dell'utente sul sito principale.
- **Cache**: Se non vedi le modifiche, aggiungi un parametro versione allo script: `widget.iife.js?v=1.1`.

---
*Ultimo aggiornamento: 13 Aprile 2026 (v2.5 Custom Dashboard URL)*
