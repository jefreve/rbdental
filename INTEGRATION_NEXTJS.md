# Integrazione Avanzata per Next.js

Per integrare il widget di R.B. Dental in un'applicazione Next.js (App Router o Pages Router) in modo "infallibile", segui questi passaggi.

## 1. Il Componente `BookingWidget`

Crea un componente che gestisce il caricamento dello script e la configurazione globale. Questo approccio assicura che `window.RB_WIDGET_CONFIG` sia pronto PRIMA o contemporaneamente al widget.

```tsx
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface WidgetProps {
  primaryColor?: string;
  welcomeTitle?: string;
}

export default function BookingWidget({ primaryColor = '#006E93', welcomeTitle }: WidgetProps) {
  useEffect(() => {
    // Definiamo la configurazione prima che il widget si monti
    window.RB_WIDGET_CONFIG = {
      branding: {
        primaryColor: primaryColor,
        borderRadius: '1.25rem',
        showLogo: true,
      },
      texts: {
        welcomeTitle: welcomeTitle || 'Prenota la tua visita',
        mainButton: 'Inizia Ora'
      }
    };
  }, [primaryColor, welcomeTitle]);

  return (
    <>
      {/* Placeholder del Widget */}
      <div 
        id="rb-booking-widget-root" 
        style={{ width: '100%', height: '600px', minHeight: '600px', position: 'relative' }}
      >
        {/* State di caricamento opzionale */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 animate-pulse rounded-2xl">
           <p className="text-slate-400 font-medium">Caricamento sistema di prenotazione...</p>
        </div>
      </div>

      {/* Script del Widget (Puntare alla URL del bundle generato) */}
      <Script 
        src="https://tuo-dominio.com/widget-rb-dental.js"
        strategy="afterInteractive"
      />
    </>
  );
}

// Dichiarazione tipi per TypeScript
declare global {
  interface Window {
    RB_WIDGET_CONFIG?: any;
  }
}
```

## 2. Perché questo metodo è "Infallibile"?

1.  **Lazy Loading**: Next.js carica lo script in modo ottimizzato (`afterInteractive`).
2.  **Config Reattiva**: Poiché il widget ora "aspetta" attivamente l'oggetto `window.RB_WIDGET_CONFIG` (grazie al polling implementato nel core), non importa se lo script arriva prima o dopo l'effetto di React.
3.  **Shadow DOM Isolation**: Non importa quali stili Tailwind o CSS globale usi nel tuo progetto Next.js, il widget rimarrà visivamente intatto.
4.  **Height Control**: Definendo `height` e `min-height` sul placeholder, eviti che il widget collassi o venga tagliato dal layout di Next.js.

## 3. Gestione dello Scroll

Il widget gestisce lo scroll internamente. Assicurati che il contenitore genitore in Next.js non abbia `overflow: hidden` se vuoi che il widget sia libero di espandersi o gestire i propri popup/banner di errore.
