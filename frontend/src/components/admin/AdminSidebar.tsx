import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import { useSidebarConfig } from "../../hooks/useSidebarConfig";
import { useTheme } from "@mui/material/styles";

type Props = {
  width: number;
};

const AdminSidebar = ({ width }: Props) => {
  const sidebar = useSidebarConfig();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const theme = useTheme();

  const toggle = (key: string) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box
      sx={{
        width,
        position: "fixed",
        top: 64,
        left: 0,
        height: "calc(100vh - 64px)",
        background: `linear-gradient(130deg, 
          ${theme.palette.primary.main} 100%, 
          ${theme.palette.primary.dark} 0%)`,
        borderRight: "2px solid rgba(255,255,255,0.08)",
        overflowY: "auto",
        pl: 1.5,
        pr: 2,
        py: 2,
      }}
    >

      <Typography
        sx={{
          fontSize: "0.9rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "#AAB4C8",
          px: 2,
          mb: 1.5,
        }}
      >
        ADMIN PANEL
      </Typography>

      <List disablePadding>
        {sidebar.map((item) => {
          if ("children" in item) {
            const isOpen = !!open[item.label];

            return (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() => toggle(item.label)}
                  sx={{
                    borderRadius: "12px",
                    mb: 0.5,
                    color: "#E6EAF2",
                    transition: "0.25s",
                    "&:hover": {
                      background: "rgba(255,255,255,0.08)",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  />
                  {isOpen ? (
                    <ExpandLess sx={{ fontSize: 20 }} />
                  ) : (
                    <ExpandMore sx={{ fontSize: 20 }} />
                  )}
                </ListItemButton>

                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ ml: 2 }}>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        component={NavLink}
                        to={child.path}
                        sx={{
                          pl: 3,
                          py: 0.60,
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                          transition: "0.2s",
                          background: "rgba(255,255,255,0.20)",
                          color: "#FFFFFF",
                          fontWeight: 600,
                          marginBottom: 1 / 2,

                          "&:hover": {
                            background: "rgba(255,255,255,0.10)",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: "12px",
                mb: 0.5,
                color: "#E6EAF2",
                fontSize: "0.9rem",
                transition: "0.25s",
                "&.active": {
                  background: "rgba(255,255,255,0.12)",
                  color: "#FFFFFF",
                  fontWeight: 600,
                },
                "&:hover": {
                  background: "rgba(255,255,255,0.08)",
                  color: "#FFFFFF",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default AdminSidebar;