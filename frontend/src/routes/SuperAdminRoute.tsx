import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";
import SuperAdminLayout from "../layout/SuperAdminLayout";

import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import OrganizationsPage from "../pages/superadmin/OrganizationsPage";
import CreateOrganizationPage from "../pages/superadmin/CreateOrganizationPage";

export const superAdminRoutes = {
  path: "/super-admin",
  element: (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
        <SuperAdminLayout />
      </RoleGuard>
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <SuperAdminDashboard /> },
    { path: "organizations", element: <OrganizationsPage /> },
    { path: "organizations/create", element: <CreateOrganizationPage /> },
  ],
};