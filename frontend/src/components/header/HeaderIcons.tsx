import {
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

interface Props {
  firstName: string;
}

const HeaderIcons = ({ firstName }: Props) => {
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  const handleSettings = () => {
    if (role === "admin") {
      navigate("/admin/settings/help/user-guide");
    } 
    else if (role === "user"){
      navigate("/user/help");
    }
    else{
      navigate("/login")
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Tooltip title="Notifications">
        <IconButton>
          <NotificationsNoneIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Settings">
        <IconButton onClick={handleSettings}>
          <SettingsOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Profile">
        <IconButton onClick={handleProfileClick}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontWeight: 600,
            }}
          >
            {firstName.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HeaderIcons;