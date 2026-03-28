import api from "./api";
import type { 
  KPIOverview, 
  TrendResponse, 
  DepartmentAttendanceResponse, 
  LateAnalyticsResponse, 
  HalfDayAnalyticsResponse, 
  AbsentAnalyticsResponse, 
  RecognitionAnalyticsResponse 
} from "../types/adminAnalytics.types";

export const fetchKPIOverview = async (): Promise<KPIOverview> => {
  const res = await api.get("/analytics/overview");
  return res.data;
};

export const fetchAttendanceTrend = async (days: number): Promise<TrendResponse> => {
  const res = await api.get("/analytics/trend", { params: { days } });
  return res.data;
};

export const fetchDepartmentAttendance = async (): Promise<DepartmentAttendanceResponse> => {
  const res = await api.get("/analytics/departments");
  return res.data;
};

export const fetchLateAnalytics = async (): Promise<LateAnalyticsResponse> => {
  const res = await api.get("/analytics/late");
  return res.data;
};

export const fetchHalfDayAnalytics = async (): Promise<HalfDayAnalyticsResponse> => {
  const res = await api.get("/analytics/half-day");
  return res.data;
};

export const fetchAbsentAnalytics = async (): Promise<AbsentAnalyticsResponse> => {
  const res = await api.get("/analytics/absent");
  return res.data;
};

export const fetchRecognitionAnalytics = async (): Promise<RecognitionAnalyticsResponse> => {
  const res = await api.get("/analytics/recognition");
  return res.data;
};

export const fetchDeptCameraStats = async (): Promise<DeptCameraStatsResponse> => {
  const res = await api.get("/analytics/dept-camera-stats");
  return res.data;
};