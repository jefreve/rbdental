export interface ClinicConfig {
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    borderRadius: string;
    preset: 'Modern' | 'Classic' | 'Minimal';
    showLogo?: boolean;
    logoUrl?: string;
    typography?: {
      baseSize?: string;        // Default: 14px
      titleSize?: string;       // Default: 18px (titles)
      headingSize?: string;     // Default: 13px (uppercase headers)
      buttonSize?: string;      // Default: 16px
      smallSize?: string;       // Default: 12px
      titleLetterSpacing?: string; // Default: normal
      titleWeight?: string;        // Default: 700
      titleColor?: string;         // Default: inherit
      buttonLetterSpacing?: string; // Default: normal
      baseWeight?: string;         // Default: 400
      buttonTextColor?: string;    // Default: #ffffff
    };
  };
  layout: {
    scrollableSteps: {
      home: boolean;
      treatment: boolean;
      datetime: boolean;
      doctor: boolean;
      contact: boolean;
      success: boolean;
    };
    headerStyle?: 'solid' | 'minimal'; // solid = colored background, minimal = clean white
    verticalGap?: string;              // Space between elements (e.g. '1.5rem')
    buttonWidth?: string;              // Custom button width (e.g. '100%' or '240px')
    showButtonIcon?: boolean;          // Show arrow icon in primary buttons
    dashboardUrl?: string;
    termsUrl?: string; // <--- Nuova proprietà per i termini
    privacyUrl?: string; // <--- Nuova proprietà per la privacy
  };
  insurances?: string[];
  texts?: {
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    mainButton?: string;
    treatmentTitle?: string;
    treatmentSubtitle?: string;
    datetimeTitle?: string;
    datetimeSubtitle?: string;
    doctorTitle?: string;
    doctorSubtitle?: string;
    contactTitle?: string;
    contactSubtitle?: string;
    contactButton?: string;
    successTitle?: string;
    successMessage?: string;
    successDashboardButton?: string;
    widgetTitle?: string;
  };
}

export const clinicConfig: ClinicConfig = {
  branding: {
    primaryColor: "#005b88", // Colore principale: utilizzato per pulsanti primari, icone attive e elementi chiave
    secondaryColor: "#F1F5F9", // Colore secondario: perfetto per sfondi di contrasto, hover e card
    accentColor: "#F43F5E", // Colore accento: ideale per badge, puntini di notifica o elementi highlight
    fontFamily: "'Outfit', sans-serif", // Font di sistema o Google Fonts: cambia l'intera tipografia del widget
    borderRadius: "1.5rem", // Arrotondamento angoli: da 0rem (vivi) a 1rem+ (molto rotondi/bolla)
    preset: "Modern", // Preset di stile: "Modern" (soft gradients), "Classic" (serio), "Minimal" (flat design)
    typography: {
      baseSize: "14px",
      titleSize: "18px",
      headingSize: "13px",
      buttonSize: "16px",
      smallSize: "12px",
      titleLetterSpacing: "normal",
      titleWeight: "700",
      titleColor: "inherit",
      buttonLetterSpacing: "normal",
      baseWeight: "400",
      buttonTextColor: "#ffffff"
    }
  },
  layout: {
    scrollableSteps: {
      home: false,
      treatment: true,
      datetime: true,
      doctor: true,
      contact: true,
      success: false
    },
    headerStyle: "solid",
    verticalGap: "1rem",
    buttonWidth: "100%",
    showButtonIcon: false,
    dashboardUrl: "dashboard.html",
    termsUrl: "terms.html",
    privacyUrl: "privacy.html"
  },
  texts: {
    welcomeTitle: "Prenota una visita in pochi secondi",
    welcomeSubtitle: "Siamo qui per aiutarti a trovare l'orario perfetto",
    mainButton: "Prenota",
    treatmentTitle: "Seleziona un Trattamento",
    treatmentSubtitle: "Scegli il servizio di cui hai bisogno",
    datetimeTitle: "Scegli Data e Ora",
    datetimeSubtitle: "Seleziona il momento più comodo per te",
    doctorTitle: "Scegli il tuo Dottore",
    doctorSubtitle: "Il nostro team di esperti al tuo servizio",
    contactTitle: "I tuoi contatti",
    contactSubtitle: "Completa la prenotazione con i tuoi dati",
    contactButton: "Conferma Prenotazione",
    successTitle: "Prenotazione Confermata!",
    successMessage: "Riceverai un'email di conferma a breve.",
    successDashboardButton: "Dashboard"
  }
};

// In ContactForm component:
// <label className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
//   Prenotando l'appuntamento, accetti i nostri <a href={config.layout?.termsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">termini e condizioni</a> e confermi di aver letto e compreso la nostra <a href={config.layout?.privacyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">informativa privacy</a>.
// </label>
