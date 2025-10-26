"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

interface AnnouncerContextType {
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | undefined>(undefined);

export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const announcerRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute("aria-live", priority);
      announcerRef.current.textContent = message;
    }
  };

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      <div
        ref={announcerRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </AnnouncerContext.Provider>
  );
}

export function useAnnouncer() {
  const context = useContext(AnnouncerContext);
  if (context === undefined) {
    throw new Error("useAnnouncer must be used within an AnnouncerProvider");
  }
  return context;
}

// Hook for announcing form validation errors
export function useFormAnnouncer() {
  const { announce } = useAnnouncer();

  const announceError = (fieldName: string, error: string) => {
    announce(`${fieldName}: ${error}`, "assertive");
  };

  const announceSuccess = (message: string) => {
    announce(message, "polite");
  };

  return { announceError, announceSuccess };
}