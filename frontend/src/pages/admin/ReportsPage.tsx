import { Box, Typography } from "@mui/material";
import WorkingHoursChart from "../../components/admin/WorkingHoursReport";
import RecentDetectionsTable from "../../components/admin/RecentDetectionsTableReports";
import ExportActionButtons from "../../components/admin/ExportActionButtonReport";

const ReportsPage = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        mt: 8,
        px: { xs: 2, md: 4 },
        py: 4,
        width: "100%",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            letterSpacing: 0.3,
            mb: 0.5,
          }}
        >
          Operational Reports
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Visualize tracked work hours and real-time behavioral metrics
        </Typography>
      </Box>

      {/* 🔥 FULL WIDTH STACKED LAYOUT */}

      {/* 1️⃣ Recent Detections (FULL WIDTH, PRIMARY) */}
      <Box sx={{ width: "100%", mb: 4 }}>
        <RecentDetectionsTable />
      </Box>

      {/* 2️⃣ Working Hours Chart (FULL WIDTH) */}
      <Box sx={{ width: "100%", mb: 4 }}>
        <WorkingHoursChart />
      </Box>

      {/* 3️⃣ Export Buttons (COMPACT, FULL WIDTH ALIGNMENT) */}
      <Box sx={{ width: "100%" }}>
        <ExportActionButtons />
      </Box>
    </Box>
  );
};

export default ReportsPage;