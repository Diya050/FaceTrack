import { Card, CardContent, Typography, Stack, Box, LinearProgress, alpha } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";
import type { KpiCardData } from "../../../../../types/dashboard.types";

export default function KpiCard({ label, value, total, color, icon, sub }: KpiCardData) {
  const pct = typeof value === "number" && total ? Math.round((value / total) * 100) : null;

  return (
    <Card elevation={0}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="caption" sx={{ color: COLORS.slate, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              {label}
            </Typography>
            <Typography variant="h4" sx={{ color: COLORS.navy, fontWeight: 800, mt: 0.5, mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="caption" sx={{ color: COLORS.slate, fontWeight: 500 }}>
              {sub}
            </Typography>
          </Box>
          
          
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2.5, 
            bgcolor: alpha(color, 0.1), 
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Stack>

        {pct !== null && (
          <Box sx={{ mt: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
               <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.navy }}>
                 Progress
               </Typography>
               <Typography variant="caption" sx={{ fontWeight: 700, color: color }}>
                 {pct}%
               </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(color, 0.1),
                "& .MuiLinearProgress-bar": { 
                  bgcolor: color,
                  borderRadius: 3 
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}