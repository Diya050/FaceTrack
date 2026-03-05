import { Box, Typography, Stack, alpha } from "@mui/material";
import { COLORS } from "../../../../theme/dashboardTheme";
import AlertChip from "../shared/AlertChip";
import type { LiveAlert } from "../../../../data/liveAlerts.mock";

export default function LiveAlertRow({ alert }: { alert: LiveAlert }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${alpha(COLORS.navy, 0.08)}`,
        bgcolor: "#FFFFFF",
        transition: "0.2s",
        "&:hover": {
          bgcolor: alpha(COLORS.cream, 0.25),
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography sx={{ fontWeight: 700, color: COLORS.navy }}>
            {alert.source}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.slate }}>
            {alert.message}
          </Typography>
        </Box>

        <Stack spacing={0.5} alignItems="flex-end">
          <AlertChip severity={alert.severity} />
          <Typography variant="caption" sx={{ color: COLORS.slate }}>
            {new Date(alert.timestamp).toLocaleString()}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}