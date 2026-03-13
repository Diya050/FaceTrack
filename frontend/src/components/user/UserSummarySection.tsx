import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

// Assuming your chart is in the same relative path
import UserAttendanceChart from "../charts/UserAttendanceChart";
import {  type UserSummaryData } from "../../services/userDashboardService";

/* Animated Counter */
const useCounter = (target: number, duration = 800) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
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
  const [summaryData, ] = useState<UserSummaryData | null>(null);
  const [loading, ] = useState(true);

  

  // Pass the dynamic target to the counter (defaults to 0 if data is loading)
  const attendance = useCounter(summaryData?.total_attendance || 0);

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, mt: 2, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (!summaryData) return null;

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
              {summaryData.total_hours}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Avg Check In
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {summaryData.avg_check_in}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Avg Check Out
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {summaryData.avg_check_out}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserSummarySection;