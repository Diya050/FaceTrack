export const settingsSidebar = [
  {
    label: "System Settings",
    children: [
      { label: "AI Models", path: "/admin/settings/system/ai-models" },
      { label: "Recognition Threshold", path: "/admin/settings/system/threshold" },
      { label: "Notifications Config", path: "/admin/settings/system/notifications" },
      { label: "Storage & Backup", path: "/admin/settings/system/storage" },
      { label: "Camera Setup", path: "/admin/settings/system/cameras" },
    ],
  },
  {
    label: "Security & Compliance",
    children: [
      { label: "Audit Logs", path: "/admin/settings/security/audit-logs" },
      { label: "Access Logs", path: "/admin/settings/security/access-logs" },
      { label: "Consent Management", path: "/admin/settings/security/consents" },
      { label: "Data Retention", path: "/admin/settings/security/data-retention" },
    ],
  },
  {
    label: "Help & Support",
    children: [
      { label: "User Guide", path: "/admin/settings/help/user-guide" },
      { label: "Admin Guide", path: "/admin/settings/help/admin-guide" },
      { label: "System Status", path: "/admin/settings/help/system-status" },
    ],
  },
];