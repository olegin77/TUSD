"use client";

import { useEffect, useState } from "react";

/**
 * SkipToContent - Allows keyboard users to skip navigation and jump to main content
 * Improves accessibility by providing quick access to main content
 */
export function SkipToContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="skip-to-content"
      style={{
        position: "absolute",
        left: "-9999px",
        zIndex: 999,
        padding: "1rem 1.5rem",
        backgroundColor: "#0070f3",
        color: "white",
        textDecoration: "none",
        borderRadius: "0.25rem",
        fontWeight: "bold",
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = "1rem";
        e.currentTarget.style.top = "1rem";
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = "-9999px";
      }}
    >
      Перейти к основному содержанию
    </a>
  );
}
