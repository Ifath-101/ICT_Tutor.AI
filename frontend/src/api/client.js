import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";
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
