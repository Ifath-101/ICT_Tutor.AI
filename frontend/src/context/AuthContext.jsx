import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, getStoredToken, setStoredToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const fetchMe = useCallback(async (activeToken) => {
    const res = await api.get("/me", {
      headers: { Authorization: `Bearer ${activeToken}` },
    });
    setUser(res.data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const t = getStoredToken();
      if (!t) {
        if (!cancelled) setReady(true);
        return;
      }
      try {
        await fetchMe(t);
      } catch {
        if (!cancelled) logout();
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchMe, logout]);

  const login = useCallback(
    async (email, password) => {
      const res = await api.post("/login", { email, password });
      const access = res.data.access_token;
      setStoredToken(access);
      setToken(access);
      await fetchMe(access);
    },
    [fetchMe]
  );

  const register = useCallback(
    async (name, email, password) => {
      await api.post("/register", { name, email, password });
      await login(email, password);
    },
    [login]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      ready,
      login,
      register,
      logout,
    }),
    [token, user, ready, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
