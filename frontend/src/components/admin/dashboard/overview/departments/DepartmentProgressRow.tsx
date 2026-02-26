import { Box, Stack, Typography, LinearProgress, alpha, Chip } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";

interface DepartmentProgressRowProps {
  label: string;
  present: number;
  total: number;
  color: string;
}

export default function DepartmentProgressRow({
  label,
  present,
  total,
  color,
}: DepartmentProgressRowProps) {
  const percentage = Math.round((present / total) * 100);

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: color,
              boxShadow: `0 0 8px ${alpha(color, 0.4)}`,
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.navy }}>
            {label}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography
            variant="caption"
            sx={{ color: COLORS.slate, fontWeight: 600, fontFamily: "monospace" }}
          >
            {present} / {total}
          </Typography>
          
          <Chip
            label={`${percentage}%`}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.65rem",
              fontWeight: 800,
              bgcolor: alpha(color, 0.1),
              color: color,
              border: `1px solid ${alpha(color, 0.2)}`,
              borderRadius: "6px",
            }}
          />
        </Stack>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: alpha(color, 0.08),
          "& .MuiLinearProgress-bar": {
            borderRadius: 4,
            background: `linear-gradient(90deg, ${alpha(color, 0.7)}, ${color})`,
          },
        }}
      />
    </Box>
  );
}