/**
 * API Client для связи с backend
 */

// Определи base URL из environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3001";

console.log("[API Client] Base URL:", API_BASE_URL);

/**
 * Базовая fetch функция с обработкой ошибок
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`[API] ${options?.method || "GET"} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[API] Response:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Error:`, error);
    throw error;
  }
}

/**
 * API Client methods
 */
export const apiClient = {
  // Health check
  health: () => apiFetch("/health"),

  // Generic GET
  get: <T>(endpoint: string) => apiFetch<T>(endpoint),

  // Generic POST
  post: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Generic PUT
  put: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  // Generic DELETE
  delete: <T>(endpoint: string) =>
    apiFetch<T>(endpoint, {
      method: "DELETE",
    }),
};

// Export base URL для использования в других местах
export { API_BASE_URL };
