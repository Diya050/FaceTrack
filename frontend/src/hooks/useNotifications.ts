import { useState, useEffect, useCallback, useRef } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../services/notificationService";
import type { Notification } from "../types/notifications.types";
import api from "../services/api";
import {
  isNotificationQuietHours,
  playNotificationSound,
  type NotificationSound,
} from "../utils/notificationSounds";

interface NotificationSettingsConfig {
  pauseAll?: boolean;
  dndEnabled?: boolean;
  dndStart?: string;
  dndEnd?: string;
  alertSound?: NotificationSound;
  alertVolume?: number;
}

const DEFAULT_NOTIFICATION_SETTINGS: Required<NotificationSettingsConfig> = {
  pauseAll: false,
  dndEnabled: false,
  dndStart: "22:00",
  dndEnd: "06:00",
  alertSound: "chime",
  alertVolume: 60,
};

const normalizeNotificationSettings = (value: unknown): Required<NotificationSettingsConfig> => {
  if (typeof value === "string") {
    try {
      return normalizeNotificationSettings(JSON.parse(value));
    } catch {
      return { ...DEFAULT_NOTIFICATION_SETTINGS };
    }
  }

  if (!value || typeof value !== "object") {
    return { ...DEFAULT_NOTIFICATION_SETTINGS };
  }

  const settings = value as NotificationSettingsConfig;

  return {
    pauseAll: Boolean(settings.pauseAll),
    dndEnabled: Boolean(settings.dndEnabled),
    dndStart: typeof settings.dndStart === "string" ? settings.dndStart : DEFAULT_NOTIFICATION_SETTINGS.dndStart,
    dndEnd: typeof settings.dndEnd === "string" ? settings.dndEnd : DEFAULT_NOTIFICATION_SETTINGS.dndEnd,
    alertSound:
      settings.alertSound === "ping" ||
      settings.alertSound === "ding" ||
      settings.alertSound === "beep" ||
      settings.alertSound === "none"
        ? settings.alertSound
        : DEFAULT_NOTIFICATION_SETTINGS.alertSound,
    alertVolume:
      typeof settings.alertVolume === "number"
        ? settings.alertVolume
        : DEFAULT_NOTIFICATION_SETTINGS.alertVolume,
  };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const notificationSettingsRef = useRef<Required<NotificationSettingsConfig>>({
    ...DEFAULT_NOTIFICATION_SETTINGS,
  });
  const previousUnreadCountRef = useRef<number | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      const previousCount = previousUnreadCountRef.current;
      setUnreadCount(count);

      if (previousCount !== null && count > previousCount) {
        const settings = notificationSettingsRef.current;
        const quietHours = isNotificationQuietHours(
          settings.dndEnabled,
          settings.dndStart,
          settings.dndEnd
        );

        if (!settings.pauseAll && !quietHours) {
          void playNotificationSound(settings.alertSound, settings.alertVolume);
        }
      }

      previousUnreadCountRef.current = count;
    } catch {
      // silently fail
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBellClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen(true);
      fetchNotifications();
    },
    [fetchNotifications]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setOpen(false);
  }, []);

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silently fail
    }
  }, []);

  const loadNotificationSettings = useCallback(async () => {
    try {
      const { data } = await api.get("/organizations/me");
      const rootConfig =
        data?.notification_config && typeof data.notification_config === "object"
          ? data.notification_config
          : null;
      const scopedSettings = rootConfig && typeof rootConfig === "object"
        ? (rootConfig as { notification_settings?: unknown }).notification_settings
        : null;

      notificationSettingsRef.current = normalizeNotificationSettings(
        scopedSettings ?? rootConfig
      );
    } catch {
      // silently fail
    }
  }, []);

  // Poll unread count every 30 seconds

interface NotificationSettingsUpdatedEvent extends Event {
  detail?: NotificationSettingsConfig;
}
  useEffect(() => {
    void loadNotificationSettings();
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount, loadNotificationSettings]);

  useEffect(() => {
    const syncFromSettingsEvent = (event: Event) => {
      const customEvent = event as NotificationSettingsUpdatedEvent;
      notificationSettingsRef.current = normalizeNotificationSettings(customEvent.detail);
    };

    window.addEventListener("notification-settings-updated", syncFromSettingsEvent);
    return () => {
      window.removeEventListener("notification-settings-updated", syncFromSettingsEvent);
    };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    open,
    anchorEl,
    handleBellClick,
    handleClose,
    handleMarkAsRead,
  };
};