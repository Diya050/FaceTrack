
import React from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
<<<<<<< HEAD
  Typography
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import { Link, useLocation } from "react-router-dom";

interface Props {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 80;

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/user/dashboard" },
  { label: "My Attendance", icon: <AssignmentTurnedInIcon />, path: "/user/attendance" },
  { label: "Reports", icon: <BarChartIcon />, path: "/user/reports" },
  
  { label: "Help Center", icon: <HelpOutlineIcon />, path: "/user/help" },
  { label: "User Guide", icon: <MenuBookIcon />, path: "/user/settings/user-guide" },
];

const UserSidebar: React.FC<Props> = ({ collapsed, setCollapsed }) => {
=======
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
>>>>>>> 7930d24df0e9bb9c7459bdcf6eb6965a7e25c49d

  const location = useLocation();
  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <Box
      sx={{
<<<<<<< HEAD
        width,
        height: "100vh",
        position: "fixed",
        top: 64,
        left: 0,
        bgcolor: "#404a66",
        color: "white",
        transition: "width 0.3s"
      }}
    >

      {/* Sidebar Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: 2,
          py: 2
        }}
      >
        {!collapsed && (
          <Typography fontWeight={700}>
            USER PANEL
          </Typography>
        )}

        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{ color: "white" }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Menu */}
      <List>
        {menuItems.map((item) => {

          const active = location.pathname === item.path;

          return (
            <ListItem key={item.label} disablePadding>

              <ListItemButton
                component={Link}
                to={item.path}
                selected={active}
                sx={{
                  px: collapsed ? 2 : 3,
                  py: 1.5,
                  justifyContent: collapsed ? "center" : "flex-start"
                }}
              >

                <ListItemIcon
                  sx={{
                    color: "white",
                    minWidth: collapsed ? "auto" : 36
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText primary={item.label} />
                )}

              </ListItemButton>

            </ListItem>
=======
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
>>>>>>> 7930d24df0e9bb9c7459bdcf6eb6965a7e25c49d
          );
        })}
      </List>


    </Box>
  );
};

export default UserSidebar;