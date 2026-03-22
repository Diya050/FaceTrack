export interface Notification {
  notification_id: string;
  message: string;
  type: "INFO" | "SUCCESS" | "ERROR" | "ALERT" | string;
  is_read: boolean;
  created_at: string;
  redirect_path: string | null;
  entity_id: string | null;
  event_type: string | null;
}