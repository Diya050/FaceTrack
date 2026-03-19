import { useEffect, useState } from "react";
import { Box, Grid, Typography, LinearProgress, Stack, alpha } from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { COLORS } from "../../theme/dashboardTheme";
import { getProductivityMetrics } from "../../services/userAnalyticsService";
import type { ProductivityMetricsResponse } from "../../types/userAnalyticsBackend.types";

export default function ProductivityMetrics() {
  const [metrics, setMetrics] = useState<ProductivityMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  let mounted = true;

  // 2. Remove setLoading(true) from here to satisfy the linter
  getProductivityMetrics()
    .then((res) => {
      if (!mounted) return;
      setMetrics(res);
      setError(null);
    })
    .catch((err) => {
      console.error(err);
      if (!mounted) return;
      setError("Failed to load metrics");
    })
    .finally(() => {
      if (!mounted) return;
      setLoading(false);
    });

  return () => {
    mounted = false;
  };
}, []);

  const behaviors = metrics ? [
    { label: "Attendance Consistency", value: Math.round(metrics.attendance_consistency), color: COLORS.present },
    { label: "Stability Index", value: Math.round(metrics.stability_index), color: COLORS.navy },
  ] : [];

  const patterns = metrics ? [
    { icon: <AccessTimeIcon fontSize="small" />, label: "Peak Arrival", value: metrics.peak_arrival ?? "—" },
    { icon: <QueryStatsIcon fontSize="small" />, label: "Late Frequency", value: `${metrics.late_frequency_per_week} / week` }
  ] : [];

  if (loading) {
    return <Box>Loading metrics...</Box>;
  }

  if (error) {
    return <Box sx={{ color: 'error.main' }}>{error}</Box>;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="caption" color="text.secondary" fontWeight="900" sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>
          Behavioral Analysis
        </Typography>
        <Typography variant="h6" fontWeight="900" color="primary">
          Productivity & Stability
        </Typography>
      </Box>

      <Grid container spacing={5} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={5}>
            {behaviors.map((item) => (
              <Box key={item.label}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="body2" fontWeight="800" color="primary">
                    {item.label}
                  </Typography>
                  <Typography variant="body2" fontWeight="900" sx={{ color: item.color }}>
                    {item.value}%
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={item.value} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    bgcolor: alpha(COLORS.navy, 0.05),
                    "& .MuiLinearProgress-bar": { bgcolor: item.color }
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2.5}>
            {patterns.map((pattern, i) => (
              <Box key={i} sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                border: `1px solid ${alpha(COLORS.navy, 0.05)}`,
                bgcolor: "background.default",
                transition: "0.2s",
                "&:hover": { bgcolor: "white", borderColor: alpha(COLORS.navy, 0.1) }
              }}>
                <Box>
                  <Typography variant="caption" fontWeight="900" color="text.secondary" sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                    {pattern.label}
                  </Typography>
                  <Typography variant="h6" fontWeight="900" color="primary">
                    {pattern.value}
                  </Typography>
                </Box>
                <Box sx={{ 
                  color: COLORS.navy, 
                  display: 'flex', 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: alpha(COLORS.navy, 0.05) 
                }}>
                  {pattern.icon}
                </Box>
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
