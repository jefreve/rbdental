import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { clinicConfig, type ClinicConfig } from '../config/clinicConfig';

interface WidgetState {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  closeWidget: () => void;
  hideDefaultClose: boolean;
  setHideDefaultClose: (hide: boolean) => void;
  isSuccessStep: boolean;
  setIsSuccessStep: (isSuccess: boolean) => void;
  config: ClinicConfig;
}

const WidgetContext = createContext<WidgetState | undefined>(undefined);

export interface ExternalConfig {
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    showLogo?: boolean;
    logoUrl?: string;
  }
}

interface WidgetProviderProps {
  children: ReactNode;
  externalConfig?: ExternalConfig;
}

export const WidgetProvider: React.FC<WidgetProviderProps> = ({ children, externalConfig }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hideDefaultClose, setHideDefaultClose] = useState(false);
  const [isSuccessStep, setIsSuccessStep] = useState(false);

  // Uniamo la configurazione base con quella esterna se presente
  const currentConfig: ClinicConfig = {
    ...clinicConfig,
    branding: {
      ...clinicConfig.branding,
      ...(externalConfig?.branding || {})
    }
  };

  const closeWidget = () => {
    setIsExpanded(false);
  };

  return (
    <WidgetContext.Provider value={{ 
      isExpanded, 
      setIsExpanded, 
      closeWidget,
      hideDefaultClose,
      setHideDefaultClose,
      isSuccessStep,
      setIsSuccessStep,
      config: currentConfig
    }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidget must be used within a WidgetProvider');
  }
  return context;
};
