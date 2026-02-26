import { Box, alpha } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";

export default function LiveDot() {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        bgcolor: COLORS.present,
        animation: "livePulse 2s infinite",
        "@keyframes livePulse": {
          "0%": {
            boxShadow: `0 0 0 0 ${alpha(COLORS.present, 0.6)}`,
          },
          "70%": {
            boxShadow: `0 0 0 8px ${alpha(COLORS.present, 0)}`,
          },
          "100%": {
            boxShadow: `0 0 0 0 ${alpha(COLORS.present, 0)}`,
          },
        },
      }}
    />
  );
}