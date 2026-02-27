import { Chip, alpha } from "@mui/material";
import { COLORS } from "../../../../theme/dashboardTheme";

const SEVERITY_COLORS = {
  critical: COLORS.absent,
  warning: COLORS.late,
  info: COLORS.navy,
};

export default function AlertChip({ severity }: { severity: keyof typeof SEVERITY_COLORS }) {
  const color = SEVERITY_COLORS[severity];

  return (
    <Chip
      label={severity.toUpperCase()}
      size="small"
      sx={{
        bgcolor: alpha(color, 0.1),
        color,
        fontWeight: 800,
        fontSize: "0.65rem",
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: "6px",
      }}
    />
  );
}