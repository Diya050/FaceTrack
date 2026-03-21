import api from "./api";
import type { AdminOverviewResponse, KpiSummaryResponse } from "../types/adminAnalytics.types";

export const getAdminOverview = (): Promise<AdminOverviewResponse> => {
  return api.get<AdminOverviewResponse>(`/admin/analytics/overview`)
    .then(resp => resp.data);
}
/**
 * Fetches Today's KPI stats and the Live Detection Feed
 */
export const getKpiSummary = (): Promise<KpiSummaryResponse> => {
  return api.get<KpiSummaryResponse>(`/admin/kpi/summary`)
    .then(res => res.data);
};

/**
 * Optional: Fetch only the live feed (for polling/refreshing the feed)
 */
export const getLiveFeed = (): Promise<KpiSummaryResponse['recent_detections']> => {
  return api.get<KpiSummaryResponse>(`/admin/kpi/summary`)
    .then(res => res.data.recent_detections);
};