import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  sidebarContainer,
  sidebarPanelTitle,
  sidebarItemBase,
} from "../../theme/sidebarStyles";

const sections = [
  {
    matches: ["/user/dashboard", "/user/attendance"],
    items: [
      { label: "Dashboard", path: "/user/dashboard" },
      { label: "My Attendance", path: "/user/attendance" },
    ],
  },
  {
    matches: ["/user/reports"],
    items: [{ label: "Reports", path: "/user/reports" }],
  },
  {
    matches: ["/user/help", "/user/settings"],
    items: [
      { label: "Help Center", path: "/user/help" },
      { label: "User Guide", path: "/user/settings/user-guide" },
    ],
  },
];

const UserSidebar = ({ width = 260 }: { width?: number }) => {
  const { pathname } = useLocation();
  const theme = useTheme();

  const activeSection =
    sections.find((section) =>
      section.matches.some((match) => pathname.startsWith(match))
    ) ?? sections[0];

  return (
    <Box sx={{ width, ...sidebarContainer(theme) }}>
      <Typography sx={sidebarPanelTitle}>USER PANEL</Typography>

      <List disablePadding>
        {activeSection.items.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={sidebarItemBase}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default UserSidebar;