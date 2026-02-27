import { Box, Grid, Typography, LinearProgress, Stack, alpha } from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { COLORS } from "../../theme/dashboardTheme";

export default function ProductivityMetrics() {
 

  const behaviors = [
    { label: "Attendance Consistency", value: 92, color: COLORS.present },
    { label: "Stability Index", value: 85, color: COLORS.navy },
  ];

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

      {/* Added alignItems="center" to ensure the right side matches the vertical center of the bars */}
      <Grid container spacing={5} alignItems="center">
        {/* Progress Bars */}
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

        {/* Pattern Cards - Refined Design */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2.5}>
            {[
              { icon: <AccessTimeIcon fontSize="small" />, label: "Peak Arrival", value: "08:52 AM" },
              { icon: <QueryStatsIcon fontSize="small" />, label: "Late Frequency", value: "1.2 / week" }
            ].map((pattern, i) => (
              <Box key={i} sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', // Pushes icon and text to ends for cleaner look
                border: `1px solid ${alpha(COLORS.navy, 0.05)}`,
                bgcolor: "background.default", // Cleaner than the cream tint
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