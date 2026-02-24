import type { RouteObject } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { Navigate } from "react-router-dom";

// Settings - Help
import UserGuide from "../pages/user/UserGuidePage";
import AdminGuide from "../pages/admin/AdminGuidePage";
import SystemStatus from "../components/admin/settings/system/SystemStatus";

import DashboardPage from "../pages/admin/DashboardPage";
import LiveMonitoringPage from "../pages/admin/LiveMonitoringPage";
import AttendancePage from "../pages/admin/AttendancePage";
import SystemSettingsPage from "../pages/admin/settings/SystemSettingsPage";
import SecuritySettingsPage from "../pages/admin/settings/SecuritySettingsPage";
import ManagePage from "../pages/admin/ManagePage";




export const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <Navigate to="/admin/dashboard/overview" replace /> },

    // Dashboard
    { path: "dashboard", element: <DashboardPage /> },

    // Live Monitoring
    { path: "monitoring", element: <LiveMonitoringPage /> },

    // Attendance
    { path: "attendance", element: <AttendancePage /> },

    // Manage Department
    { path: "manage", element: <ManagePage /> },

    // Settings → System
    { path: "settings", element: <Navigate to="/admin/settings/system" replace /> },
    { path: "settings/system", element: <SystemSettingsPage /> },
    
    // Settings → Security
    { path: "settings/security", element: <SecuritySettingsPage /> },

    // Settings → Help
    { path: "settings/help/user-guide", element: <UserGuide /> },
    { path: "settings/help/admin-guide", element: <AdminGuide /> },
    { path: "settings/help/system-status", element: <SystemStatus /> },
  ],
};