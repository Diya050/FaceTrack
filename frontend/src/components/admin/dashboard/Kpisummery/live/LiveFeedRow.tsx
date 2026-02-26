import { Box, Stack, Typography, alpha } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";
import UserAvatar from "../shared/UserAvatar";
import StatusChip from "../shared/StatusChip";
import type { AttendanceRecord } from "../../../../../types/dashboard.types";

export default function LiveFeedRow({ r }: { r: AttendanceRecord }) {
  const scoreColor = r.confidence_score === null ? COLORS.slate : 
                     r.confidence_score >= 90 ? COLORS.present : 
                     r.confidence_score >= 70 ? COLORS.late : COLORS.absent;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "2.5fr 1.5fr 1.5fr 2fr 1fr 1.2fr",
        gap: 2,
        p: 1.5,
        alignItems: "center",
        borderRadius: 3,
        bgcolor: "#FFFFFF",
        border: `1px solid #F0F0F0`,
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: alpha(COLORS.cream, 0.2), 
          borderColor: alpha(COLORS.navy, 0.1),
          transform: "translateX(4px)"
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <UserAvatar name={r.full_name} size={36} />
        <Typography sx={{ fontWeight: 600, color: COLORS.navy, fontSize: '0.9rem' }}>
          {r.full_name}
        </Typography>
      </Stack>

      <Typography variant="body2" sx={{ color: COLORS.slate, fontWeight: 500 }}>{r.department}</Typography>
      <Typography variant="body2" sx={{ color: COLORS.slate }}>{r.camera_name}</Typography>
      
      <Typography variant="body2" sx={{ color: COLORS.navy, fontWeight: 600 }}>
        {r.time_in ?? "—"} <Box component="span" sx={{ color: COLORS.slate, mx: 0.5 }}>→</Box> {r.time_out ?? "Active"}
      </Typography>

      <Typography sx={{ color: scoreColor, fontWeight: 700, fontSize: '0.85rem' }}>
        {r.confidence_score ? `${r.confidence_score}%` : "—"}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <StatusChip status={r.status} />
      </Box>
    </Box>
  );
}