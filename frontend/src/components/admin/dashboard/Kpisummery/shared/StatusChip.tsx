import { Chip, alpha } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";
import { STATUS_CONFIG } from "../kpi/StatusConfig";
import type { AttendanceStatus } from "../../../../../types/dashboard.types";

export default function StatusChip({ status }: { status: AttendanceStatus }) {
  const { color, label } = STATUS_CONFIG[status] ?? { color: COLORS.slate, label: status };

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: alpha(color, 0.08),
        color: color,
        fontWeight: 700,
        fontSize: '0.65rem',
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: '6px',
        textTransform: 'uppercase',
      }}
    />
  );
}