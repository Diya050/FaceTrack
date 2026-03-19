import api from "./../services/api";
import type { AttendanceStatsResponse } from "../types/uaAttendanceStates.types";

const BASE_PATH = "/api/ua/attendance";

export const getMonthlyAttendanceStats = async (
  organizationId?: string,
  year?: number,
  month?: number
): Promise<AttendanceStatsResponse> => {
  const params: Record<string, string | number> = {};

  if (organizationId) params.organization_id = organizationId;
  if (year) params.year = year;
  if (month) params.month = month;

  const response = await api.get<AttendanceStatsResponse>(`${BASE_PATH}/stats/monthly`, {
    params,
  });

  return response.data;
};