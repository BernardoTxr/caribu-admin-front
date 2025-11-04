import React, { createContext, useContext, useState, ReactNode } from 'react';

type ContentType = {
  content:  any; // Pode ser string, JSX.Element, objeto, etc.
  setContent: (content: any) => void;
};

const Content = createContext<ContentType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<any>();

  return (
    <Content.Provider value={{ content, setContent }}>
      {children}
    </Content.Provider>
  );
};

export const useContent = () => {
  const context = useContext(Content);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
export default ContentProvider;
