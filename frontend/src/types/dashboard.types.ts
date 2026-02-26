// src/types/dashboard.types.ts
// ─────────────────────────────────────────────────────────────
// All TypeScript interfaces for the FaceTrack Admin Dashboard.
// Each interface maps directly to a DB table or API response.
// ─────────────────────────────────────────────────────────────

// ── TABLE: attendance ─────────────────────────────────────────
// attendance_id | user_id | camera_id | attendance_date
// time_in | time_out | status | confidence_score | created_at
export type AttendanceStatus = "present" | "absent" | "late" | "early_leave";

export interface AttendanceRecord {
  attendance_id: string;
  full_name: string;              // JOIN users.full_name
  department: string;             // JOIN users.department
  camera_name: string;            // JOIN cameras.camera_name
  time_in: string | null;         // attendance.time_in
  time_out: string | null;        // attendance.time_out
  status: AttendanceStatus;       // attendance.status
  confidence_score: number | null;// attendance.confidence_score
}

// ── TABLE: users ──────────────────────────────────────────────
// user_id | full_name | email | department | role_id | status
export interface OverviewStats {
  total_registered: number;       // COUNT(*) FROM users WHERE status='active'
  present_today: number;          // COUNT(*) FROM attendance WHERE date=TODAY AND status='present'
  absent_today: number;           // COUNT(*) FROM attendance WHERE date=TODAY AND status='absent'
  late_today: number;             // COUNT(*) FROM attendance WHERE date=TODAY AND status='late'
  early_leave_today: number;      // COUNT(*) FROM attendance WHERE date=TODAY AND status='early_leave'
  attendance_rate: number;        // (present_today / total_registered) * 100
  avg_confidence_score: number;   // AVG(confidence_score) FROM attendance WHERE date=TODAY
}

// ── TABLE: attendance grouped by attendance_date ──────────────
export interface WeeklyReport {
  labels: string[];               // attendance_date (Mon–Fri)
  present: number[];              // COUNT(status='present') per day
  absent: number[];               // COUNT(status='absent') per day
  late: number[];                 // COUNT(status='late') per day
}

// ── TABLE: attendance JOIN users grouped by department ────────
export interface DepartmentRow {
  department: string;             // users.department
  total: number;                  // COUNT(*) FROM users WHERE department=x
  present: number;                // COUNT(*) FROM attendance WHERE dept=x AND date=TODAY
}

// ── TABLE: attendance grouped by date (last N days) ──────────
export interface MonthlyTrend {
  labels: string[];               // attendance_date
  rate: number[];                 // (present / total_registered) * 100
}

// ── TABLE: cameras ────────────────────────────────────────────
// camera_id | camera_name | camera_type | location | status | last_heartbeat
export interface CameraStatusSummary {
  online: number;                 // COUNT(*) FROM cameras WHERE status='online'
  offline: number;                // COUNT(*) FROM cameras WHERE status='offline'
  maintenance: number;            // COUNT(*) FROM cameras WHERE status='maintenance'
  total: number;                  // COUNT(*) FROM cameras
}

// ── KPI Card ──────────────────────────────────────────────────
export interface KpiCardData {
  label: string;
  value: number | string;
  previousValue?: number;         // for delta calculation (vs yesterday / last week)
  total?: number;                 // for progress bar
  color: string;
  icon: React.ReactNode;
  sub: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;            // e.g. "+5% vs yesterday"
}