// src/data/dashboard.mock.ts

import type {
  OverviewStats,
  WeeklyReport,
  DepartmentRow,
  MonthlyTrend,
  CameraStatusSummary,
  AttendanceRecord,
} from "../types/dashboard.types"

/* ─────────────────────────────────────────────
   OVERVIEW STATS
───────────────────────────────────────────── */

export const mockOverviewStats: OverviewStats = {
  total_registered: 348,
  present_today: 289,
  absent_today: 41,
  late_today: 18,
  early_leave_today: 7,
  attendance_rate: 83.0,
  avg_confidence_score: 94.6,
}

/* ─────────────────────────────────────────────
   WEEKLY REPORT
───────────────────────────────────────────── */

export const mockWeeklyReport: WeeklyReport = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  present: [301, 289, 310, 295, 289],
  absent: [32, 44, 24, 38, 41],
  late: [15, 15, 14, 15, 18],
}

/* ─────────────────────────────────────────────
   DEPARTMENT SUMMARY
───────────────────────────────────────────── */

export const mockDepartmentSummary: DepartmentRow[] = [
  { department: "Engineering", total: 142, present: 120 },
  { department: "HR", total: 28, present: 24 },
  { department: "Finance", total: 44, present: 38 },
  { department: "Marketing", total: 56, present: 47 },
  { department: "Operations", total: 78, present: 60 },
]

/* ─────────────────────────────────────────────
   MONTHLY TREND
───────────────────────────────────────────── */

export const mockMonthlyTrend: MonthlyTrend = {
  labels: ["Feb 1", "Feb 5", "Feb 10", "Feb 15", "Feb 20", "Feb 25", "Feb 26"],
  rate: [88.2, 85.4, 90.1, 83.6, 87.9, 84.2, 83.0],
}

/* ─────────────────────────────────────────────
   CAMERA STATUS SUMMARY
───────────────────────────────────────────── */

export const mockCameraStatus: CameraStatusSummary = {
  online: 11,
  offline: 2,
  maintenance: 1,
  total: 14,
}

/* ─────────────────────────────────────────────
   RECENT ATTENDANCE
───────────────────────────────────────────── */

export const mockRecentAttendance: AttendanceRecord[] = [
  {
    attendance_id: "a1",
    full_name: "Komal Sharma",
    department: "SpringBoot",
    camera_name: "Entry Gate A",
    time_in: "09:02",
    time_out: "18:15",
    status: "present",
    confidence_score: 97.3,
  },
  {
    attendance_id: "a2",
    full_name: "Diya Baweja",
    department: "Nodejs",
    camera_name: "Entry Gate B",
    time_in: "09:31",
    time_out: "18:00",
    status: "late",
    confidence_score: 95.1,
  },
  {
    attendance_id: "a3",
    full_name: "Prachi Singh",
    department: "Angular",
    camera_name: "Entry Gate A",
    time_in: "08:58",
    time_out: null,
    status: "present",
    confidence_score: 98.7,
  },
  {
    attendance_id: "a4",
    full_name: "Pranjal Amulani",
    department: "React",
    camera_name: "Lab Cam 1",
    time_in: "09:05",
    time_out: "17:30",
    status: "early_leave",
    confidence_score: 91.4,
  },
  {
    attendance_id: "a5",
    full_name: "Mridul Hemrajani",
    department: "Python",
    camera_name: "—",
    time_in: null,
    time_out: null,
    status: "absent",
    confidence_score: null,
  },
]