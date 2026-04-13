# Protocollo di Configurazione Booking Widget R.B. Dental (v3.2 Final)

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
      mobileTitleSize: '18px', // <--- Nuova: Dimensione specifica per mobile (<1024px)
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
    termsUrl: 'none',   // <--- Usa 'none' se la pagina non è pronta
    privacyUrl: 'none', // <--- Usa 'none' se la pagina non è pronta
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

### 🎨 Branding & Tipografia
- `primaryColor`: Colore principale (es: `#005b88`).
- `borderRadius`: Arrotondamento card e bottoni (es: `24px`).
- `typography.buttonTextColor`: Colore del testo sui pulsanti (default: `#ffffff`).
- `typography.titleSize`: Dimensione titoli desktop (es: `30px`).
- `typography.mobileTitleSize`: Dimensione titoli mobile/tablet <1024px (default: `22px`).

### ⚙️ Layout & Links
- `dashboardUrl`: URL per il reindirizzamento alla dashboard (es: `/dashboard`).
- `termsUrl`: Link Termini e Condizioni. Usa `'none'` per disabilitare il link.
- `privacyUrl`: Link Privacy Policy. Usa `'none'` per disabilitare il link.
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
- **Mobile Responsive**: Il widget scala automaticamente i titoli usando `mobileTitleSize` quando la larghezza dello schermo è inferiore a 1024px.
- **Portal Strategy**: Quando espanso, il widget si sposta automaticamente alla fine del `<body>` per superare qualsiasi conflitto di `z-index` o `navbar` del sito ospite.
- **Cache**: Se le modifiche non appaiono, carica lo script con un parametro: `widget.iife.js?v=3.2`.

## 4. Debugging
Apri la console (F12) per verificare i log:
- `🔄 WIDGET CONFIG MERGED`: Mostra l'oggetto configurazione finale applicato.

---
*Ultimo aggiornamento: 13 Aprile 2026 (v3.2 Enterprise Release)*
