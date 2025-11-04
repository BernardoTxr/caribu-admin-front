// hooks/useSideBar.tsx
import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Animated, Dimensions } from 'react-native';

type SideBarContextType = {
  isOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  sidebarWidthAnim: Animated.Value;
};

const SideBarContext = createContext<SideBarContextType | undefined>(undefined);

const screenWidth = Dimensions.get('window').width;
const targetWidth = screenWidth * 0.2; // 20% da largura da tela

export const SideBarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarWidthAnim = useRef(new Animated.Value(0)).current;

  const animateSidebar = (toValue: number) => {
    Animated.timing(sidebarWidthAnim, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const toggleSidebar = () => {
    const newValue = !isOpen;
    setIsOpen(newValue);
    animateSidebar(newValue ? targetWidth : 0);
  };

  const openSidebar = () => {
    setIsOpen(true);
    animateSidebar(targetWidth);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    animateSidebar(0);
  };

  return (
    <SideBarContext.Provider
      value={{ isOpen, toggleSidebar, openSidebar, closeSidebar, sidebarWidthAnim }}
    >
      {children}
    </SideBarContext.Provider>
  );
};

export const useSideBar = () => {
  const context = useContext(SideBarContext);
  if (!context) {
    throw new Error('useSideBar must be used within a SideBarProvider');
  }
  return context;
};
