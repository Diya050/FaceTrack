import { Paper, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";

import UserAttendanceChart from "../charts/UserAttendanceChart";
import { userSummary } from "../../data/userDashboard.mock";

/* Animated Counter */
const useCounter = (target: number, duration = 800) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};

const UserSummarySection = () => {
  const attendance = useCounter(userSummary.totalAttendance);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        mt: 2,
        transition: "0.2s",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Attendance Summary
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          md: "1fr 1.5fr",
        }}
        gap={3}
        alignItems="center"
      >
        {/* Chart */}
        <Box
          sx={{
            maxWidth: 340,
            mx: "auto",
          }}
        >
          <UserAttendanceChart />
        </Box>

        {/* KPI Section */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr 1fr",
            sm: "1fr 1fr",
          }}
          gap={3}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Attendance
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {attendance} days
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