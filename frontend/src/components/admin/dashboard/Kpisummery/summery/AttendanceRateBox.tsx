import { Box, Typography, LinearProgress, alpha } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";


export default function AttendanceRateBox({ rate }: { rate: number }) {

  return (
    <Box sx={{ 
      textAlign: "center", p: 3, borderRadius: 4, mb: 2.5,
      background: `linear-gradient(180deg, #FFFFFF 0%, ${alpha(COLORS.present, 0.05)} 100%)`,
      border: `1px solid ${alpha(COLORS.present, 0.15)}`,
      boxShadow: `0 4px 12px ${alpha(COLORS.present, 0.05)}`
    }}>
      <Typography variant="h2" sx={{ color: COLORS.present, fontWeight: 900, my: 1 }}>
         {rate}%
       </Typography>
       <LinearProgress variant="determinate" value={rate} sx={{
          height: 8, borderRadius: 4, bgcolor: alpha(COLORS.present, 0.1),
          "& .MuiLinearProgress-bar": { bgcolor: COLORS.present }
      }} />
    </Box>
  );
}