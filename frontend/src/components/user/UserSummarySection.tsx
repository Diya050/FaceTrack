import { Paper, Typography, Box } from "@mui/material";

import UserAttendanceChart from "../charts/UserAttendanceChart";
import { userSummary } from "../../data/userDashboard.mock";

const UserSummarySection = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Attendance Summary
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          md: "1fr 2fr",
        }}
        gap={3}
      >
        {/* Chart */}
        <Box>
          <UserAttendanceChart />
        </Box>

        {/* KPI Section */}
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gap={2}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Attendance
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {userSummary.totalAttendance} days
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Hours
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {userSummary.totalHours}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Avg Check In
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {userSummary.avgCheckIn}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Avg Check Out
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {userSummary.avgCheckOut}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserSummarySection;