import {
  Dashboard,
  Insights,
  HealthAndSafety,
  NotificationsActive,
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const dashboardSidebar: SidebarItem[] = [
  {
    label: "Overview",
    path: "/admin/dashboard#overview",
    icon: Dashboard,
  },
  {
    label: "KPI Summary",
    path: "/admin/dashboard#kpis",
    icon: Insights,
  },
  {
    label: "System Health",
    path: "/admin/dashboard#system-health",
    icon: HealthAndSafety,
  },
  {
    label: "Live Alerts",
    path: "/admin/dashboard#live-alerts",
    icon: NotificationsActive,
  },
];