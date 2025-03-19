'use client'

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ClipboardContextType {
  copiedText: string;
  setCopiedText: (text: string) => void;
}

const ClipboardContext = createContext<ClipboardContextType | undefined>(undefined);

export const ClipboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [copiedText, setCopiedText] = useState('');

  return (
    <ClipboardContext.Provider value={{ copiedText, setCopiedText }}>
      {children}
    </ClipboardContext.Provider>
  );
};

export const useClipboardContext = () => {
  const context = useContext(ClipboardContext);
  if (!context) {
    throw new Error('useClipboardContext must be used within a ClipboardProvider');
  }
  return context;
};
