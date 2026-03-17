import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authApi from "../../api/authApi";
import { clearStoredTokens, getStoredAuth, setStoredTokens } from "../../api/tokenStorage";
import { PERMISSIONS, hasAllPermissions } from "../../auth/permissions";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const bootstrap = useCallback(async () => {
    const { accessToken, refreshToken } = getStoredAuth();
    if (!accessToken && !refreshToken) {
      setUser(null);
      setIsBootstrapping(false);
      return;
    }

    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      // If tokens are invalid even after auto-refresh, httpClient clears them.
      clearStoredTokens();
      setUser(null);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async ({ username, password }) => {
    const data = await authApi.login({ username, password });
    setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async ({ username, password }) => {
    return authApi.register({ username, password });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearStoredTokens();
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  const hasPermission = useCallback(
    (requiredMask) => {
      if (!user) return false;
      return hasAllPermissions(user.permissions, requiredMask);
    },
    [user],
  );

  const value = useMemo(() => {
    return {
      user,
      isAuthenticated,
      isBootstrapping,
      login,
      register,
      logout,
      PERMISSIONS,
      hasPermission,
    };
  }, [user, isAuthenticated, isBootstrapping, login, register, logout, hasPermission]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
