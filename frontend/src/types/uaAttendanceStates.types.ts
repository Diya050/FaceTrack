export type AttendanceStat = {
  status: string;
  count: number;
  color?: string | null;
};

export type AttendanceStatsResponse = {
  month: number;
  year: number;
  organization_id?: string | null;
  stats: AttendanceStat[];
};
