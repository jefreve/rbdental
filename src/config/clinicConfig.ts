/**
 * CENTRAL BRANDING ENGINE - Configuration Source of Truth
 * 
 * Changing these values affects the entire widget (including Shadow DOM isolation)
 * and all the white-label dashboards (Patient, Staff, Admin).
 */

export interface ClinicConfig {
  name: string;
  mockMode: boolean;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    borderRadius: string;
    preset: 'Modern' | 'Classic' | 'Minimal';
  };
  insurances?: string[];
}

export const clinicConfig: ClinicConfig = {
  name: "Prototype Dental Clinic", // Il nome mostrato nel widget e nelle dashboard
  mockMode: true, // Se attivo, usa i MockProvider invece di Supabase (Fase 1)
  
  insurances: [
    "Previmedical", 
    "Metasalute", 
    "Unisalute", 
    "Pronto care", 
    "Fasdac", 
    "Fisde", 
    "Assilt", 
    "Blue Assistance", 
    "Salute-odontonetwork-poste assicura"
  ],

  branding: {
    primaryColor: "#0EA5E9", // Colore principale: controlla bottoni "Call to Action", icone e stati attivi
    secondaryColor: "#F8FAFC", // Colore secondario: usato per sfondi di card o elementi meno importanti
    accentColor: "#F43F5E", // Colore accento: ideale per badge, puntini di notifica o elementi highlight
    fontFamily: "'Inter', sans-serif", // Font di sistema o Google Fonts: cambia l'intera tipografia del widget
    borderRadius: "1.5rem", // Arrotondamento angoli: da 0rem (vivi) a 1rem+ (molto rotondi/bolla)
    preset: "Modern" // Preset di stile: "Modern" (soft gradients), "Classic" (serio), "Minimal" (flat design)
  }
};
