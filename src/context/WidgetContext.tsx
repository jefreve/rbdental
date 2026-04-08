import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface WidgetState {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  closeWidget: () => void;
  hideDefaultClose: boolean;
  setHideDefaultClose: (hide: boolean) => void;
  isSuccessStep: boolean;
  setIsSuccessStep: (isSuccess: boolean) => void;
}

const WidgetContext = createContext<WidgetState | undefined>(undefined);

export const WidgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hideDefaultClose, setHideDefaultClose] = useState(false);
  const [isSuccessStep, setIsSuccessStep] = useState(false);

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
      setIsSuccessStep
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
