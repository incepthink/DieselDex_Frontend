"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextProps {
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;
}

// Create a Context with the default value as `undefined`
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

// Provider Component
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

// Hook to use the ModalContext
export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
