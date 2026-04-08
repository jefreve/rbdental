import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WidgetContainer } from './components/WidgetContainer'
import './index.css'
import App from './App.tsx'

import { WidgetProvider } from './context/WidgetContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WidgetProvider>
      <WidgetContainer>
        <App />
      </WidgetContainer>
    </WidgetProvider>
  </StrictMode>,
)
