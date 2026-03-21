export type ProductivityMetricsResponse = {
  attendance_consistency: number;
  stability_index: number;
  peak_arrival?: string | null;
  late_frequency_per_week: number;
  period_start: string;
  period_end: string;
};

export type RecognitionTrendPoint = {
  timestamp: string;
  confidence_score: number;
};

export type RecognitionPerformance = {
  avg_confidence: number;
  success_rate: number;
  false_rejection_rate: number;
};

export type RecognitionInsightsResponse = {
  model_version?: string | null;
  trends: RecognitionTrendPoint[];
  performance: RecognitionPerformance;
};

export type WorkingHoursPoint = {
  date: string; // ISO date string
  actual: number;
};

export type WorkingHoursResponse = {
  start_date: string;
  end_date: string;
  points: WorkingHoursPoint[];
  avg_hours: number;
};

export type AttendanceStat = {
  status: string;
  count: number;
  color?: string | null;
};

export type AttendanceStatsResponse = {
  month: number;
  year: number;
  organization_id?: string | null;
  stats: AttendanceStat[];
};

export type ExportParams = {
  type: "pdf" | "csv";
  organization_id?: string;
  start_date?: string; // ISO date
  end_date?: string;   // ISO date
};
