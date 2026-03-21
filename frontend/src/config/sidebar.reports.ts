import {
  Assessment,
  Timeline,
  Sensors,
  FileDownload,
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const reportsSidebar: SidebarItem[] = [
  {
    label: "Summary",
    path: "/admin/reports#summary",
    icon: Assessment,
  },
  {
    label: "Trend Analysis",
    path: "/admin/reports#trends",
    icon: Timeline,
  },
  {
    label: "Detections",
    path: "/admin/reports#detections",
    icon: Sensors,
  },
  {
    label: "Exports",
    path: "/admin/reports#exports",
    icon: FileDownload,
  },
];