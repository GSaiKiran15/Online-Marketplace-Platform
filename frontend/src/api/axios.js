import axios from "axios";

// Create an Axios instance with a base URL
// Environment variable VITE_API_URL or default to localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export default api;
