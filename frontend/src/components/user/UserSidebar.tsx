import React from "react";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { Link, useLocation } from "react-router-dom";

interface Props {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 70;

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/user/dashboard" },
  { label: "My Attendance", icon: <AssignmentTurnedInIcon />, path: "/user/attendance" },
  { label: "Reports", icon: <BarChartIcon />, path: "/user/reports" },
  { label: "Profile", icon: <AccountCircleIcon />, path: "/user/me" },
  { label: "Help Center", icon: <HelpOutlineIcon />, path: "/user/help" },
  { label: "User Guide", icon: <MenuBookIcon />, path: "/user/settings/user-guide" },
];

const UserSidebar: React.FC<Props> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <Box
      sx={{
        width,
        height: "100vh",
        position: "fixed",
        top: 64,
        left: 0,
        bgcolor: "#2f3b52",
        color: "#D7DCE8",
        transition: "width 0.25s ease",
        overflowX: "hidden",
        borderRight: "1px solid rgba(255,255,255,0.05)"
      }}
    >

      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={collapsed ? "center" : "space-between"}
        px={1.5}
        py={2}
      >
        {!collapsed && (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1.2,
              color: "#C9D1E3"
            }}
          >
            USER PANEL
          </Typography>
        )}

        <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{ color: "#C9D1E3" }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* MENU */}
      <List disablePadding sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Tooltip
              key={item.label}
              title={collapsed ? item.label : ""}
              placement="right"
            >
              <ListItemButton
                component={Link}
                to={item.path}
                selected={active}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.3,
                  px: collapsed ? 1 : 2,
                  justifyContent: collapsed ? "center" : "flex-start",
                  transition: "all 0.2s",

                  color: active ? "#fff" : "#C9D1E3",

                  "&.Mui-selected": {
                    bgcolor: "#404c67",
                  },

                  "&:hover": {
                    bgcolor: "#404c67",
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 1.8,
                    justifyContent: "center",
                    color: "inherit"
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 500
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
};

export default UserSidebar;