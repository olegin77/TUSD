"use client";

import { useEffect, useCallback } from "react";

interface KeyboardNavigationOptions {
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  enabled?: boolean;
}

/**
 * useKeyboardNavigation - Hook for implementing keyboard navigation
 * Provides callbacks for common keyboard interactions
 */
export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  const { enabled = true, ...handlers } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case "Enter":
          if (handlers.onEnter) {
            event.preventDefault();
            handlers.onEnter();
          }
          break;
        case " ":
          if (handlers.onSpace) {
            event.preventDefault();
            handlers.onSpace();
          }
          break;
        case "Escape":
          if (handlers.onEscape) {
            event.preventDefault();
            handlers.onEscape();
          }
          break;
        case "ArrowUp":
          if (handlers.onArrowUp) {
            event.preventDefault();
            handlers.onArrowUp();
          }
          break;
        case "ArrowDown":
          if (handlers.onArrowDown) {
            event.preventDefault();
            handlers.onArrowDown();
          }
          break;
        case "ArrowLeft":
          if (handlers.onArrowLeft) {
            event.preventDefault();
            handlers.onArrowLeft();
          }
          break;
        case "ArrowRight":
          if (handlers.onArrowRight) {
            event.preventDefault();
            handlers.onArrowRight();
          }
          break;
      }
    },
    [enabled, handlers]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [enabled, handleKeyDown]);

  return handleKeyDown;
}
