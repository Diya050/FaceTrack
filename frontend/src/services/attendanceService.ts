import api from "./api";

export type BackendAttendance = {
  attendance_id: string;
  user_id: string;
  attendance_date: string;

  first_check_in: string | null;
  last_check_out: string | null;

  status: string;
  organization_id: string;
};

export type AttendanceHistoryData = {
  attendance_id: string;

  date: string;

  checkIn: string;
  checkOut: string;

  total: string;

  status: string;
};

/* ───────── HELPERS ───────── */

const formatTime = (
  value: string | null
) => {
  if (!value) return "--";

  return new Date(value).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

const calculateHours = (
  checkIn: string | null,
  checkOut: string | null
) => {
  if (!checkIn || !checkOut) {
    return "--";
  }

  const start =
    new Date(checkIn);

  const end =
    new Date(checkOut);

  const diff =
    end.getTime() -
    start.getTime();

  if (diff <= 0) {
    return "--";
  }

  const totalMinutes =
    Math.floor(
      diff / 60000
    );

  const hours =
    Math.floor(
      totalMinutes / 60
    );

  const minutes =
    totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

/* ───────── USER ───────── */

export const getMyAttendance =
  async (
    params?: any
  ): Promise<
    AttendanceHistoryData[]
  > => {
    const res =
      await api.get(
        "/attendance/me",
        {
          params,
        }
      );

    const data:
      BackendAttendance[] =
      res.data;

    return data.map(
      (item) => ({
        attendance_id:
          item.attendance_id,

        date:
          item.attendance_date,

        checkIn:
          formatTime(
            item.first_check_in
          ),

        checkOut:
          formatTime(
            item.last_check_out
          ),

        total:
          calculateHours(
            item.first_check_in,
            item.last_check_out
          ),

        status:
          item.status,
      })
    );
  };

/* ───────── CORRECTIONS ───────── */

export const requestCorrection =
  async (data: {
    attendance_id: string;

    requested_time_in?: string;

    requested_time_out?: string;

    reason: string;
  }) => {
    const res =
      await api.post(
        "/attendance-corrections",
        data
      );

    return res.data;
  };

/* ───────── ADMIN ───────── */

export const getAllAttendance =
  async () => {
    const res =
      await api.get(
        "/attendance"
      );

    return res.data;
  };

export const getCorrectionRequests =
  async () => {
    const res =
      await api.get(
        "/attendance-corrections"
      );

    return res.data;
  };

export const approveCorrection =
  async (
    id: string
  ) => {
    const res =
      await api.patch(
        `/attendance-corrections/${id}/review`,
        {
          status:
            "approved",
        }
      );

    return res.data;
  };

export const rejectCorrection =
  async (
    id: string
  ) => {
    const res =
      await api.patch(
        `/attendance-corrections/${id}/review`,
        {
          status:
            "rejected",
        }
      );

    return res.data;
  };

/* ───────── LIVE EVENTS ───────── */

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

  status:
    | "recognized"
    | "unknown"
    | "blacklisted";
}

export const getRecognitionEvents =
  async (
    limit = 20,
    skip = 0
  ): Promise<
    RecognitionEvent[]
  > => {
    const res =
      await api.get(
        "/attendance/recognition/events",
        {
          params: {
            limit,
            skip,
          },
        }
      );

    return res.data;
  };