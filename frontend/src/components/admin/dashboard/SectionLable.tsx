import { Typography, Box } from "@mui/material";
import { COLORS } from "../../../theme/dashboardTheme";

export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <Box sx={{ width: 4, height: 16, bgcolor: COLORS.navy, borderRadius: 1 }} />
      
      <Typography
        variant="caption"
        sx={{
          color: "#6F7B87", 
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}