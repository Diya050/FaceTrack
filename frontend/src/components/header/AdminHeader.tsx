import HeaderIcons from "./HeaderIcons";
import BaseHeader from "./BaseHeader";
import { useAuth } from "../../context/AuthContext";

/* ---------------- ADMIN NAV ---------------- */
const adminNavItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    children: [
      { label: "Overview", path: "/admin/dashboard#overview" },
      { label: "KPI Summary", path: "/admin/dashboard#kpis" },
      { label: "System Health", path: "/admin/dashboard#system-health" },
      { label: "Live Alerts", path: "/admin/dashboard#live-alerts" },
    ],
  },
  {
    label: "Live Monitoring",
    path: "/admin/monitoring",
  },
  {
    label: "Attendance",
    path: "/admin/attendance",
  },
  {
    label: "Reports",
    path: "/admin/reports",
  },
  {
    label: "Manage Department",
    path: "/admin/manage",
  },
  {
    label: "Support Ticket",
    path: "/admin/support-ticket",
  },
  {
    label: "Unknown Faces",
    path: "/admin/unknown-faces",
  },
];

/* ---------------- SUPER ADMIN NAV ---------------- */
const superAdminNavItems = [
    {
    label: "Dashboard",
    path: "/super-admin/dashboard",
  },
  {
    label: "Organizations",
    path: "/super-admin/organizations",
  },
];

/* ---------------- COMPONENT ---------------- */

const AdminHeader = () => {
  const { fullName, role } = useAuth();

  const userInitial = fullName ? fullName.charAt(0).toUpperCase() : "A";

  // 🔥 ROLE-BASED NAV SWITCH
  const navItems =
    role === "SUPER_ADMIN" ? superAdminNavItems : adminNavItems;

  // 🔥 ROLE-BASED LOGO LINK
  const logoLink =
    role === "SUPER_ADMIN"
      ? "/super-admin/dashboard"
      : "/admin/dashboard";

  return (
    <BaseHeader
      logoLink={logoLink}
      navItems={navItems}
      rightSlot={<HeaderIcons firstName={userInitial} />}
    />
  );
};

export default AdminHeader;