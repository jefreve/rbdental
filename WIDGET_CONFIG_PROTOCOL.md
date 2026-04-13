# Protocollo di Configurazione Booking Widget R.B. Dental (v2.3 Final)

Questo protocollo permette un'integrazione "pixel-perfect" con il sito ospite tramite l'oggetto globale `window.RB_WIDGET_CONFIG`.

## 1. Struttura Configurazione
```javascript
window.RB_WIDGET_CONFIG = {
  branding: {
    primaryColor: '#005b88',   // Colore principale
    fontFamily: 'Inter',      // Font caricato dal sito ospite
    borderRadius: '24px',     // Arrotondamento contenitore (consigliato 24px)
    
    typography: {
      titleSize: '22px',      // Dimensione titoli
      titleWeight: '800',     // Peso titoli (Bold/Black)
      titleColor: '#005b88',  // <--- AGGIUNTO: Colore titoli (es. Blu Dental)
      titleLetterSpacing: '0.15em', // Spaziatura titoli
      buttonLetterSpacing: '0.25em', // Spaziatura specifica pulsanti (es. INIZIA ORA)
      baseWeight: '400'       // Peso testo corpo
    }
  },
  layout: {
    headerStyle: 'minimal',   // 'minimal' (header bianco pulito) o 'solid' (barra blu)
    verticalGap: '3rem',      // Spaziatura tra gli elementi
    showButtonIcon: false,    // Mostra/Nasconde icona freccia nei pulsanti
    scrollableSteps: {
      home: false,            // Blocca scroll nella home per effetto "nativ"
      contact: true           // Attiva scroll per form lunghi
    }
  },
  texts: {
    welcomeTitle: 'PRENOTA UNA VISITA',
    welcomeSubtitle: '',     // Lasciare vuoto per nascondere il sottotitolo
    mainButton: 'INIZIA ORA'
  }
};
```

## 2. Note Tecniche Importanti
- **Header Minimal**: Quando si usa `headerStyle: 'minimal'`, il widget rimuove la barra colorata superiore. Assicurarsi che il contenitore del widget sul sito ospite abbia uno sfondo bianco o neutro.
- **Sottotitoli**: Passando una stringa vuata (`''`) a `welcomeSubtitle`, l'intero blocco (incluso lo spazio e l'icona informativa) viene rimosso.
- **Uppercase**: I pulsanti principali sono forzati automaticamente in maiuscolo per garantire la massima resa del `buttonLetterSpacing`.

## 3. Template Integrazione (Next.js / React)
```tsx
<Script id="rb-widget-config" strategy="beforeInteractive">
  {`
    window.RB_WIDGET_CONFIG = {
      branding: {
        primaryColor: '#005b88', 
        fontFamily: "'Roboto Slab', sans-serif",
        borderRadius: '24px', 
        typography: {
          titleWeight: '800',
          titleLetterSpacing: '0.15em',
          buttonLetterSpacing: '0.25em'
        }
      },
      layout: {
        headerStyle: 'minimal',
        verticalGap: '3rem',
        showButtonIcon: false
      },
      texts: {
        welcomeTitle: 'PRENOTA UNA VISITA',
        welcomeSubtitle: '',
        mainButton: 'INIZIA ORA'
      }
    };
  `}
</Script>
```

---
*Ultimo aggiornamento: 13 Aprile 2026 (v2.4 TitleColor Support)*

> [!IMPORTANT]
> **Limitazioni**: Se una proprietà o un elemento visivo non è esplicitamente elencato in questo protocollo, significa che non è attualmente modificabile tramite configurazione esterna.
