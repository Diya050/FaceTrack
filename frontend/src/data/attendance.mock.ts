export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "early_leave";

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  confidence: number | null;
  camera: string;
}

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "AR-001",
    employeeName: "Dhruvit Garathiya",
    department: "Engineering",
    date: "2026-02-26",
    checkIn: "09:12",
    checkOut: "17:15",
    status: "present",
    confidence: 79,
    camera: "Entry Gate A",
  },
  {
    id: "AR-002",
    employeeName: "Komal Sharma",
    department: "Engineering",
    date: "2026-02-26",
    checkIn: "09:02",
    checkOut: "18:12",
    status: "present",
    confidence: 72,
    camera: "Entry Gate A",
  },
  {
    id: "AR-003",
    employeeName: "Diya Baweja",
    department: "Engineering",
    date: "2026-02-26",
    checkIn: "09:35",
    checkOut: "18:00",
    status: "late",
    confidence: 85,
    camera: "Entry Gate B",
  },
  {
    id: "AR-004",
    employeeName: "Mridul Hemrajani",
    department: "Engineering",
    date: "2026-02-26",
    checkIn: null,
    checkOut: null,
    status: "absent",
    confidence: null,
    camera: "—",
  },
  {
    id: "AR-005",
    employeeName: "Priyansh Agarwal",
    department: "Engineering",
    date: "2026-02-26",
    checkIn: "09:31",
    checkOut: "16:45",
    status: "present",
    confidence: 87,
    camera: "Entry Gate A",
  },
  {
    id: "AR-006",
    employeeName: "Pranjal Amulani",
    department: "Engineering",
    date: "2026-02-26",
    checkIn: "09:37",
    checkOut: "17:45",
    status: "late",
    confidence: 92,
    camera: "Entry Gate B",
  },
  {
    id: "AR-007",
    employeeName: "Prachi Singh",
    department: "Engineering",
    date: "2026-02-26",
    checkIn: "09:08",
    checkOut: "16:50",
    status: "late",
    confidence: 77,
    camera: "Entry Gate B",
  },
];