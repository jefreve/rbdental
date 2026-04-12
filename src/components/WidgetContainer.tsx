import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface WidgetContainerProps {
  children: React.ReactNode;
}

/**
 * Helper to determine if a color is light or dark for appropriate foreground.
 */
const getContrastColor = (hex: string) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? '0 0% 0%' : '0 0% 100%';
};

import { useWidget } from '../context/WidgetContext';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const WidgetContainer: React.FC<WidgetContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const { isExpanded, setIsExpanded, hideDefaultClose, isSuccessStep, config } = useWidget();

  // 1. ATTACH SHADOW DOM (Once)
  useLayoutEffect(() => {
    if (containerRef.current && !containerRef.current.shadowRoot) {
      const root = containerRef.current.attachShadow({ mode: 'open' });
      setShadowRoot(root);
      
      // Sincronizziamo TUTTI i tag <style> (dove il widget inietta i suoi CSS)
      // Ma ignoriamo i <link> (dove il sito ospite tiene i suoi stili e font)
      document.querySelectorAll('style').forEach(s => {
        root.appendChild(s.cloneNode(true));
      });
    }
  }, []);

  // 2. DYNAMIC BRANDING UPDATES (Runs on Config change)
  useLayoutEffect(() => {
    if (!shadowRoot) return;

    const { branding } = config;
    console.log('🏗️ WidgetContainer applying branding:', branding);
    
    // Manage Font Injection
    const fontName = branding.fontFamily.split(',')[0].replace(/'/g, '');
    if (fontName && !document.getElementById(`font-${fontName}`)) {
      const link = document.createElement('link');
      link.id = `font-${fontName}`;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }

    // Manage Style Overrides
    let styleNode = shadowRoot.getElementById('branding-overrides');
    if (!styleNode) {
      styleNode = document.createElement('style');
      styleNode.id = 'branding-overrides';
      shadowRoot.appendChild(styleNode);
    }
    
    styleNode.textContent = `
      :host {
        --primary: ${branding.primaryColor} !important;
        --primary-foreground: ${getContrastColor(branding.primaryColor)} !important;
        --secondary: ${branding.secondaryColor} !important;
        --secondary-foreground: ${getContrastColor(branding.secondaryColor)} !important;
        --accent: ${branding.accentColor} !important;
        --accent-foreground: ${getContrastColor(branding.accentColor)} !important;
        --radius: ${branding.borderRadius} !important;
        --background: 0 0% 100% !important;
        --foreground: 222.2 84% 4.9% !important;
        
        --f-base: ${branding.typography?.baseSize || '14px'} !important;
        --f-title: ${branding.typography?.titleSize || '18px'} !important;
        --f-heading: ${branding.typography?.headingSize || '13px'} !important;
        --f-button: ${branding.typography?.buttonSize || '16px'} !important;
        --f-small: ${branding.typography?.smallSize || '12px'} !important;
        
        --f-ls-title: ${branding.typography?.titleLetterSpacing || 'normal'} !important;
        --f-ls-button: ${branding.typography?.buttonLetterSpacing || 'normal'} !important;
        --f-w-title: ${branding.typography?.titleWeight || '700'} !important;
        --f-w-base: ${branding.typography?.baseWeight || '400'} !important;
        --v-gap: ${config.layout?.verticalGap || '1rem'} !important;

        display: block;
        font-family: ${branding.fontFamily};
      }
      .widget-viewport {
        all: initial;
        font-family: inherit;
        display: flex;
        flex-direction: column;
        background-color: white;
        width: 100%;
        height: 100%;
        max-width: 100%;
        overflow: hidden;
        border-radius: var(--radius);
        position: relative;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
      }
      
      .close-button {
        display: none;
        position: absolute;
        top: 1rem;
        right: 0.75rem;
        z-index: 100;
        background: rgba(255, 255, 255, 0.15);
        border: none;
        color: white;
        padding: 0.35rem;
        border-radius: 9999px;
        cursor: pointer;
        backdrop-filter: blur(4px);
        transition: all 0.2s;
        align-items: center;
        justify-content: center;
      }
      
      .close-button:hover {
        background: rgba(255, 255, 255, 0.25);
      }
      
      .is-success-view .close-button {
        background: transparent !important;
        color: var(--primary) !important;
        border: 1.5px solid var(--primary) !important;
        opacity: 1 !important;
        box-shadow: none !important;
      }
      
      .is-success-view .close-button svg {
        stroke-width: 3px !important;
      }

      @media (max-width: 1024px) {
        .widget-viewport.is-expanded {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100dvh !important;
          max-width: 100vw !important;
          max-height: 100dvh !important;
          margin: 0 !important;
          border-radius: 0 !important;
          z-index: 9999 !important;
        }
        
        .widget-viewport.is-expanded .close-button {
          display: flex;
        }
      }

      .scrollbar-premium::-webkit-scrollbar {
        width: 4px;
      }
      .scrollbar-premium::-webkit-scrollbar-track {
        background: transparent;
      }
      .scrollbar-premium::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        transition: background 0.2s;
      }
      .scrollbar-premium:hover::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.12);
      }
      .scrollbar-premium::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.2);
      }
      
      /* Horizontal Chips Scroll (Hidden) */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      /* Firefox support for minimalist scrollbars */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.08) transparent;
      }
    `;
  }, [shadowRoot, config.branding]);

  const handleClose = () => {
    setIsExpanded(false);
    // Logic to reset App state will be handled by listening to isExpanded in App.tsx
  };

  return (
    <div id="booking-widget-container" ref={containerRef} className="relative h-full w-full">
      {shadowRoot && createPortal(
        <div className={cn(
          "widget-viewport shadow-2xl border border-black/5 rounded-[var(--radius)] text-foreground antialiased relative z-0",
          isExpanded && "is-expanded",
          isSuccessStep && "is-success-view"
        )}>
          {!hideDefaultClose && (
            <button 
              className="close-button" 
              onClick={handleClose}
              aria-label="Chiudi"
            >
              <X size={20} />
            </button>
          )}
          {children}
        </div>,
        shadowRoot
      )}
    </div>
  );
};

