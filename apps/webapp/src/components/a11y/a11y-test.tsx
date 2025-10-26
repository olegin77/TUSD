"use client";

import { useEffect, useState } from "react";

export function A11yTest() {
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runA11yTest = async () => {
    if (typeof window === "undefined") return;
    
    setIsRunning(true);
    setResults([]);

    try {
      const axe = (await import("@axe-core/react")).default;
      const { run } = await import("axe-core");
      
      const violations = await run(document);
      setResults(violations.violations);
    } catch (error) {
      console.error("A11y test failed:", error);
    } finally {
      setIsRunning(false);
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-md">
      <h3 className="font-semibold mb-2">A11y Test</h3>
      <button
        onClick={runA11yTest}
        disabled={isRunning}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isRunning ? "Running..." : "Run Test"}
      </button>
      
      {results.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-red-600">
            {results.length} violation(s) found
          </h4>
          <div className="max-h-40 overflow-y-auto">
            {results.map((violation, index) => (
              <div key={index} className="text-sm mt-2 p-2 bg-red-50 rounded">
                <div className="font-medium">{violation.id}</div>
                <div className="text-gray-600">{violation.description}</div>
                <div className="text-xs text-gray-500">
                  Impact: {violation.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}