import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: any) => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  // Only check token, NOT isAuthenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;