/**
 * Global API Base URL and Endpoint Resolution
 * Automatically points to Render backend on Vercel deployments, or localhost in dev.
 */
const isVercel = typeof window !== "undefined" && window.location.hostname.endsWith(".vercel.app");

export const API_BASE_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  (isVercel ? "https://peerforge-backend.onrender.com" : "")
).replace(/\/$/, "");

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Safely parse JSON response from backend
 */
export const safeJson = async (response, defaultErrorMessage = "Request failed") => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    if (response.status === 404 || response.status === 405) {
      throw new Error(
        `Backend API unreachable (${response.status}). Please check your backend deployment on Render.`
      );
    }
    throw new Error(
      `Server returned an error (${response.status}): ${text.slice(0, 100) || defaultErrorMessage}`
    );
  }
  return await response.json();
};
