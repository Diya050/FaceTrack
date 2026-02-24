import type { RouteObject } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { Navigate } from "react-router-dom";

// Dashboard
import Overview from "../components/admin/dashboard/Overview";
import KPISummary from "../components/admin/dashboard/KPISummary";
import SystemHealth from "../components/admin/dashboard/SystemHealth";
import LiveAlerts from "../components/admin/dashboard/LiveAlerts";

// Live Monitoring
import CameraGrid from "../components/admin/monitoring/CameraGrid";
import FullscreenView from "../components/admin/monitoring/FullscreenView";
import RecognitionEvents from "../components/admin/monitoring/RecognitionEvents";
import EventHistory from "../components/admin/monitoring/EventHistory";

// Attendance
import AttendanceRecords from "../components/admin/attendance/AttendanceRecords";
import AttendanceSearch from "../components/admin/attendance/AttendanceSearch";
import AttendanceCorrections from "../components/admin/attendance/AttendanceCorrections";
import AttendanceExport from "../components/admin/attendance/AttendanceExport";

// Manage Department
import Departments from "../components/admin/manage/Departments";
import UserProfiles from "../components/admin/manage/UserProfiles";
import BulkUpload from "../components/admin/manage/BulkUpload";
import FaceGallery from "../components/admin/manage/FaceGallery";
import Roles from "../components/admin/manage/Roles";
import AccessControl from "../components/admin/manage/AccessControl";

// Settings - System
import AIModels from "../components/admin/settings/system/AIModels";
import RecognitionThreshold from "../components/admin/settings/system/RecognitionThreshold";
import NotificationConfig from "../components/admin/settings/system/NotificationConfig";
import StorageBackup from "../components/admin/settings/system/StorageBackup";
import CameraSetup from "../components/admin/settings/system/CameraSetup";

// Settings - Security
import AuditLogs from "../components/admin/settings/security/AuditLogs";
import AccessLogs from "../components/admin/settings/security/AccessLogs";
import ConsentManagement from "../components/admin/settings/security/ConsentManagement";
import DataRetention from "../components/admin/settings/security/DataRetention";

// Settings - Help
import UserGuide from "../pages/user/UserGuidePage";
import AdminGuide from "../pages/admin/AdminGuidePage";
import SystemStatus from "../components/admin/settings/help/SystemStatus";

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <Navigate to="/admin/dashboard/overview" replace /> },

    // Dashboard
    { path: "dashboard", element: <Navigate to="/admin/dashboard/overview" replace /> },
    { path: "dashboard/overview", element: <Overview /> },
    { path: "dashboard/kpis", element: <KPISummary /> },
    { path: "dashboard/system-health", element: <SystemHealth /> },
    { path: "dashboard/live-alerts", element: <LiveAlerts /> },

    // Live Monitoring
    { path: "monitoring", element: <Navigate to="/admin/monitoring/cameras" replace /> },
    { path: "monitoring/cameras", element: <CameraGrid /> },
    { path: "monitoring/fullscreen", element: <FullscreenView /> },
    { path: "monitoring/events/live", element: <RecognitionEvents /> },
    { path: "monitoring/events/history", element: <EventHistory /> },

    // Attendance
    { path: "attendance", element: <Navigate to="/admin/attendance/records" replace /> },
    { path: "attendance/records", element: <AttendanceRecords /> },
    { path: "attendance/search", element: <AttendanceSearch /> },
    { path: "attendance/corrections", element: <AttendanceCorrections /> },
    { path: "attendance/export", element: <AttendanceExport /> },

    // Manage Department
    { path: "manage", element: <Navigate to="/admin/manage/departments" replace /> },
    { path: "manage/departments", element: <Departments /> },
    { path: "manage/users", element: <UserProfiles /> },
    { path: "manage/bulk-upload", element: <BulkUpload /> },
    { path: "manage/face-gallery", element: <FaceGallery /> },
    { path: "manage/roles", element: <Roles /> },
    { path: "manage/access-control", element: <AccessControl /> },

    // Settings → System
    { path: "settings", element: <Navigate to="/admin/settings/system/ai-models" replace /> },
    { path: "settings/system/ai-models", element: <AIModels /> },
    { path: "settings/system/threshold", element: <RecognitionThreshold /> },
    { path: "settings/system/notifications", element: <NotificationConfig /> },
    { path: "settings/system/storage", element: <StorageBackup /> },
    { path: "settings/system/cameras", element: <CameraSetup /> },

    // Settings → Security
    { path: "settings/security/audit-logs", element: <AuditLogs /> },
    { path: "settings/security/access-logs", element: <AccessLogs /> },
    { path: "settings/security/consents", element: <ConsentManagement /> },
    { path: "settings/security/data-retention", element: <DataRetention /> },

    // Settings → Help
    { path: "settings/help/user-guide", element: <UserGuide /> },
    { path: "settings/help/admin-guide", element: <AdminGuide /> },
    { path: "settings/help/system-status", element: <SystemStatus /> },
  ],
};