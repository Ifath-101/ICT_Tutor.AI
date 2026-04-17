import axios from "axios";

const API_BASE = "https://ict-tutor-ai.onrender.com/";
export const TOKEN_KEY = "ict_tutor_token";

export const api = axios.create({
  baseURL: API_BASE,
});

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

api.interceptors.request.use((config) => {
  const t = getStoredToken();
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});
