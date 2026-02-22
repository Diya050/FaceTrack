import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
//   Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Features", path: "/features" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "FAQs", path: "/faqs" },
  { label: "Contact Us", path: "/contact" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Login", path: "/login" },
  { label: "Register", path: "/register" },
];

const PublicHeader: React.FC = () => {
  const theme = useTheme();
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const location = useLocation();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const isActive = (path: string): boolean =>
    location.pathname === path;

  return (
    <>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>

          {/* Logo-clickable (Redirects to homepage) */}
          <Box
                component={Link}
                to="/"
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none"
                }}
            >
                <Box
                component="img"
                src="/logo.svg"
                alt="FaceTrack Logo"
                sx={{
                    height: {
                        xs: 32,
                        sm: 36,
                        md: 40
                    },
                    width: "auto",
                    objectFit: "contain"
                }}
                >
                </Box>
            </Box>

          {/* Desktop Layout */}
          {!isMobile && (
            <>
              <Box sx={{ display: "flex", gap: 4 }}>
                {navItems.slice(0, navItems.length-2).map((item) => (
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

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  component={Link}
                  to="/login"
                  color={isActive("/login") ? "primary" : "inherit"}
                >
                  Login
                </Button>

                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                >
                  Register
                </Button>
              </Box>
            </>
          )}

          {/* Mobile / Tablet Hamburger */}
          {isMobile && (
            <IconButton edge="end" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile / Tablet */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: 260 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={toggleDrawer(false)}
                  selected={isActive(item.path)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default PublicHeader;