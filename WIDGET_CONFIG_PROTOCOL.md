# Protocollo di Configurazione Booking Widget R.B. Dental (v3.1 Final)

Questo protocollo permette un'integrazione "pixel-perfect" con il sito ospite tramite l'oggetto globale `window.RB_WIDGET_CONFIG`.

## 1. Struttura Configurazione Completa
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
      buttonTextColor: '#ffffff', // <--- Colore testo pulsanti
      titleLetterSpacing: '0.15em',
      buttonLetterSpacing: '0.25em',
      baseWeight: '400'
    }
  },
  layout: {
    headerStyle: 'minimal',
    verticalGap: '3rem',
    showButtonIcon: false,
    dashboardUrl: '/dashboard', 
    termsUrl: '#',   // <--- Usa '#' se la pagina non è pronta
    privacyUrl: '#', // <--- Usa '#' se la pagina non è pronta
    scrollableSteps: {
      home: false,
      contact: true
    }
  },
  texts: {
    // Step Home
    welcomeTitle: 'PRENOTA UNA VISITA',
    mainButton: 'INIZIA ORA',
    
    // Step Servizi
    treatmentTitle: 'Scegli un servizio',
    
    // Step Contatti
    contactTitle: 'I tuoi dati',
    contactButton: 'CONFERMA PRENOTAZIONE',
    
    // Schermata Successo
    successTitle: 'PRENOTAZIONE CONFERMATA!',
    successDashboardButton: 'VAI ALLA DASHBOARD'
  }
};
```

## 2. Proprietà Disponibili

### 🎨 Branding
- `primaryColor`: Colore principale (es: `#005b88`).
- `borderRadius`: Arrotondamento card e bottoni (es: `24px`).
- `typography.buttonTextColor`: Colore del testo sui pulsanti (default: `#ffffff`).
- `typography.titleSize`: Dimensione titoli (es: `30px`).

### ⚙️ Layout & Links
- `dashboardUrl`: URL per il reindirizzamento alla dashboard (es: `/dashboard`).
- `termsUrl`: Link Termini e Condizioni. Usa `'#'` per rendere il link inerte.
- `privacyUrl`: Link Privacy Policy. Usa `'#'` per rendere il link inerte.
- `scrollableSteps`: Abilita lo scroll interno per step specifici (es: `{ contact: true }`).

> [!TIP]
> Se imposti un URL come `'none'`, il testo non sarà cliccabile e apparirà in uno stile "dimmed" elegante. Usa `'#'` per mantenere il link ma bloccare il salto in alto (non consigliato se vuoi un'esperienza pulita).

### 📝 Testi (Texts)
Puoi sovrascrivere i testi di ogni step:
- `welcomeTitle`, `mainButton` (Home)
- `treatmentTitle`, `treatmentSubtitle` (Servizi)
- `datetimeTitle`, `doctorTitle` (Selezione)
- `contactTitle`, `contactButton` (Dati)
- `successTitle`, `successDashboardButton` (Fine)

## 3. Note Tecniche
- **Link Temporanei ('#')**: Se imposti un URL come `'#'`, il widget disabiliterà automaticamente l'apertura di nuove schede, ideale per pagine ancora in costruzione.
- **Cache**: Se le modifiche non appaiono, carica lo script con un parametro: `widget.iife.js?v=3.1`.

## 4. Debugging
Apri la console (F12) per verificare i log:
- `🔄 WIDGET CONFIG MERGED`: Mostra l'oggetto configurazione finale.
- `🔗 DASHBOARD LINK`: Conferma l'URL di destinazione.

---
*Ultimo aggiornamento: 13 Aprile 2026 (v3.1 Final Compliance)*
