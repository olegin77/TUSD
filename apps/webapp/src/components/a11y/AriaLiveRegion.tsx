"use client";

import { useEffect, useState } from "react";

interface AriaLiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive" | "off";
  clearDelay?: number;
}

/**
 * AriaLiveRegion - Announces dynamic content changes to screen readers
 * Use for notifications, status updates, and dynamic content
 */
export function AriaLiveRegion({
  message,
  politeness = "polite",
  clearDelay = 5000,
}: AriaLiveRegionProps) {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      if (clearDelay > 0) {
        const timer = setTimeout(() => setCurrentMessage(""), clearDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [message, clearDelay]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
    >
      {currentMessage}
    </div>
  );
}
