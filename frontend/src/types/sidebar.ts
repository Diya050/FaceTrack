import type { SvgIconComponent } from "@mui/icons-material";

export type SidebarLeaf = {
  label: string;
  path: string;
  icon: SvgIconComponent;
};

export type SidebarGroup = {
  label: string;
  icon: SvgIconComponent;
  children: SidebarLeaf[];
};

export type SidebarItem = SidebarLeaf | SidebarGroup;