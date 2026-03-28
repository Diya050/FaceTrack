import {
  Apartment,
  People,
  // CloudUpload,
  HowToReg,
  Face,
  Rule,
  AssignmentInd
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const departmentSidebar: SidebarItem[] = [
  {
    label: "Departments",
    path: "/admin/manage#departments",
    icon: Apartment,
    allowedRoles: ["HR_ADMIN"],
  },
  {
    label: "Department Users",
    path: "/admin/manage#users",
    icon: Apartment,
    allowedRoles: ["ADMIN"],
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
  // {
  //   label: "Bulk Upload",
  //   path: "/admin/manage#bulk-upload",
  //   icon: CloudUpload,
  // },
  {
    label: "Registration Requests",
    path: "/admin/manage#requests",
    icon: HowToReg,
    allowedRoles: ["HR_ADMIN"],
  },
  {
    label: "Face Enrollment Requests",
    path: "/admin/manage#face-enrollment-requests",
    icon: Face,
    allowedRoles: ["HR_ADMIN"],
  },
  {
    label: "Attendance Rules",
    path: "/admin/manage#rules",
    icon: Rule,
    allowedRoles: ["ADMIN", "HR_ADMIN"],
  },
];