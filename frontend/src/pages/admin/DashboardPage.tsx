import { Stack, Container, Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Dashboard
import RecognitionAnalytics from "../../components/admin/dashboard/RecognitionAnalytics";
import AbsentAnalytics from "../../components/admin/dashboard/AbsentAnalytics";
import HalfDayAnalytics from "../../components/admin/dashboard/HalfDayAnalytics";
import LateAnalytics from "../../components/admin/dashboard/LateAnalytics";
import DepartmentAttendance from "../../components/admin/dashboard/DepartmentAttendance";
import AttendanceTrend from "../../components/admin/dashboard/AttendanceTrend";
import KPISummary from "../../components/admin/dashboard/KpiSummery";
import SystemHealth from "../../components/admin/dashboard/SystemHealth";
import LiveAlerts from "../../components/admin/dashboard/LiveAlerts";

// ⬇️ Import your newly built Departmental Camera widget
import DeptCameraWidget from "../../components/admin/DepartmentCam"; 

import { useAuth } from "../../context/AuthContext";

const NAVBAR_HEIGHT = 64;
const PAGE_GAP = 16;

const DashboardPage = () => {
  const { hash } = useLocation();
  const { role } = useAuth();

  const isHRAdmin = role === "HR_ADMIN";

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const y =
      el.getBoundingClientRect().top +
      window.scrollY -
      NAVBAR_HEIGHT -
      PAGE_GAP;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }, [hash]);

  return (
    
    <Container
      maxWidth={false} // Forces full screen width edge-to-edge
      sx={{
        pt: `${NAVBAR_HEIGHT + PAGE_GAP}px`,
        pb: 6,
        px: { xs: 2, sm: 3, md: 4 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={4} sx={{ width: "100%" }}>

  {/* 🔹 NEW: Section Heading */}
  <Box>
    <Typography
      variant="h4"
      fontWeight={700}
      sx={{
        letterSpacing: 0.5,
      }}
    >
      Today’s Insights
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mt: 0.5 }}
    >
      Real-time overview of attendance, performance, and system activity
    </Typography>
  </Box>

  {/* ROW 1: Massive KPI Cards across the screen */}
  <KPISummary />

        {/* ROW 2: Primary Trend Graph */}
        <AttendanceTrend />

        {/* ROW 3: Three Equal Sized Chart Cards (Forces expansion) */}
        <Box
        id="analytics" 
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)", // 3 even columns
            },
            gap: 3,
            width: "100%",
          }}
        >
          <DepartmentAttendance />
          <LateAnalytics />
          <HalfDayAnalytics />
        </Box>

        {/* 🛠️ ROW 4: Conditionals applied here! */}
        <Box

  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "repeat(2, 1fr)",
    },
    gap: 3,
    width: "100%",
  }}
>
          {/* Everyone sees Absent Analytics */}
          <AbsentAnalytics />

          {/* Toggle Engine based on Auth role */}
          {isHRAdmin ? <RecognitionAnalytics /> : <DeptCameraWidget />}
        </Box>

             <Box>
  <Box >
    <Stack spacing={4}>
      <Box id = "system-health" ><SystemHealth /></Box>
      <Box id = "live-alerts" ><LiveAlerts /></Box>
    </Stack>
  </Box>
</Box>
   
        

        
      </Stack>


     
    </Container>

  
  );
};

export default DashboardPage;