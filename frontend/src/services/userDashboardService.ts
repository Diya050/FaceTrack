
import api from "./api"; 
export interface KPIData {
  present_days: number;
  absent_days: number;
  late_marks: number;
  leave_taken: number;
  attendance_percentage: number;
  avg_work_hours: number;
}

export interface TodayAttendanceData {
  status: string;
  check_in: string | null;
  check_out: string | null;
  work_duration: string;
  camera_name: string;
  location: string;
  recognition_method: string;
  frame_id: string;
  confidence_score: number;
  ai_similarity_score: number;
}

export interface UserSummaryData {
  total_attendance: number;
  total_hours: string;
  avg_check_in: string;
  avg_check_out: string;
}


export interface DashboardUser {
  full_name: string;
}

export interface ChartDistributionData {
  on_time: number;
  late: number;
  early_out: number;
  absent: number;
}

//kpi serivce 
export const getMyKPIs = async (): Promise<KPIData> => {
  const res = await api.get("/user-dashboard/kpi/me");
  return res.data;
};

//today's attandce
export const getTodayAttendance = async (): Promise<TodayAttendanceData> => {
  const res = await api.get("/user-dashboard/today");
  return res.data;
};

export const getDashboardUser = async (): Promise<DashboardUser> => {
  const res = await api.get("/user-dashboard/user-info");
  return res.data;
};

export const getChartDistribution = async (): Promise<ChartDistributionData> => {
  const res = await api.get("/user-dashboard/chart-distribution");
  return res.data;
};