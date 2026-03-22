import { Box, Typography, IconButton, Chip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import type { Notification } from "../../types/notifications.types";

interface Props {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onNavigate: (path: string | null) => void;
}

const typeConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  INFO: {
    color: "#0288D1",
    bg: "#E3F2FD",
    icon: <InfoOutlinedIcon fontSize="small" sx={{ color: "#0288D1" }} />,
  },
  SUCCESS: {
    color: "#2E7D32",
    bg: "#E8F5E9",
    icon: <CheckCircleIcon fontSize="small" sx={{ color: "#2E7D32" }} />,
  },
  ERROR: {
    color: "#D32F2F",
    bg: "#FFEBEE",
    icon: <ErrorOutlineIcon fontSize="small" sx={{ color: "#D32F2F" }} />,
  },
  ALERT: {
    color: "#ED6C02",
    bg: "#FFF3E0",
    icon: <WarningAmberIcon fontSize="small" sx={{ color: "#ED6C02" }} />,
  },
};

const getConfig = (type: string) =>
  typeConfig[type?.toUpperCase()] ?? typeConfig["INFO"];

const timeAgo = (dateStr: string): string => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationItem = ({ notification, onMarkRead, onNavigate }: Props) => {
  const config = getConfig(notification.type);

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkRead(notification.notification_id);
    }
    if (notification.redirect_path) {
      onNavigate(notification.redirect_path);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        px: 2,
        py: 1.5,
        cursor: notification.redirect_path ? "pointer" : "default",
        backgroundColor: notification.is_read ? "transparent" : config.bg,
        borderLeft: notification.is_read
          ? "3px solid transparent"
          : `3px solid ${config.color}`,
        transition: "background-color 0.2s",
        "&:hover": {
          backgroundColor: notification.is_read ? "#F8F9FA" : config.bg,
        },
      }}
    >
      {/* Type Icon */}
      <Box
        sx={{
          mt: 0.3,
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: `${config.color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {config.icon}
      </Box>

      {/* Message + meta */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: notification.is_read ? 400 : 600,
            color: "#30364F",
            lineHeight: 1.4,
            wordBreak: "break-word",
          }}
        >
          {notification.message}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {timeAgo(notification.created_at)}
          </Typography>

          {notification.redirect_path && (
            <Chip
              label="View"
              size="small"
              sx={{
                height: 16,
                fontSize: "0.65rem",
                backgroundColor: config.bg,
                color: config.color,
                border: `1px solid ${config.color}40`,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Mark as read */}
      {!notification.is_read && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead(notification.notification_id);
          }}
          sx={{ flexShrink: 0, color: config.color, p: 0.3 }}
          title="Mark as read"
        >
          <CheckCircleOutlineIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default NotificationItem;