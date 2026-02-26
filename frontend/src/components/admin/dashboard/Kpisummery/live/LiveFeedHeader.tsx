import { Stack, Box, Typography, alpha } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";
import SectionLabel from "../shared/SectionLabel";
import LiveDot from "./LiveDot";

export default function LiveFeedHeader() {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
      <Box>
        <SectionLabel>Face Recognition</SectionLabel>
        <Typography variant="h6" sx={{ color: COLORS.navy, fontWeight: 800 }}>
          Recent Detections
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1.2}
        alignItems="center"
        sx={{
          bgcolor: alpha(COLORS.present, 0.05),
          border: `1px solid ${alpha(COLORS.present, 0.2)}`,
          borderRadius: '20px',
          px: 2,
          py: 0.5,
        }}
      >
        <LiveDot />
        <Typography
          variant="caption"
          sx={{
            color: COLORS.present,
            fontFamily: "monospace",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: 1
          }}
        >
          LIVE FEED
        </Typography>
      </Stack>
    </Stack>
  );
}