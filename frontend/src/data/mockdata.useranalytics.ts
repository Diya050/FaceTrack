// src/data/mockdata.useranalytics.ts
import { COLORS } from '../theme/dashboardTheme';
import type { 
  UserProfile, 
  AttendanceStat, 
  WorkingHourData, 
  RecognitionTrend, 
  RecognitionPerformance 
} from '../types/userAnalytics.types';

export const MOCK_USER: UserProfile = {
  uuid: "u1-789-v2",
  full_name: "Dhruvit Garthiya",
  email: "dhruvitgarthiya@gmail.com",
  department: "Information Technology",
  role: "Programmer Analyst",
  status: 'Active'
};

export const MOCK_ATTENDANCE_STATS: AttendanceStat[] = [
  { status: 'Present', count: 18, color: COLORS.present },
  { status: 'Late', count: 4, color: COLORS.late },
  { status: 'Absent', count: 2, color: COLORS.absent },
  { status: 'Leave', count: 1, color: COLORS.early },
];

export const MOCK_WORKING_HOURS: WorkingHourData[] = [
  { date: 'Mon', actual: 8.5, expected: 8, overtime: 0.5 },
  { date: 'Tue', actual: 7.8, expected: 8, overtime: -0.2 },
  { date: 'Wed', actual: 9.2, expected: 8, overtime: 1.2 },
  { date: 'Thu', actual: 8.0, expected: 8, overtime: 0.0 },
  { date: 'Fri', actual: 6.5, expected: 8, overtime: -1.5 },
];

export const MOCK_RECOGNITION_TRENDS: RecognitionTrend[] = [
  { timestamp: 'Feb 20', confidence_score: 0.98, status: 'Success' },
  { timestamp: 'Feb 21', confidence_score: 0.96, status: 'Success' },
  { timestamp: 'Feb 22', confidence_score: 0.72, status: 'Success' },
  { timestamp: 'Feb 23', confidence_score: 0.94, status: 'Success' },
  { timestamp: 'Feb 24', confidence_score: 0.97, status: 'Success' },
];

export const MOCK_RECOGNITION_PERFORMANCE: RecognitionPerformance = {
  avg_confidence: 0.914,
  success_rate: 99.2,
  false_rejection_rate: 0.8,
  avg_processing_time: "215ms",
  failed_attempts: 2,
  retry_count: 5
};