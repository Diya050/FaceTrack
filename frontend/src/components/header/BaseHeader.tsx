import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
import React from "react";

interface NavItem {
  label: string;
  path: string;
}

interface BaseHeaderProps {
  logoLink: string;
  navItems: NavItem[];
  rightSlot?: React.ReactNode;
}

const BaseHeader = ({ logoLink, navItems, rightSlot }: BaseHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  return (
    <AppBar position="fixed" color="inherit" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
        {/* Logo */}
        <Box component={Link} to={logoLink} sx={{ display: "inline-flex" }}>
          <Box
            component="img"
            src="/logo.svg"
            alt="FaceTrack"
            sx={{ height: 56 }}
          />
        </Box>

        {/* Desktop Nav */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 4 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color={isActive(item.path) ? "primary" : "inherit"}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Right Slot */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {rightSlot}
          {isMobile && (
            <IconButton>
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BaseHeader;