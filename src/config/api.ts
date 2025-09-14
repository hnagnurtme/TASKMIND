export const BASE_API_URL =
  (import.meta.env && (import.meta.env.VITE_GEMINI_SERVER_URL as string)) ||
  "https://gemini-server-59yh.onrender.com";

export default BASE_API_URL;
