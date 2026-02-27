import {
  Apartment,
  People,
  CloudUpload,
  Face,
  Badge,
  Security,
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const departmentSidebar: SidebarItem[] = [
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
    label: "Face Gallery",
    path: "/admin/manage#face-gallery",
    icon: Face,
  },
  {
    label: "Roles",
    path: "/admin/manage#roles",
    icon: Badge,
  },
  {
    label: "Access Control",
    path: "/admin/manage#access-control",
    icon: Security,
  },
];