import api from "./api";
import type { Notification } from "../types/notifications.types";

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get("/notifications/");
  return res.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const res = await api.get("/notifications/unread-count");
  return res.data.count;
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  await api.patch(`/notifications/${notificationId}/read`);
};