import {
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FaceIcon from "@mui/icons-material/Face"; // Icon for biometric enrollment
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

  const handleMyProfile = () => {
    handleClose();
    // Check the role to determine the correct prefix
    if (role === "SUPER_ADMIN" || role === "HR_ADMIN" || role === "ADMIN") {
      navigate("/admin/me");
    } else {
      navigate("/user/me");
    }
  };

  const handleEnrollBiometric = () => {
    handleClose();

    // Check the role to determine the correct prefix
    if (role === "SUPER_ADMIN" || role === "HR_ADMIN" || role === "ADMIN") {
      navigate("/admin/capture");
    } else {
      navigate("/user/capture");
    }
  };

  const handleSettings = () => {
    if (role === "SUPER_ADMIN" || role === "HR_ADMIN" || role === "ADMIN") {
      navigate("/admin/settings/help/admin-guide");
    } else {
      navigate("/user/settings/user-guide");
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

      {/* Avatar Button */}
      <Tooltip title="Account Settings">
        <IconButton
          onClick={handleProfileClick}
          size="medium"
          sx={{ ml: 1 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontWeight: 600,
              fontSize: "1.2rem"
            }}
          >
            {firstName?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Profile Option - Visible to ALL */}
        <MenuItem onClick={handleMyProfile}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        {/* Biometric Option - Visible to ALL */}
        <MenuItem onClick={handleEnrollBiometric}>
          <ListItemIcon>
            <FaceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Enroll Biometric</ListItemText>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        {/* Logout Option - Visible to ALL */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HeaderIcons;