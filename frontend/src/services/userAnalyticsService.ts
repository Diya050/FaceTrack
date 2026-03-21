import api from "./api";
import type { ProductivityMetricsResponse } from "../types/userAnalyticsBackend.types";
import type { RecognitionInsightsResponse } from "../types/userAnalyticsBackend.types";
import type { WorkingHoursResponse } from "../types/userAnalyticsBackend.types";
import type { AttendanceStatsResponse } from "../types/userAnalyticsBackend.types";
import type { ExportParams } from "../types/userAnalyticsBackend.types";


const BASE_PATH = '/user-analytics';

export const getProductivityMetrics = (
  year?: number,
  month?: number
): Promise<ProductivityMetricsResponse> => {
  const params: Record<string, number> = {};
  if (year) params.year = year;
  if (month) params.month = month;

  return api.get<ProductivityMetricsResponse>(`${BASE_PATH}/productivity`, { params })
    .then(resp => resp.data);
};

export const getRecognitionInsights = (
  hours = 72,
  intervalMinutes = 60,
  lookbackDays = 30
): Promise<RecognitionInsightsResponse> => {
  const params = { 
    hours, 
    interval_minutes: intervalMinutes, 
    lookback_days: lookbackDays 
  };
  
  return api.get<RecognitionInsightsResponse>(`${BASE_PATH}/insights`, { params })
    .then(resp => resp.data);
};

export const getWorkingHoursTrend = (
  days = 7,
  year?: number,
  month?: number
): Promise<WorkingHoursResponse> => {
  const params: Record<string, number> = { days };
  if (year) params.year = year;
  if (month) params.month = month;

  return api.get<WorkingHoursResponse>(`${BASE_PATH}/trend`, { params })
    .then(resp => resp.data);
};

export const getMonthlyAttendanceStats = (
  organizationId?: string,
  year?: number,
  month?: number
): Promise<AttendanceStatsResponse> => {
  const params: Record<string, string | number> = {};
  if (organizationId) params.organization_id = organizationId;
  if (year) params.year = year;
  if (month) params.month = month;

  return api.get<AttendanceStatsResponse>(`${BASE_PATH}/stats/monthly`, { params })
    .then(resp => resp.data);
};

export const downloadAttendanceExport = (params: ExportParams): Promise<Blob> => {
  return api
    .get(`/user-analytics/export`, {
      params,
      responseType: "blob", // CRITICAL: This ensures Axios doesn't parse it as JSON
    })
    .then((resp) => {
      // Create a blob with the correct type from headers
      const contentType = resp.headers['content-type'];
      return new Blob([resp.data], { type: contentType });
    });
};