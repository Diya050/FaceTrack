import type { SvgIconComponent } from "@mui/icons-material";

export type AppRole = "SUPER_ADMIN" | "HR_ADMIN" | "ADMIN" | "USER" | "ORG_ADMIN";

export type SidebarLeaf = {
  label: string;
  path: string;
  icon: SvgIconComponent;
  allowedRoles?: AppRole[];
};

export type SidebarGroup = {
  label: string;
  icon: SvgIconComponent;
  children: SidebarLeaf[];
  allowedRoles?: AppRole[];
};

export type SidebarItem = SidebarLeaf | SidebarGroup;