import { Grid, Box, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import KpiCard from "./kpi/KpiCard";
import TodaySummaryCard from "./summery/TodaySummaryCard";
import LiveFeedCard from "./live/LiveFeedCard";
import { COLORS } from "../../../../theme/dashboardTheme";
import { CheckCircleOutline, PersonOff, AccessTime, ExitToApp } from "@mui/icons-material";
import { getKpiSummary } from "../../../../services/adminAnalyticsService";
import type { KpiSummaryResponse } from "../../../../types/adminAnalytics.types";

export default function KpiSummarySection() {
  const [data, setData] = useState<KpiSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKpiSummary()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("KPI Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
      <CircularProgress />
    </Box>
  );

  if (!data) return null;

  const kpiCards = [
    {
      label: "Present Today",
      value: data.stats.present_today,
      total: data.stats.total_registered,
      color: COLORS.present,
      icon: <CheckCircleOutline />,
      sub: "of registered",
    },
    {
      label: "Absent Today",
      value: data.stats.absent_today,
      total: data.stats.total_registered,
      color: COLORS.absent,
      icon: <PersonOff />,
      sub: "No detection yet",
    },
    {
      label: "Late Arrivals",
      value: data.stats.late_today,
      total: data.stats.total_registered,
      color: COLORS.late,
      icon: <AccessTime />,
      sub: "After grace period",
    },
    {
      label: "Early Leave",
      value: data.stats.early_leave_today,
      total: data.stats.total_registered,
      color: COLORS.early,
      icon: <ExitToApp />,
      sub: "Left before 5 PM",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        {kpiCards.map((k) => (
          <Grid key={k.label}  size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard {...k} />
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Passing live stats to the summary card */}
          <TodaySummaryCard stats={data.stats} />
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Passing the live detections to the feed card */}
          <LiveFeedCard detections={data.recent_detections} />
        </Grid>
      </Grid>
    </Box>
  );
}