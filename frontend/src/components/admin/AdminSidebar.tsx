import { useState, forwardRef, useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import type { NavLinkProps } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useSidebarConfig } from "../../hooks/useSidebarConfig";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
import {
  sidebarContainer,
  sidebarPanelTitle,
  sidebarItemBase,
} from "../../theme/sidebarStyles";

const LinkBehavior = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (props, ref) => <NavLink ref={ref} {...props} />
);
LinkBehavior.displayName = "LinkBehavior";

type Props = {
  width: number;
  collapsed?: boolean;
  onToggle?: () => void;
};

const AdminSidebar = ({ width, collapsed = false, onToggle }: Props) => {
  const sidebar = useSidebarConfig();
  const { role } = useAuth();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const theme = useTheme();

  const visibleSidebar = sidebar
    .filter((item) => {
      if (!("allowedRoles" in item) || !item.allowedRoles?.length) {
        return true;
      }
      return role ? item.allowedRoles.includes(role) : false;
    })
    .map((item) => {
      if (!("children" in item)) {
        return item;
      }

      const visibleChildren = item.children.filter((child) => {
        if (!child.allowedRoles?.length) {
          return true;
        }
        return role ? child.allowedRoles.includes(role) : false;
      });

      return {
        ...item,
        children: visibleChildren,
      };
    })
    .filter((item) => !("children" in item) || item.children.length > 0);

  useEffect(() => {
    if (collapsed) setOpen({});
  }, [collapsed]);

  const toggle = (key: string) => {
    if (collapsed) return;
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
          <Typography sx={sidebarPanelTitle}>ADMIN PANEL</Typography>
        )}

        <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          <IconButton
            onClick={onToggle}
            sx={{ minWidth: 36, color: "gray", mb: 1.5 }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <List disablePadding>
        {visibleSidebar.map((item) => {
          if ("children" in item) {
            const isOpen = !!open[item.label];
            const Icon = item.icon;

            return (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() => toggle(item.label)}
                  sx={{
                    ...sidebarItemBase,
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                >
                  {Icon && (
                    <Tooltip
                      title={collapsed ? item.label : ""}
                      placement="right"
                    >
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
                  )}

                  {!collapsed && (
                    <>
                      <ListItemText primary={item.label} />
                      {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </>
                  )}
                </ListItemButton>

                <Collapse in={isOpen && !collapsed} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ ml: 2 }}>
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;

                      return (
                        <ListItemButton
                          key={child.path}
                          component={LinkBehavior}
                          to={child.path}
                          sx={{
                            ...sidebarItemBase,
                            justifyContent: collapsed
                              ? "center"
                              : "flex-start",
                            pl: collapsed ? 0 : 3,
                            py: 0.7,
                            fontSize: "0.85rem",
                            color: "#C9D1E3",
                          }}
                        >
                          {ChildIcon && (
                            <Tooltip
                              title={collapsed ? child.label : ""}
                              placement="right"
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: collapsed ? 0 : 1.5,
                                  justifyContent: "center",
                                  color: "inherit",
                                }}
                              >
                                <ChildIcon fontSize="small" />
                              </ListItemIcon>
                            </Tooltip>
                          )}

                          {!collapsed && <ListItemText primary={child.label} />}
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.path}
              component={LinkBehavior}
              to={item.path}
              sx={{
                ...sidebarItemBase,
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              {Icon && (
                <Tooltip
                  title={collapsed ? item.label : ""}
                  placement="right"
                >
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
              )}

              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          );
        })}
        
      </List>
    </Box>
  );
};

export default AdminSidebar;