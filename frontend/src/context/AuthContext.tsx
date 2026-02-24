import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type UserRole = "user" | "admin" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole;
  user: {
    firstName: string;
    lastName?: string;
  } | null;
  login: (role: UserRole, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  const login = (role: UserRole, userData: any) => {
    setRole(role);
    setUser(userData);
  };

  const logout = () => {
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!role,
        role,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};