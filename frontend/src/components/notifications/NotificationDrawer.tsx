import {
  Popover,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationItem from "./NotificationItem";
import type { Notification } from "../../types/notifications.types";

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  loading: boolean;
  onMarkRead: (id: string) => void;
  onNavigate: (path: string | null) => void;
}

const NotificationDrawer = ({
  anchorEl,
  open,
  onClose,
  notifications,
  loading,
  onMarkRead,
  onNavigate,
}: Props) => {
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNavigate = (path: string | null) => {
    onClose();
    onNavigate(path);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          width: 380,
          maxHeight: 520,
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#30364F",
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#fff" }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" sx={{ color: "#AAB4C8" }}>
              {unreadCount} unread
            </Typography>
          )}
        </Box>
      </Box>

      <Divider />

      {/* Body */}
      <Box sx={{ overflowY: "auto", flex: 1 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 6,
            }}
          >
            <CircularProgress size={28} sx={{ color: "#30364F" }} />
          </Box>
        ) : notifications.length === 0 ? (
          <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <NotificationsNoneIcon sx={{ fontSize: 40, color: "#ACBAC4" }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Stack>
        ) : (
          <Box>
            {notifications.map((notification, index) => (
              <Box key={notification.notification_id}>
                <NotificationItem
                  notification={notification}
                  onMarkRead={onMarkRead}
                  onNavigate={handleNavigate}
                />
                {index < notifications.length - 1 && <Divider sx={{ mx: 2 }} />}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Popover>
  );
};

export default NotificationDrawer;