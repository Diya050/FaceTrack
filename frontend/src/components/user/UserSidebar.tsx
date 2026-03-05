
import React from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
          );
        })}
      </List>


    </Box>
  );
};

export default UserSidebar;