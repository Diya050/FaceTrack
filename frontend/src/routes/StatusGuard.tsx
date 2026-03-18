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
  }, [auth]);

  if (auth.loading || !route) {
    return <div>Loading...</div>;
  }

  if (!location.pathname.startsWith(route)) {
    return <Navigate to={route} replace />;
  }

  return children;
};

export default StatusGuard;