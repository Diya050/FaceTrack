import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import instance from "../services/api";
import { resolveRoute } from "../utils/resolveRoute";

const StatusGuard = ({ children }: any) => {
  const auth = useAuth();
  const location = useLocation();
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const path = await resolveRoute(auth, instance);
        setRoute(path);
      } catch (err) {
        console.error("StatusGuard error:", err);
        setRoute("/home");
      }
    };

    if (!auth.loading) {
      check();
    }
  }, [auth.status, auth.role, auth.face_enrolled, auth.loading]);

  if (auth.loading || !route) {
    return <div>Loading...</div>;
  }

  const getBasePath = (path: string) => {
    if (path.startsWith("/user")) return "/user";
    if (path.startsWith("/admin")) return "/admin";
    if (path.startsWith("/pending-approval")) return "/pending-approval";
    return "/";
  };

  const targetBase = getBasePath(route);
  const currentBase = getBasePath(location.pathname);

  if (targetBase !== currentBase) {
    return <Navigate to={route} replace />;
  }

  return children;
};

export default StatusGuard;