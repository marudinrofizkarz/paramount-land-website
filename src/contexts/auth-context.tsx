"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { checkAuth } from "@/lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const result = await checkAuth();
      setIsAuthenticated(result.isAuthenticated);
      setUser(result.user);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { logout } = await import("@/lib/auth");
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/auth/login"; // Force a full page reload to reset state
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
