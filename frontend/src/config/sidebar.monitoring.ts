import {
  GridView,
  PhotoCamera,
  SensorOccupied,
  History,
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const monitoringSidebar: SidebarItem[] = [
  {
    label: "Camera Grid",
    path: "/admin/monitoring#cameras",
    icon: GridView,
  },
  {
    label: "Camera Management",
    path: "/admin/monitoring#manage",
    icon: PhotoCamera,
  },
  {
    label: "Recognition Events",
    path: "/admin/monitoring#events",
    icon: SensorOccupied,
  },
  {
    label: "Unknown Faces",
    path: "/admin/monitoring#unknown-faces",
    icon: History,
  },
];