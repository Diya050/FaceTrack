import {
  Dashboard,
  BarChart,
  HealthAndSafety,
  NotificationsActive,
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const dashboardSidebar: SidebarItem[] = [
  {
    label: "Overview",
    path: "/admin/dashboard", // Scrolls to the very top of the page
    icon: Dashboard,
  },
  {
    label: "Analytics",
    path: "/admin/dashboard#analytics", // Scrolls to Row 4
    icon: BarChart,
  },
  {
    label: "System Health",
    path: "/admin/dashboard#system-health", // Scrolls to SystemHealth box
    icon: HealthAndSafety,
  },
  {
    label: "Live Alerts",
    path: "/admin/dashboard#live-alerts", // Scrolls to LiveAlerts box
    icon: NotificationsActive,
  },
];