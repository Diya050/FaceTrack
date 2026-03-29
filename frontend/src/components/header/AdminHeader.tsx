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
    children: [
      { label: "Camera Grid", path: "/admin/monitoring#grid" },
      { label: "Camera Management", path: "/admin/monitoring#manage" },
      { label: "Recognition Events", path: "/admin/monitoring#events" },
      { label: "Unknown Faces", path: "/admin/monitoring#unknown-faces" },
    ],
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
    label: "Manage",
    path: "/admin/manage",
    children: [
      { label: "Departments", path: "/admin/manage#departments" },
      { label: "Organization Users", path: "/admin/manage#organization-users" },
      { label: "Bulk Upload", path: "/admin/manage#upload" },
      { label: "Assign Roles", path: "/admin/manage#assign-role" },
      { label: "Registration Requests", path: "/admin/manage#requests" },
      { label: "Face Enrollment Requests", path: "/admin/manage#face-enrollment-requests" },
      { label: "Attendance Rules", path: "/admin/manage#rules"},
    ],
  },
  {
    label: "Support Ticket",
    path: "/admin/support-ticket",
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
    ],
  },
  {
    label: "Security & Compliance",
    path: "/admin/settings/security",
    hideOnDesktop: true,
    children: [
      { label: "Audit Logs", path: "/admin/settings/security#audit" },
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

// const AdminHeader = () => {
//   const { fullName, role } = useAuth();
  
//   const getBadgeInitial = () => {
//     if (fullName) return fullName.charAt(0).toUpperCase();
//     return role === "SUPER_ADMIN" ? "S" : "A";
//   };

//   return (
//     <BaseHeader
//       logoLink="/admin/dashboard"
//       navItems={adminNavItems}
//       rightSlot={<HeaderIcons firstName={getBadgeInitial()} />}
//     />
//   );
// };

export default AdminHeader;