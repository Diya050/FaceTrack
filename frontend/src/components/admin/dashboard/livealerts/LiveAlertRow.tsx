import { Box, Typography, Stack, alpha, IconButton, Tooltip } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { COLORS } from "../../../../theme/dashboardTheme";
import AlertChip from "../shared/AlertChip";
import type { LiveAlert } from "../../../../data/liveAlerts.mock";

export default function LiveAlertRow({ 
  alert, 
  onDelete 
}: { 
  alert: LiveAlert;
  onDelete?: () => void;
}) {
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
        <Box sx={{ flex: 1 }}>
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

        {onDelete && (
          <Tooltip title="Delete alert">
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{ 
                ml: 1, 
                color: "error.main",
                "&:hover": {
                  bgcolor: alpha("#ff0000", 0.1),
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}