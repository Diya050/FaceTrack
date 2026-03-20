import { Card, CardContent, Stack, Box, alpha } from "@mui/material";
import LiveFeedHeader from "./LiveFeedHeader";
import LiveFeedRow from "./LiveFeedRow";
import { COLORS } from "../../../../../theme/dashboardTheme";
import type { AttendanceRecord } from "../../../../../types/adminAnalytics.types";

interface Props {
  detections: AttendanceRecord[];
}

export default function LiveFeedCard({ detections }: Props) {
  return (
    <Card elevation={0} sx={{ height: "100%", display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF' }}>
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <LiveFeedHeader />
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(COLORS.slate, 0.2), borderRadius: '10px' }
        }}>
          <Stack spacing={1.5}>
            {detections.map((record) => (
              <LiveFeedRow key={record.attendance_id} r={record} />
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}