import { Box, Typography, Grid } from "@mui/material";

import UserContextPanel from "../../components/user/UserContextPanel";
import TodayAttendanceCard from "../../components/user/TodayAttendanceCard";
import UserKPISection from "../../components/user/UserKPISection";
import QuickActionsPanel from "../../components/user/QuickActionsPanel";
import RecognitionAnalytics from "../../components/user/RecognitionAnalytics";
import UserAttendanceCard from "../../components/user/UserAttendanceCard";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material"; 
import { getAttendanceHistory,type AttendanceHistoryData } from "../../services/userDashboardService";


const UserDashboardPage = () => {

  
  
const [historyData, setHistoryData] = useState<AttendanceHistoryData[]>([]);
const [historyLoading, setHistoryLoading] = useState(true);
const [historyError, setHistoryError] = useState<string | null>(null);


useEffect(() => {
  const fetchHistory = async () => {
    try {
      // Fetch the last 7 records (you can change this number)
      setHistoryLoading(true);
      const data = await getAttendanceHistory(7); 
      setHistoryData(data);
    } catch (error) {
      console.error("Failed to fetch attendance history:", error);
      setHistoryError("Failed to load attendance history");
    } finally {
      setHistoryLoading(false);
    }
  };
  fetchHistory();
}, []);

return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 4,
        mt:8,
      }}
    >
     
      {/* USER CONTEXT PANEL */}
      <UserContextPanel />

      {/* TODAY ATTENDANCE */}
      <TodayAttendanceCard />

      {/* KPI SECTION */}
      <UserKPISection />

      {/* QUICK ACTIONS + ANALYTICS */}
      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 4 }}>
          <QuickActionsPanel />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <RecognitionAnalytics />
        </Grid>

      </Grid>


    {/* ATTENDANCE HISTORY */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Attendance History
        </Typography>

        {historyLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : historyData.length === 0 ? (
          <Typography color="text.secondary">
            No recent attendance records found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {historyData.map((day, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <UserAttendanceCard data={day} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      </Box>
  );
};

export default UserDashboardPage;

