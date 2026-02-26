import { Card, CardContent, Stack, Box, alpha } from "@mui/material";
import LiveFeedHeader from "./LiveFeedHeader";
import LiveFeedRow from "./LiveFeedRow";
import { COLORS } from "../../../../../theme/dashboardTheme";
import { mockRecentAttendance } from "../../../../../data/dashboard.mock";

export default function LiveFeedCard() {
  return (
    <Card 
      elevation={0} 
      sx={{ 
        height: "100%", 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#FFFFFF' 
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <LiveFeedHeader />

        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(COLORS.slate, 0.2),
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: COLORS.slate,
            }
          }}
        >
          <Stack spacing={1.5}>
            {mockRecentAttendance.map((record) => (
              <LiveFeedRow
                key={record.attendance_id}
                r={record}
              />
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}