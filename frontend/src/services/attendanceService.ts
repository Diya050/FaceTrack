import api from "./api";

export type BackendAttendance = {
  attendance_id: string;
  attendance_date: string;
  first_check_in: string | null;
  last_check_out: string | null;
  status: string;
};

export type AttendanceHistoryData = {
  date: string;
  checkIn: string;
  checkOut: string;
  total: string;
  status: string;
};

/**
 * Convert backend → UI format
 */
const formatTime = (time: string | null) => {
  if (!time) return "--";
  return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateHours = (checkIn: string | null, checkOut: string | null) => {
  if (!checkIn || !checkOut) return "--";

  const start = new Date(`1970-01-01T${checkIn}`);
  const end = new Date(`1970-01-01T${checkOut}`);

  const diff = (end.getTime() - start.getTime()) / 1000;

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  return `${hours}h ${minutes}m`;
};

export const getMyAttendance = async (params?: any) => {
  const res = await api.get("/attendance/me", { params });

  const data: BackendAttendance[] = res.data;

  return data.map((item) => ({
    date: item.attendance_date,
    checkIn: formatTime(item.first_check_in),
    checkOut: formatTime(item.last_check_out),
    total: calculateHours(item.first_check_in, item.last_check_out),
    status: item.status,
  }));
};

// Request correction
export const requestCorrection = async (data: {
  attendance_id: string;
  requested_check_in?: string;
  requested_check_out?: string;
  reason: string;
}) => {
  const res = await api.post("/attendance-correction/request", data);
  return res.data;
};

/* ───────── ADMIN / HR ───────── */

// Get all attendance
export const getAllAttendance = async () => {
  const res = await api.get("/attendance");
  return res.data;
};

// Get correction requests
export const getCorrectionRequests = async () => {
  const res = await api.get("/attendance-correction");
  return res.data;
};

// Approve correction
export const approveCorrection = async (id: string) => {
  const res = await api.put(`/attendance-correction/${id}/approve`);
  return res.data;
};

// Reject correction
export const rejectCorrection = async (id: string) => {
  const res = await api.put(`/attendance-correction/${id}/reject`);
  return res.data;
};

// Recognition Events for Live Monitoring
export interface RecognitionEvent {
  event_id: string;
  user_id: string;
  person_name: string;
  confidence: number;
  camera_id: string;
  camera_name: string;
  location: string | null;
  department: string;
  timestamp: string;
  status: "recognized" | "unknown" | "blacklisted";
}

export const getRecognitionEvents = async (
  limit: number = 20,
  skip: number = 0
): Promise<RecognitionEvent[]> => {
  const res = await api.get("/attendance/recognition/events", {
    params: { limit, skip },
  });
  return res.data;
};