import { Grid, Box} from "@mui/material";
import KpiCard from "./kpi/KpiCard";
import TodaySummaryCard from "../Kpisummery/summery/TodaySummaryCard";
import LiveFeedCard from "./live/LiveFeedCard";
import { mockOverviewStats } from "../../../../data/dashboard.mock";
import { COLORS } from "../../../../theme/dashboardTheme";
import { CheckCircleOutline, PersonOff, AccessTime, ExitToApp } from "@mui/icons-material";

export default function KpiSummarySection() {
  const kpiCards = [
    {
    label: "Present Today",
    value: mockOverviewStats.present_today,
    total: mockOverviewStats.total_registered,
    color: COLORS.present, 
    icon: <CheckCircleOutline />,
    sub: "of registered",
  },
    {
      label: "Absent Today",
      value: mockOverviewStats.absent_today,
      total: mockOverviewStats.total_registered,
      color: COLORS.absent,
      icon: <PersonOff />,
      sub: "No detection yet",
    },
    {
      label: "Late Arrivals",
      value: mockOverviewStats.late_today,
      total: mockOverviewStats.total_registered,
      color: COLORS.late,
      icon: <AccessTime />,
      sub: "After grace period",
    },
    {
      label: "Early Leave",
      value: mockOverviewStats.early_leave_today,
      total: mockOverviewStats.total_registered,
      color: COLORS.early,
      icon: <ExitToApp />,
      sub: "Left before 5 PM",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        {kpiCards.map((k) => (
          <Grid key={k.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard {...k} />
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <TodaySummaryCard />
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <LiveFeedCard />
        </Grid>
      </Grid>
    </Box>
  );
}