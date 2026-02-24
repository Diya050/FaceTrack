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
import {
  sidebarContainer,
  sidebarPanelTitle,
  sidebarItemBase,
} from "../../theme/sidebarStyles";

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
    <Box sx={{ width, ...sidebarContainer(theme) }}>
      <Typography sx={sidebarPanelTitle}>ADMIN PANEL</Typography>

      <List disablePadding>
        {sidebar.map((item) => {
          if ("children" in item) {
            const isOpen = !!open[item.label];

            return (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() => toggle(item.label)}
                  sx={sidebarItemBase}
                >
                  <ListItemText primary={item.label} />
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ ml: 2 }}>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        component={NavLink}
                        to={child.path}
                        sx={{
                          ...sidebarItemBase,
                          pl: 3,
                          py: 0.7,
                          fontSize: "0.85rem",
                          color: "#C9D1E3",
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
              sx={sidebarItemBase}
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