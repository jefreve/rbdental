import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WidgetContainer } from './components/WidgetContainer'
import './index.css'
import App from './App.tsx'

import { WidgetProvider } from './context/WidgetContext'

import { clinicConfig } from './config/clinicConfig'

declare global {
  interface Window {
    RB_WIDGET_CONFIG?: {
      branding?: {
        primaryColor?: string;
        secondaryColor?: string;
        fontFamily?: string;
        borderRadius?: string;
        showLogo?: boolean;
        logoUrl?: string;
        typography?: {
          baseSize?: string;
          titleSize?: string;
          buttonSize?: string;
          titleWeight?: string;
          titleLetterSpacing?: string;
          buttonLetterSpacing?: string;
        };
      };
      layout?: {
        headerStyle?: 'solid' | 'minimal';
        verticalGap?: string;
        buttonWidth?: string;
        showButtonIcon?: boolean;
        dashboardUrl?: string;
      };
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
      };
    }
  }
}

const mountWidget = () => {
  const containerId = 'rb-booking-widget-root';
  let container = document.getElementById(containerId);

  if (container) {
    console.log('✅ RB Widget: Contenitore trovato. Caricamento configurazioni...');
    
    // 1. Priorità: Config Global JS > Attributi HTML > Defaults
    const globalConfig = window.RB_WIDGET_CONFIG?.branding || {};
    
    const primaryColor = globalConfig.primaryColor || 
                         container.getAttribute('data-primary-color') || 
                         clinicConfig.branding.primaryColor;
                         
    const fontFamily = globalConfig.fontFamily || 
                       container.getAttribute('data-font-family') || 
                       clinicConfig.branding.fontFamily;

    const borderRadius = globalConfig.borderRadius || 
                         container.getAttribute('data-border-radius') || 
                         clinicConfig.branding.borderRadius;

    // 3. Applichiamo Variabili CSS
    container.style.setProperty('--primary-color', primaryColor);
    container.style.setProperty('--font-family', fontFamily);
    container.style.setProperty('--border-radius', borderRadius);

    const parent = container.parentElement;
    if (parent) {
      parent.style.position = 'relative';
    }
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'block';

    createRoot(container).render(
      <StrictMode>
        <WidgetProvider 
          externalConfig={window.RB_WIDGET_CONFIG}
        >
          <WidgetContainer>
            <App />
          </WidgetContainer>
        </WidgetProvider>
      </StrictMode>
    );
  } else {
    console.log('⚠️ RB Widget: Contenitore non trovato, monto in fondo al body...');
    container = document.createElement('div');
    container.id = containerId;
    container.style.width = '100%';
    document.body.appendChild(container);

    createRoot(container).render(
      <StrictMode>
        <WidgetProvider externalConfig={window.RB_WIDGET_CONFIG}>
          <WidgetContainer>
            <App />
          </WidgetContainer>
        </WidgetProvider>
      </StrictMode>
    );
  }
};

const initWidget = () => {
  console.log('⏳ RB Widget: Inizializzazione in corso...');
  
  let attempts = 0;
  const maxAttempts = 50; // 5 secondi (100ms * 50)

  const checkAndMount = setInterval(() => {
    const element = document.getElementById('rb-booking-widget-root');
    const hasConfig = !!window.RB_WIDGET_CONFIG;
    
    attempts++;

    // Se abbiamo l'elemento e abbiamo la config, montiamo subito
    if (element && hasConfig) {
      console.log('✨ RB Widget: Elemento e Configurazione trovati. Lancio!');
      clearInterval(checkAndMount);
      mountWidget();
      return;
    }

    // Se abbiamo l'elemento ma non la config, aspettiamo ancora un po'
    if (element && !hasConfig && attempts < maxAttempts) {
      if (attempts % 10 === 0) console.log('⏳ RB Widget: Root trovato, attendo caricamento configurazione...');
      return;
    }

    // Se abbiamo l'elemento ma la config non arriva dopo il timeout, montiamo con default
    if (element && !hasConfig && attempts >= maxAttempts) {
      console.log('⚠️ RB Widget: Timeout configurazione. Procedo con i parametri default.');
      clearInterval(checkAndMount);
      mountWidget();
      return;
    }

    // Se raggiungiamo il timeout totale senza neanche l'elemento, proviamo a montare in fondo al body
    if (attempts >= maxAttempts) {
      console.log('⚠️ RB Widget: Timeout elemento root. Provo il montaggio fallback.');
      clearInterval(checkAndMount);
      mountWidget();
      return;
    }
  }, 100);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}
