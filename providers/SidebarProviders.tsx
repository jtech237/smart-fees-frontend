"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

interface SidebarContextProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      isOpen,
      toggleSidebar,
      closeSidebar,
    }),
    [isOpen, toggleSidebar, closeSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider!");
  }
  return context;
};
