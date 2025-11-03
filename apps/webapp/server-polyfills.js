/**
 * Server-side polyfills for browser globals
 * This prevents "window is not defined" and similar errors during SSR
 */

if (typeof window === "undefined") {
  // Create a minimal window polyfill for SSR
  global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    location: {
      href: "",
      protocol: "https:",
      host: "",
      hostname: "",
      port: "",
      pathname: "/",
      search: "",
      hash: "",
    },
    navigator: {
      userAgent: "Mozilla/5.0 (Server Side Rendering)",
      platform: "SSR",
    },
    document: {
      createElement: () => ({}),
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    crypto: {
      getRandomValues: (arr) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      },
      subtle: {},
    },
  };

  // Also set document global
  global.document = global.window.document;
  global.navigator = global.window.navigator;
  global.localStorage = global.window.localStorage;
  global.sessionStorage = global.window.sessionStorage;
}
