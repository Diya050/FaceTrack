import api from "./api";
import type { LiveAlert } from "../types/liveAlerts";

export const fetchLiveAlerts = (): Promise<LiveAlert[]> => {
  return api.get<LiveAlert[]>("/live-alerts").then((response) => response.data);
};

export const deleteLiveAlert = (alertId: string): Promise<void> => {
  return api.delete(`/live-alerts/${alertId}`).then(() => undefined);
};

export const deletePreviousLiveAlerts = (): Promise<void> => {
  return api.delete("/live-alerts/previous").then(() => undefined);
};