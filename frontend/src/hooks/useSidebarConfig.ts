import { useLocation } from "react-router-dom";
import { dashboardSidebar } from "../config/sidebar.dashboard";
import { monitoringSidebar } from "../config/sidebar.monitoring";
import { attendanceSidebar } from "../config/sidebar.attendance";
import { departmentSidebar } from "../config/sidebar.department";
import { settingsSidebar } from "../config/sidebar.settings";

export function useSidebarConfig() {
  const { pathname } = useLocation();

  if (pathname.includes("/dashboard")) return dashboardSidebar;
  if (pathname.includes("/monitoring")) return monitoringSidebar;
  if (pathname.includes("/attendance")) return attendanceSidebar;
  if (pathname.includes("/manage")) return departmentSidebar;
  if (pathname.includes("/settings")) return settingsSidebar;
  if (pathname.includes("/settings/system")) return settingsSidebar;
  if (pathname.includes("/settings/security")) return settingsSidebar;
  if (pathname.includes("/settings/help")) return settingsSidebar;
  


  return [];
}