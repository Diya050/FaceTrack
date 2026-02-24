import HeaderIcons from "./HeaderIcons";
import BaseHeader from "./BaseHeader";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Attendance", path: "/admin/attendance" },
  { label: "Live Monitoring", path: "/admin/monitoring" },
  { label: "Manage Department", path: "/admin/manage" },
];

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <BaseHeader
      logoLink="/admin/dashboard"
      navItems={navItems}
      rightSlot={<HeaderIcons firstName={user?.firstName ?? "A"} />}
    />
  );
};

export default AdminHeader;