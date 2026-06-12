import { Box} from "@mui/material";

import UserContextPanel from "../../components/user/UserContextPanel";
import TodayAttendanceCard from "../../components/user/TodayAttendanceCard";
import UserKPISection from "../../components/user/UserKPISection";
// import RecognitionAnalytics from "../../components/user/RecognitionAnalytics";

const UserDashboardPage = () => {

  

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
      {/* <Grid container spacing={3}>
  <Grid size={{ xs: 12 }}>
    <RecognitionAnalytics />
  </Grid>
</Grid> */}

      </Box>
  );
};

export default UserDashboardPage;

