// src/types/useranalytics.types.ts
export interface UserProfile {
  uuid: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Leave';

export interface AttendanceStat {
  status: AttendanceStatus;
  count: number;
  color: string;
}

export interface WorkingHourData {
  date: string; 
  actual: number;
  expected: number;
  overtime: number;
}

export interface RecognitionTrend {
  timestamp: string;
  confidence_score: number;
  status: 'Success' | 'Failed' | 'Retry';
}

export interface RecognitionPerformance {
  avg_confidence: number;
  success_rate: number;
  false_rejection_rate: number;
  avg_processing_time: string;
  failed_attempts: number;
  retry_count: number;
}