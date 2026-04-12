import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WidgetContainer } from './components/WidgetContainer'
import './index.css'
import App from './App.tsx'

import { WidgetProvider } from './context/WidgetContext'

const mountWidget = () => {
  const containerId = 'rb-booking-widget-root';
  let container = document.getElementById(containerId);

  if (container) {
    console.log('✅ RB Widget: Contenitore trovato, monto il widget...');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'block';
    container.style.overflow = 'hidden';
  } else {
    console.log('⚠️ RB Widget: Contenitore non trovato, monto in fondo al body...');
    container = document.createElement('div');
    container.id = containerId;
    container.style.width = '100%';
    document.body.appendChild(container);
  }

  createRoot(container).render(
    <StrictMode>
      <WidgetProvider>
        <WidgetContainer>
          <App />
        </WidgetContainer>
      </WidgetProvider>
    </StrictMode>
  );
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
