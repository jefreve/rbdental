import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WidgetContainer } from './components/WidgetContainer'
import './index.css'
import App from './App.tsx'

import { WidgetProvider } from './context/WidgetContext'

import { clinicConfig } from './config/clinicConfig'

const mountWidget = () => {
  const containerId = 'rb-booking-widget-root';
  let container = document.getElementById(containerId);

  if (container) {
    console.log('✅ RB Widget: Contenitore trovato, leggo configurazioni...');
    
    // 1. Estraiamo i parametri dall'HTML del sito ospite (con fallback ai default)
    const primaryColor = container.getAttribute('data-primary-color') || clinicConfig.branding.primaryColor;
    const secondaryColor = container.getAttribute('data-secondary-color') || clinicConfig.branding.secondaryColor;
    const fontFamily = container.getAttribute('data-font-family') || clinicConfig.branding.fontFamily;
    
    // Logica Logo: mostriamo solo se show-logo è true E c'è un url
    const showLogoAttr = container.getAttribute('data-show-logo');
    const logoUrlAttr = container.getAttribute('data-logo-url');
    const showLogo = showLogoAttr === 'true' && !!logoUrlAttr;
    const logoUrl = logoUrlAttr || '';

    console.log('🎨 RB Widget Branding:', { primaryColor, secondaryColor, fontFamily, showLogo, logoUrl });

    // 2. Applichiamo questi valori come Variabili CSS al contenitore
    container.style.setProperty('--primary-color', primaryColor);
    container.style.setProperty('--font-family', fontFamily);

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
    container.style.overflow = 'hidden';

    createRoot(container).render(
      <StrictMode>
        <WidgetProvider 
          externalConfig={{ 
            branding: { 
              primaryColor, 
              secondaryColor,
              fontFamily,
              showLogo,
              logoUrl
            } 
          }}
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
        <WidgetProvider>
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
  const checkExist = setInterval(() => {
    const element = document.getElementById('rb-booking-widget-root');
    if (element) {
      clearInterval(checkExist);
      mountWidget();
    }
  }, 100);

  setTimeout(() => {
    if (!document.getElementById('rb-booking-widget-root')) {
      clearInterval(checkExist);
      mountWidget();
    }
  }, 5000);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}
