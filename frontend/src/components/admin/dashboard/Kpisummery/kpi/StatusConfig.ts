import { COLORS } from "../../../../../theme/dashboardTheme";
import type { AttendanceStatus } from "../../../../../types/dashboard.types";

export const STATUS_CONFIG: Record<
  AttendanceStatus,
  { color: string; label: string }
> = {
  present: { color: COLORS.present, label: "Present" },
  absent: { color: COLORS.absent, label: "Absent" },
  late: { color: COLORS.late, label: "Late" },
  early_leave: { color: COLORS.early, label: "Early Leave" },
};