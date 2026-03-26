
//kpisummery
export interface KPIOverview {
  present: number;
  absent: number;
  late: number;
  half_day: number;
  total: number;
}

//trend
export interface TrendItem {
  date: string;       // "25 Mar"
  present: number;
  absent: number;
  late: number;
  half_day: number;
}

export type TrendResponse = TrendItem[];

//department attendance
export interface DepartmentAttendanceItem {
  department: string;
  attendance: number; // percentage
}

export type DepartmentAttendanceResponse = DepartmentAttendanceItem[];


//late analysis

export interface LateTrendItem {
  date: string; // "Mon", "Tue"
  late_count: number;
}

export interface LateAnalyticsResponse {
  today_late: number;
  trend: LateTrendItem[];
}


//half days

export interface HalfDayTrendItem {
  date: string;
  count: number;
}

export interface HalfDayAnalyticsResponse {
  today_half_day: number;
  trend: HalfDayTrendItem[];
}


//absent

export interface AbsentTrendItem {
  date: string;
  count: number;
}

export interface AbsentAnalyticsResponse {
  today_absent: number;
  trend: AbsentTrendItem[];
}

// recognization

export interface RecognitionTrendItem {
  date: string;
  unknown_count: number;
}

export interface RecognitionAnalyticsResponse {
  recognition_rate: number; // %
  today_unknown_faces: number;
  trend: RecognitionTrendItem[];
}

export interface DeptCameraStatsResponse {
  active_cameras_count: number;
  avg_confidence_score: number;
  total_department_scans_today: number;
}