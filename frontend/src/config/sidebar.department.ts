import {
  Apartment,
  AddCircle,
  People,
  CloudUpload,
  HowToReg,
  Badge,
  Rule,
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const departmentSidebar: SidebarItem[] = [
  {
    label: "Create Organisation",
    path: "/admin/manage#create-org",
    icon: AddCircle,
  },
  {
    label: "Departments",
    path: "/admin/manage#departments",
    icon: Apartment,
  },
  {
    label: "User Profiles",
    path: "/admin/manage#users",
    icon: People,
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
    label: "Roles",
    path: "/admin/manage#roles",
    icon: Badge,
  },
  {
    label: "Attendance Rules",
    path: "/admin/manage#rules",
    icon: Rule,
  },
];