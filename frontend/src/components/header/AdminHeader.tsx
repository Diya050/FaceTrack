import HeaderIcons from "./HeaderIcons";
import BaseHeader from "./BaseHeader";
import { useAuth } from "../../context/AuthContext";

const adminNavItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    children: [
      { label: "Overview", path: "/admin/dashboard#overview" },
      { label: "KPI Summary", path: "/admin/dashboard#kpi" },
      { label: "System Health", path: "/admin/dashboard#health" },
      { label: "Live Alerts", path: "/admin/dashboard#alerts" },
    ],
  },
  {
    label: "Live Monitoring",
    path: "/admin/monitoring",
    children: [
      { label: "Camera Grid", path: "/admin/monitoring#grid" },
      { label: "Full Screen View", path: "/admin/monitoring#fullscreen" },
      { label: "Recognition Events", path: "/admin/monitoring#events" },
      { label: "Event History", path: "/admin/monitoring#history" },
    ],
  },
  {
    label: "Attendance",
    path: "/admin/attendance",
    children: [
      { label: "Records", path: "/admin/attendance#records" },
      { label: "Search & Filters", path: "/admin/attendance#search" },
      { label: "Corrections", path: "/admin/attendance#corrections" },
      { label: "Export Reports", path: "/admin/attendance#export" },
    ],
  },
  {
    label: "Manage Department",
    path: "/admin/manage",
    children: [
      { label: "Departments", path: "/admin/manage#departments" },
      { label: "User Profiles", path: "/admin/manage#profiles" },
      { label: "Bulk Upload", path: "/admin/manage#upload" },
      { label: "Face Gallery", path: "/admin/manage#gallery" },
      { label: "Roles", path: "/admin/manage#roles" },
      { label: "Access Control", path: "/admin/manage#access" },
    ],
  },
  {
    label: "Support Ticket",
    path: "/admin/support-ticket"
  },
  // THESE WILL BE HIDDEN ON DESKTOP
  {
    label: "System Settings",
    path: "/admin/settings/system",
    hideOnDesktop: true,
    children: [
      { label: "AI Models", path: "/admin/settings/system#ai" },
      { label: "Recognition Threshold", path: "/admin/settings/system#threshold" },
      { label: "Notifications Config", path: "/admin/settings/system#notifications" },
      { label: "Storage & Backup", path: "/admin/settings/system#storage" },
      { label: "Camera Setup", path: "/admin/settings/system#camera" },
    ],
  },
  {
    label: "Security & Compliance",
    path: "/admin/settings/security",
    hideOnDesktop: true,
    children: [
      { label: "Audit Logs", path: "/admin/settings/security#audit" },
      { label: "Access Logs", path: "/admin/settings/security#access" },
      { label: "Consent Management", path: "/admin/settings/security#consent" },
      { label: "Data Retention", path: "/admin/settings/security#retention" },
    ],
  },
  {
    label: "Help & Support",
    path: "/admin/settings/help",
    hideOnDesktop: true,
    children: [
      { label: "User Guide", path: "/admin/settings/help/user-guide" },
      { label: "Admin Guide", path: "/admin/settings/help/admin-guide" },
    ],
  },
];

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <BaseHeader
      logoLink="/admin/dashboard"
      navItems={adminNavItems}
      rightSlot={<HeaderIcons firstName={user?.firstName ?? "A"} />}
    />
  );
};

export default AdminHeader;