import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FaceIcon from "@mui/icons-material/Face";
import LogoutIcon from "@mui/icons-material/Logout";
import type { SidebarItem } from "../types/sidebar";

export const userSidebar: SidebarItem[] = [
  {
    label: "My Profile",
    path: "/admin/me",
    icon: PersonOutlineIcon,
  },
  {
    label: "Enroll Biometric",
    path: "/admin/capture", 
    icon: FaceIcon,
  },
  {
    label: "Logout",
    path: "/login",
    icon: LogoutIcon,
  },
];