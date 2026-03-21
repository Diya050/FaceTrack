// src/pages/admin/dashboard/departments/DepartmentBreakdownCard.tsx
import { Box, Typography, Stack, LinearProgress, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { DepartmentSummary, OverviewStats } from "../../../../../types/adminAnalytics.types";


interface Props {
  summary: DepartmentSummary[];  // also use the real type here
  stats: OverviewStats;           // ✅ matches what Overview.tsx passes in
}

const DEPT_COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function DepartmentBreakdownCard({ summary, stats }: Props) {
  if (!summary || summary.length === 0) {
    return <Typography color="text.secondary">No breakdown data</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
          Department Performance
        </Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", letterSpacing: 0.5 }}>
          TODAY
        </Typography>
      </Stack>

      {/* Department rows */}
      <Stack spacing={2} sx={{ flex: 1 }}>
        {summary.map((dept, i) => {
          const total = dept.total || 1;
          const percent = Math.round((dept.present / total) * 100);
          const color = DEPT_COLORS[i % DEPT_COLORS.length];

          return (
            <Box key={dept.department}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={0.75}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    {dept.department}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ fontSize: 12, color: "#6B7280", fontFamily: "monospace" }}>
                    {dept.present}/{dept.total}
                  </Typography>
                  <Chip
                    label={`${percent}%`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      bgcolor: alpha(color, 0.1),
                      color: color,
                      border: `1px solid ${alpha(color, 0.25)}`,
                      borderRadius: "6px",
                    }}
                  />
                </Stack>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: alpha(color, 0.1),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${alpha(color, 0.65)}, ${color})`,
                  },
                }}
              />
            </Box>
          );
        })}
      </Stack>

      {/* Footer Stats */}
      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: "1px solid #E5E7EB",
        }}
      >
        <Stack direction="row" spacing={4}>
          {[
  { label: "Active Staff",  value: stats?.active_staff ?? 0 },
  { label: "On Premises",   value: stats?.on_premises ?? 0 },
  { label: "Avg Rate",      value: `${stats?.avg_attendance_rate ?? 0}%` },
].map(({ label, value }) => (
            <Box key={label}>
              <Typography sx={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>
                {label}
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}