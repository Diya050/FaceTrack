import {
  ListAlt,
  EditNote,
  FileDownload,
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const attendanceSidebar: SidebarItem[] = [
  {
    label: "Records",
    path: "/admin/attendance#records",
    icon: ListAlt,
  },
  {
    label: "Corrections",
    path: "/admin/attendance#corrections",
    icon: EditNote,
  },
  {
    label: "Export Reports",
    path: "/admin/attendance#export",
    icon: FileDownload,
  },
];