import {
  Apartment,
  People,
  CloudUpload,
  HowToReg,
  Badge,
  Rule,
  AssignmentInd
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const departmentSidebar: SidebarItem[] = [
  {
    label: "Departments",
    path: "/admin/manage#departments",
    icon: Apartment,
  },
  {
    label: "Organization Users",
    path: "/admin/manage#organization-users",
    icon: People,
    allowedRoles: ["HR_ADMIN"],
  },
  {
    label: "Assign Roles",
    path: "/admin/manage#assign-role",
    icon: AssignmentInd,
    allowedRoles: ["HR_ADMIN"],
  },
  {
    label: "Bulk Upload",
    path: "/admin/manage#bulk-upload",
    icon: CloudUpload,
  },
  {
    label: "Registration Requests",
    path: "/admin/manage#requests",
    icon: HowToReg,
  },
  {
    label: "Manage Permissions",
    path: "/admin/manage#roles",
    icon: Badge,
  },
  {
    label: "Attendance Rules",
    path: "/admin/manage#rules",
    icon: Rule,
  },
];