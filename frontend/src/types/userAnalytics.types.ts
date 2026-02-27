// src/types/useranalytics.types.ts

/**
 * Matches the 'USERS' table + 'DEPARTMENTS' addition
 */
export interface UserProfile {
  uuid: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
}

/**
 * Requirement 3.2 & 3.4: Attendance Categories
 */
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Leave';

export interface AttendanceStat {
  status: AttendanceStatus;
  count: number;
  color: string;
}

/**
 * Requirement 3.3: Working Hours Data
 */
export interface WorkingHourData {
  date: string; // e.g., "2026-02-24" or "Mon"
  actual: number;
  expected: number;
  overtime: number;
}

/**
 * Requirement 3.5 & 3.6: AI Recognition Intelligence
 * Maps to ATTENDANCE.confidence_score and UNKNOWN_FACES
 */
export interface RecognitionTrend {
  timestamp: string;
  confidence_score: number; // float from DB
  status: 'Success' | 'Failed' | 'Retry';
  processing_time_ms: number; // avg time for the frame to be processed
}

export interface RecognitionPerformance {
  avg_confidence: number;
  success_rate: number;
  false_rejection_rate: number;
  avg_processing_time: string;
  failed_attempts: number;
  retry_count: number;
}

/**
 * Requirement 3.7: Behavioral Insights
 */
export interface BehavioralInsights {
  peak_arrival_time: string;
  late_frequency_by_day: Record<string, number>; // e.g., { "Monday": 5 }
  consistency_score: number; // 0 to 100
  stability_index: number;   // 0 to 100
}

/**
 * Combined Analytics State (Mock Data Wrapper)
 */
export interface UserAnalyticsData {
  user: UserProfile;
  attendanceStats: AttendanceStat[];
  workingHours: WorkingHourData[];
  recognitionTrends: RecognitionTrend[];
  performance: RecognitionPerformance;
  behavioral: BehavioralInsights;
}