/**
 * Global API Base URL and Endpoint Resolution
 * In dev: falls back to relative "" (proxied via vite.config.js to localhost:5000)
 * In production (e.g. Vercel): uses VITE_BACKEND_URL (e.g. https://peerforge-backend.onrender.com)
 */
export const API_BASE_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  ""
).replace(/\/$/, "");

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Safely parse JSON response from backend, preventing HTML 404 SyntaxError in production
 */
export const safeJson = async (response, defaultErrorMessage = "Request failed") => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    if (response.status === 404) {
      throw new Error(
        `Backend API not found (404). Please ensure the backend server is running and VITE_BACKEND_URL is configured in Vercel.`
      );
    }
    throw new Error(
      `Server returned unexpected response (${response.status}): ${text.slice(0, 100) || defaultErrorMessage}`
    );
  }
  return await response.json();
};
