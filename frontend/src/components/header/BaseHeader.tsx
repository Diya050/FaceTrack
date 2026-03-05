import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Collapse,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useLocation } from "react-router-dom";

// --- Types ---
export interface NavItem {
  label: string;
  path: string;
  hideOnDesktop?: boolean; // Items like Settings/Help that are already icons
  children?: NavItem[];    // Sub-menu items
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

  // State for Drawer and Nested Menus
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleSubMenuToggle = (label: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      <AppBar position="fixed" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>

          {/* Logo Section */}
          <Box component={Link} to={logoLink} sx={{ display: "inline-flex" }}>
            <Box
              component="img"
              src="/logo.svg"
              alt="FaceTrack"
              sx={{ height: { xs: 40, md: 48 } }}
            />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems
                .filter((item) => !item.hideOnDesktop)
                .map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color={isActive(item.path) ? "primary" : "inherit"}
                    sx={{
                      fontWeight: isActive(item.path) ? 700 : 500,
                      textTransform: "none",
                      fontSize: "1rem"
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
            </Box>
          )}

          {/* Right Slot & Hamburger Toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {rightSlot}

            {isMobile && (
              <IconButton
                edge="end"
                onClick={toggleDrawer(true)}
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { width: 300, backgroundColor: theme.palette.background.default },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >

          <Typography fontWeight={600} color="dark">CONTROL PANEL</Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Nested List Tree */}
        <List component="nav" sx={{ pt: 0 }}>
          {navItems.map((item) => (
            <React.Fragment key={item.label}>
              {/* Top Level Item */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={
                    item.children
                      ? () => handleSubMenuToggle(item.label)
                      : toggleDrawer(false)
                  }
                  component={item.children ? "div" : Link}
                  to={item.children ? undefined : item.path}
                  selected={isActive(item.path)}
                  sx={{ py: 1.5 }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      // Only bold if it's the exact path OR if a child is active
                      fontWeight: (location.pathname === item.path || (item.children?.some(child => location.pathname === child.path))) ? 700 : 500,
                      fontSize: "1.05rem",
                      color: (location.pathname === item.path || (item.children?.some(child => location.pathname === child.path))) ? "primary.main" : "inherit"
                    }}
                  />
                  {item.children ? (
                    openSubMenus[item.label] ? <ExpandLess /> : <ExpandMore />
                  ) : null}
                </ListItemButton>
              </ListItem>

              {/* Collapsible Sub-items */}
              {item.children && (
                <Collapse in={openSubMenus[item.label]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ bgcolor: "action.hover" }}>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        component={Link}
                        to={child.path}
                        onClick={toggleDrawer(false)}
                        selected={location.pathname === child.path}
                        sx={{
                          pl: 4,
                          py: 1,
                          borderLeft: location.pathname === child.path ? `4px solid ${theme.palette.primary.main}` : "none"
                        }}
                      >
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: location.pathname === child.path ? 600 : 400,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default BaseHeader;