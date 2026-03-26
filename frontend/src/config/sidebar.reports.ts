import {
  LiveHelpSharp,
  Timeline,
  FileDownload,
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const reportsSidebar: SidebarItem[] = [
  {
    label: "Live Detection",
    path: "/admin/reports#live",
    icon: LiveHelpSharp,
  },
  {
    label: "work hours",
    path: "/admin/reports#hours",
    icon: Timeline,
  },
  {
    label: "Exports",
    path: "/admin/reports#exports",
    icon: FileDownload,
  },
];