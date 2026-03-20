import { createContext, useContext, useState, useEffect } from "react";
import instance from "../services/api"; // axios instance

export type UserRole = "SUPER_ADMIN" | "HR_ADMIN" | "ADMIN" | "USER";
export type UserStatus = "pending" | "approved" | "active" | "rejected" | "inactive";

interface AuthState {
  token: string | null;
  role: UserRole | null;
  status: UserStatus | null;
  fullName: string | null;
  face_enrolled: boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem("token"),
    role: null,
    status: null,
    fullName: null,
    face_enrolled: false,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: true,
  });

  const fetchUser = async () => {
    try {
      const res = await instance.get("/profile/users/me");

      setState((prev) => ({
        ...prev,
        role: res.data.role,
        status: res.data.status,
        fullName: res.data.full_name,
        face_enrolled: res.data.face_enrolled,
        isAuthenticated: true,
        loading: false,
      }));
    } catch (err: any) {
      console.error("fetchUser failed:", err);

      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
        return;
      }

      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    setState((prev) => ({
      ...prev,
      token,
      isAuthenticated: true,
      loading: true,
    }));
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({
      token: null,
      role: null,
      status: null,
      fullName: null,
      face_enrolled: false,
      isAuthenticated: false,
      loading: false,
    });
  };

  useEffect(() => {
    if (state.token) {
      fetchUser();
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext Not Found");
  }
  return context;
};