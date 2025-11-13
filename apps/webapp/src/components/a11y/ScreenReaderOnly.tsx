import React from "react";

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * ScreenReaderOnly - Renders content that is only visible to screen readers
 * Improves accessibility by providing additional context without cluttering UI
 */
export function ScreenReaderOnly({ children, as: Component = "span" }: ScreenReaderOnlyProps) {
  return (
    <Component
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
      {children}
    </Component>
  );
}
