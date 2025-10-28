"use client";

import { useEffect, useState, ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly component ensures children are only rendered on the client side.
 * This prevents SSR issues with components that rely on browser-only APIs like window, localStorage, etc.
 *
 * @param children - Components to render only on client
 * @param fallback - Optional fallback to show during SSR (default: null)
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
