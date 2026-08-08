import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "checking" is true only while we verify the auth cookie on first load,
  // so we don't flash a login screen before we know the real state.
  const [checking, setChecking] = useState(true);

  // Runs once on app load. The auth cookie (if any) is sent automatically
  // by the browser, so hitting /auth/me tells us if the session is still valid.
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (isMounted) setUser(data.user);
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setChecking(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    return data;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.get("/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    checking,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
