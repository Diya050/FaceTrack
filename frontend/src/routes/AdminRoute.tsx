import type { RouteObject } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

import UserGuide from "../pages/user/UserGuidePage";
import AdminGuide from "../pages/admin/AdminGuidePage";
import DashboardPage from "../pages/admin/DashboardPage";
import SystemHealth from "../components/admin/dashboard/SystemHealth";
import LiveAlerts from "../components/admin/dashboard/LiveAlerts";
import LiveMonitoringPage from "../pages/admin/LiveMonitoringPage";
import AttendancePage from "../pages/admin/AttendancePage";
import ReportsPage from "../pages/admin/ReportsPage";
import SystemSettingsPage from "../pages/admin/settings/SystemSettingsPage";
import SecuritySettingsPage from "../pages/admin/settings/SecuritySettingsPage";
import ManagePage from "../pages/admin/ManagePage";
import ViewOrganizationUsers from "../pages/admin/ViewOrganizationUsers";
import FaceEnrollmentRequests from "../components/admin/manage/FaceEnrollmentRequests";
import UnknownFacesPage from "../components/admin/monitoring/UnknownFacesPage";
import SupportTickets from "../pages/admin/SupportTickets";
import FaceEnrollment from "../pages/user/FaceEnrollment";
import Profiles from "../pages/user/Profiles";
import AssignRolePage from "../components/admin/manage/AssignRolePage";

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["HR_ADMIN", "ADMIN"]}>
        <AdminLayout />
      </RoleGuard>
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Navigate to="/admin/dashboard" replace /> },

    // Dashboard
    { path: "dashboard", element: <DashboardPage /> },
    { path: "dashboard/system-health", element: <SystemHealth /> },
    { path: "dashboard/live-alerts", element: <LiveAlerts /> },

    // Live Monitoring
    { path: "monitoring", element: <LiveMonitoringPage /> },

    // Unknown Faces
    { path: "unknown-faces", element: <UnknownFacesPage /> },

    // Attendance
    { path: "attendance", element: <AttendancePage /> },

    // Reports
    { path: "reports", element: <ReportsPage /> },

    // Manage Department
    { path: "manage", element: <ManagePage /> },
    {
      path: "manage/users",
      element: (
        <RoleGuard allowedRoles={["HR_ADMIN"]}>
          <ViewOrganizationUsers />
        </RoleGuard>
      ),
    },
    { path: "me", element: <Profiles /> },
    { path: "assign-role", element: <AssignRolePage /> },
    { path: "face-enrollment-requests", element: <FaceEnrollmentRequests /> },
    { path: "capture", element: <FaceEnrollment /> },
    
   
    // support ticket
    { path: "support-ticket", element: <SupportTickets />},

    // Settings → System
    { path: "settings", element: <Navigate to="/admin/settings/system" replace /> },
    { path: "settings/system", element: <SystemSettingsPage /> },

    // Settings → Security
    { path: "settings/security", element: <SecuritySettingsPage /> },

    // Settings → Help
    { path: "settings/help/user-guide", element: <UserGuide /> },
    { path: "settings/help/admin-guide", element: <AdminGuide /> },

  ],
};