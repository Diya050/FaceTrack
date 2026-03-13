import { Box, Typography, Grid } from "@mui/material";

import UserContextPanel from "../../components/user/UserContextPanel";
import TodayAttendanceCard from "../../components/user/TodayAttendanceCard";
import UserKPISection from "../../components/user/UserKPISection";
import QuickActionsPanel from "../../components/user/QuickActionsPanel";
import RecognitionAnalytics from "../../components/user/RecognitionAnalytics";
import UserAttendanceCard from "../../components/user/UserAttendanceCard";


import { userDailyAttendance } from "../../data/userDashboard.mock";

const UserDashboardPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 4,
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
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Attendance History
        </Typography>

        <Grid container spacing={3}>
          {userDailyAttendance.map((day, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <UserAttendanceCard data={day} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default UserDashboardPage;

