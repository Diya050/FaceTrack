import api from "./api";
import type { LiveAlert } from "../types/liveAlerts";

export const fetchLiveAlerts = async (): Promise<LiveAlert[]> => {
  const response = await api.get<LiveAlert[]>("/live-alerts");
  return response.data;
};