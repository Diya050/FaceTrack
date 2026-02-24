import {
  Dashboard,
  Videocam,
  FactCheck,
  People,
  Settings,
  Security,
  Help,
} from "@mui/icons-material";

export type SidebarItem = {
  label: string;
  path?: string;
  icon?: React.ElementType;
  children?: SidebarItem[];
};

export const sidebarConfig: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: Dashboard,
    children: [
      { label: "Overview", path: "/dashboard/overview" },
      { label: "KPI Summary", path: "/dashboard/kpis" },
      { label: "System Health", path: "/dashboard/system-health" },
      { label: "Live Alerts", path: "/dashboard/live-alerts" },
    ],
  },
  {
    label: "Live Monitoring",
    icon: Videocam,
    children: [
      { label: "Camera Grid", path: "/monitoring/cameras" },
      { label: "Full Screen View", path: "/monitoring/fullscreen" },
      { label: "Recognition Events", path: "/monitoring/events/live" },
      { label: "Event History", path: "/monitoring/events/history" },
    ],
  },
  {
    label: "Attendance",
    icon: FactCheck,
    children: [
      { label: "Records", path: "/attendance/records" },
      { label: "Search & Filters", path: "/attendance/search" },
      { label: "Corrections", path: "/attendance/corrections" },
      { label: "Export Reports", path: "/attendance/export" },
    ],
  },
  {
    label: "Manage Department",
    icon: People,
    children: [
      { label: "Departments", path: "/departments" },
      { label: "User Profiles", path: "/profiles" },
      { label: "Bulk Upload", path: "/profiles/bulk-upload" },
      { label: "Face Gallery", path: "/profiles/face-gallery" },
      { label: "Roles", path: "/roles" },
      { label: "Access Control", path: "/access-control" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      {
        label: "System Settings",
        children: [
          { label: "AI Models", path: "/settings/ai-models" },
          { label: "Recognition Threshold", path: "/settings/threshold" },
          { label: "Notifications Config", path: "/settings/notifications" },
          { label: "Storage & Backup", path: "/settings/storage" },
          { label: "Camera Setup", path: "/settings/cameras" },
        ],
      },
      {
        label: "Security & Compliance",
        icon: Security,
        children: [
          { label: "Audit Logs", path: "/security/audit-logs" },
          { label: "Access Logs", path: "/security/access-logs" },
          { label: "Consent Management", path: "/privacy/consents" },
          { label: "Data Retention", path: "/privacy/data-retention" },
        ],
      },
      {
        label: "Help & Support",
        icon: Help,
        children: [
          { label: "Docs", path: "/support/docs" },
          { label: "FAQ", path: "/support/faq" },
          { label: "Tickets", path: "/support/tickets" },
          { label: "System Status", path: "/support/system-status" },
        ],
      },
    ],
  },
];