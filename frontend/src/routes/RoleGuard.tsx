import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleGuard = ({ children, allowedRoles }: any) => {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;