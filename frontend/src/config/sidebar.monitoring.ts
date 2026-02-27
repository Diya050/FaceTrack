import {
  GridView,
  Fullscreen,
  TrackChanges,
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
    label: "Full Screen View",
    path: "/admin/monitoring#fullscreen",
    icon: Fullscreen,
  },
  {
    label: "Recognition Events",
    path: "/admin/monitoring#events",
    icon: TrackChanges,
  },
  {
    label: "Event History",
    path: "/admin/monitoring#events/history",
    icon: History,
  },
];