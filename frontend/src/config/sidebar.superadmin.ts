import DashboardIcon from "@mui/icons-material/Dashboard";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import type { SidebarItem } from "../types/sidebar";

export const superAdminSidebar: SidebarItem[] = [
  {
    label: "Dashboard",
    path: "/super-admin/dashboard",
    icon: DashboardIcon,
  },
  {
    label: "Organizations",
    icon: ApartmentIcon,
    children: [
      {
        label: "All Organizations",
        path: "/super-admin/organizations",
        icon: ApartmentIcon,
      },
      {
        label: "Create Organization",
        path: "/super-admin/organizations/create",
        icon: AddBusinessIcon,
      },
    ],
  },
];