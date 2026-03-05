import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import {
  sidebarContainer,
  sidebarPanelTitle,
  sidebarItemBase,
} from "../../theme/sidebarStyles";

type Props = {
  width?: number;
  collapsed?: boolean;
  onToggle?: () => void;
};

const sections = [
  {
    matches: ["/user/dashboard", "/user/attendance", "/user/me"],
    items: [
      {
        label: "Dashboard",
        path: "/user/dashboard",
        icon: DashboardIcon,
      },
      {
        label: "My Attendance",
        path: "/user/attendance",
        icon: FactCheckIcon,
      },
      {
        label: "My Profile",
        path: "/user/me",
        icon: PersonIcon,
      },
    ],
  },
  {
    matches: ["/user/reports"],
    items: [
      {
        label: "Reports",
        path: "/user/reports",
        icon: AssessmentIcon,
      },
    ],
  },
  {
    matches: ["/user/help", "/user/settings"],
    items: [
      {
        label: "Help Center",
        path: "/user/help",
        icon: HelpCenterIcon,
      },
      {
        label: "User Guide",
        path: "/user/settings/user-guide",
        icon: MenuBookIcon,
      },
    ],
  },
];

const UserSidebar = ({ width = 260, collapsed = false, onToggle }: Props) => {
  const { pathname } = useLocation();
  const theme = useTheme();

  const activeSection =
    sections.find((section) =>
      section.matches.some((match) => pathname.startsWith(match))
    ) ?? sections[0];

  return (
    <Box
      sx={{
        width: collapsed ? 65 : width,
        transition: "width 0.25s ease",
        overflowX: "hidden",
        ...sidebarContainer(theme),
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={collapsed ? "center" : "space-between"}
        px={1.5}
      >
        {!collapsed && (
          <Typography sx={sidebarPanelTitle}>USER PANEL</Typography>
        )}

        <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          <IconButton
            onClick={onToggle}
            sx={{ minWidth: 36, color: "gray", mb: 1.5 }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <List disablePadding>
        {activeSection.items.map((item) => {
          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                ...sidebarItemBase,
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <Tooltip title={collapsed ? item.label : ""} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 1.5,
                    justifyContent: "center",
                    color: "inherit",
                  }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </ListItemIcon>
              </Tooltip>

              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default UserSidebar;