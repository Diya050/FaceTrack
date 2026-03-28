export interface WorkingHoursDataPoint {
  // Will be a Department Name (for HR) or a Date String "YYYY-MM-DD" (for Dept Admin)
  label: string; 
  avgHours: number;
}

export interface WorkingHoursResponse {
  data: WorkingHoursDataPoint[];
  systemWideAvg?: number; // Optional metadata for HR view
}

export interface DetectionEvent {
  event_id: string;
  full_name: string;
  department_name: string;
  camera_name: string;
  time_ist: string;
  confidence_score: number;
}

export interface RecentDetectionsResponse {
  detections: DetectionEvent[];
}


export type ExportFormat = "csv" | "pdf";

export interface ExportParams {
  format: ExportFormat;
  target_date?: string; // YYYY-MM-DD
}