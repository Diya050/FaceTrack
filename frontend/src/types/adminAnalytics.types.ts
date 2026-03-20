
import type { ReactNode } from "react";

export interface WeeklyAttendanceData {
  labels: string[];
  present: number[];
  absent: number[];
  late: number[];
}

export interface MonthlyTrendData {
  labels: string[];
  rate: number[];
  trend_direction: "up" | "down" | "flat";
  trend_value: string;
}

export interface DepartmentSummary {
  department_id: string;
  department: string;
  present: number;
  total: number;
  percentage: number;
}

export interface OverviewStats {
  active_staff: number;
  on_premises: number;
  avg_attendance_rate: number;
}

export interface AdminOverviewResponse {
  weekly_report: WeeklyAttendanceData;
  monthly_trend: MonthlyTrendData;
  department_summary: DepartmentSummary[];
  stats: OverviewStats;
}


export type AttendanceStatus = "present" | "absent" | "late" | "early_leave";

export interface KpiStats {
  present_today: number;
  absent_today: number;
  late_today: number;
  early_leave_today: number;
  total_registered: number;
  attendance_rate: number;
  avg_confidence_score: number;
}

export interface AttendanceRecord {
  attendance_id: string;
  full_name: string;
  department: string;
  camera_name: string;
  time_in: string | null;
  time_out: string | null;
  confidence_score: number | null;
  status: AttendanceStatus;
}

export interface KpiSummaryResponse {
  stats: KpiStats;
  recent_detections: AttendanceRecord[];
}

// This matches the props needed by your KpiCard component
export interface KpiCardData {
  label: string;
  value: number;
  total: number;
  color: string;
  icon: ReactNode;
  sub: string;
}