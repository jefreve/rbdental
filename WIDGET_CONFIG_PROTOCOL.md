# Protocollo di Configurazione Booking Widget R.B. Dental (v2.2 Final)

Questo protocollo permette un'integrazione "pixel-perfect" con il sito ospite tramite l'oggetto globale `window.RB_WIDGET_CONFIG`.

## 1. Branding & Tipografia Avanzata
```javascript
branding: {
  primaryColor: '#005b88',   // Colore principale (es. blu del tuo form)
  fontFamily: 'Outfit',      // Font caricato dal tuo sito
  borderRadius: '8px',       // Arrotondamento (es. 8px per stile squadrato)
  
  typography: {
    baseSize: '14px',        // Testo standard
    titleSize: '24px',       // Titoli principali (H1)
    buttonSize: '16px',      // Testo dei pulsanti
    
    // Configurazione Pesi e Tracking
    titleWeight: '800',      // Peso font titoli (es. bold/800)
    baseWeight: '400',       // Peso font corpo
    titleLetterSpacing: '0.1em',  // Spaziatura lettere titoli
    buttonLetterSpacing: '0.15em' // Tracking specifico per i pulsanti (es. INIZIA ORA)
  }
}
```

## 2. Layout & Integrazione Nativa
```javascript
layout: {
  // 'minimal': Sfondo trasparente (header bianco pulito)
  // 'solid': Barra colorata con Primary Color
  headerStyle: 'minimal', 
  
  // Spaziatura verticale tra gli elementi (Gap)
  verticalGap: '1.5rem', 

  // Personalizzazione Pulsanti
  buttonWidth: '100%',     // Larghezza custom (es. '100%' o '280px')
  showButtonIcon: true,    // Attiva la freccia (Send icon style) nel pulsante

  scrollableSteps: {
    home: false,    // Consigliato fisso per effetto "app"
    success: false,
    contact: true   // Scrollable per form lunghi
  }
}
```

## 3. Contenuti & Testi
**Nota:** Per rimuovere il sottotitolo (subtitle), passare una stringa vuota `''`.

```javascript
texts: {
  welcomeTitle: 'PRENOTA UNA VISITA',
  welcomeSubtitle: '',   // Lasciare vuoto per nascondere il sottotitolo
  mainButton: 'INIZIA ORA'
}
```

## 4. Template "Integrazione Invisibile" (Copia & Incolla)
Copia questo blocco per far sparire il widget dentro la tua pagina, facendolo sembrare programmato a mano:

```javascript
window.RB_WIDGET_CONFIG = {
  branding: {
    primaryColor: '#005b88', 
    fontFamily: "'Inter', sans-serif",
    borderRadius: '4px',
    typography: {
      titleSize: '24px',
      titleWeight: '800',
      titleLetterSpacing: '0.1em',
      buttonLetterSpacing: '0.15em', // Match dello spacing del tasto INVIA
      baseWeight: '400'
    }
  },
  layout: {
    headerStyle: 'minimal',
    verticalGap: '1.8rem',
    buttonWidth: '100%',
    showButtonIcon: false,
    scrollableSteps: { home: false, success: false }
  },
  texts: {
    welcomeTitle: 'PRENOTA UNA VISITA',
    welcomeSubtitle: '', // Niente sottotitolo
    mainButton: 'INIZIA ORA'
  }
};
```

---
*Ultimo aggiornamento: 12 Aprile 2026 (v2.2 Button Tracking Update)*
