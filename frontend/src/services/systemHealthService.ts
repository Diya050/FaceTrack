import api from "./api";
import type { SystemHealthResponse } from "../types/systemHealth.types";

/**
 * Fetches live system metrics. 
 * Organization ID is handled automatically by the backend dependency.
 */
export const getSystemHealth = async (): Promise<SystemHealthResponse> => {
  // No params needed! The backend identifies the org from the auth header
  const response = await api.get<SystemHealthResponse>("/system-health");
  return response.data;
};