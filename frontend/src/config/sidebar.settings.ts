import {
  SmartToy,
  Tune,
  NotificationsActive,
  Storage,
  MonitorHeart,
  Gavel,
  Shield,
  VerifiedUser,
  Policy,
  MenuBook,
  AdminPanelSettings,
} from "@mui/icons-material";
import type { SidebarItem } from "../types/sidebar";

export const settingsSidebar: SidebarItem[] = [
  {
    label: "System Settings",
    icon: Tune,
    children: [
      {
        label: "AI Models",
        path: "/admin/settings/system#ai-models",
        icon: SmartToy,
      },
      {
        label: "Recognition Threshold",
        path: "/admin/settings/system#threshold",
        icon: Tune,
      },
      {
        label: "Notifications Config",
        path: "/admin/settings/system#notifications",
        icon: NotificationsActive,
      },
      {
        label: "Storage & Backup",
        path: "/admin/settings/system#storage",
        icon: Storage,
      },
      {
        label: "System Status",
        path: "/admin/settings/system#system-status",
        icon: MonitorHeart,
      },
    ],
  },
  {
    label: "Security & Compliance",
    icon: Shield,
    children: [
      {
        label: "Audit Logs",
        path: "/admin/settings/security#audit-logs",
        icon: Gavel,
      },
      {
        label: "Consent Management",
        path: "/admin/settings/security#consents",
        icon: VerifiedUser,
      },
      {
        label: "Data Retention",
        path: "/admin/settings/security#data-retention",
        icon: Policy,
      },
    ],
  },
  {
    label: "Help & Support",
    icon: MenuBook,
    children: [
      {
        label: "User Guide",
        path: "/admin/settings/help/user-guide",
        icon: MenuBook,
      },
      {
        label: "Admin Guide",
        path: "/admin/settings/help/admin-guide",
        icon: AdminPanelSettings,
      },
    ],
  },
];