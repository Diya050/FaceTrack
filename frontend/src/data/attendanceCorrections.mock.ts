export type CorrectionType =
  | "wrong_check_in"
  | "wrong_check_out"
  | "wrong_absent"
  | "wrong_status";

export type CorrectionStatus = "pending" | "approved" | "rejected";

export interface AttendanceCorrection {
  id: string;
  employeeName: string;
  date: string;
  issueType: CorrectionType;
  currentValue: string;
  requestedValue: string;
  reason: string;
  status: CorrectionStatus;
  requestedAt: string;
}

export const mockAttendanceCorrections: AttendanceCorrection[] = [
  {
    id: "CR-001",
    employeeName: "Diya Baweja",
    date: "2026-02-26",
    issueType: "wrong_check_in",
    currentValue: "09:35",
    requestedValue: "09:05",
    reason: "Face recognition failed at entry gate",
    status: "pending",
    requestedAt: "2026-02-26 11:20",
  },
  {
    id: "CR-002",
    employeeName: "Priyansh Agarwal",
    date: "2026-02-26",
    issueType: "wrong_absent",
    currentValue: "Absent",
    requestedValue: "Present (09:10 – 18:00)",
    reason: "Camera was offline during check-in",
    status: "pending",
    requestedAt: "2026-02-26 14:05",
  },
  {
    id: "CR-003",
    employeeName: "Dhruvit Garathiya",
    date: "2026-02-25",
    issueType: "wrong_check_out",
    currentValue: "17:00",
    requestedValue: "18:10",
    reason: "Check-out not recorded",
    status: "approved",
    requestedAt: "2026-02-25 18:45",
  },
];