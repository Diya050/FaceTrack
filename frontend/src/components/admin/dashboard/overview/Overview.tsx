// src/pages/admin/dashboard/Overview.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";


import { getAdminOverview } from "../../../../services/adminAnalyticsService";
import type { AdminOverviewResponse } from "../../../../types/adminAnalytics.types";

import WeeklyAttendanceBar from "./charts/WeeklyAttendanceBar";
import MonthlyTrendLine from "./charts/MonthlyTrendLine";
import DepartmentDonut from "./charts/DepartmentDonut";
import DepartmentBreakdownCard from "./departments/DepartmentBreakdownCard";

// ─── Shared card style ────────────────────────────────────────────────────────
const chartCard = {
  borderRadius: 3,
  border: "1px solid #E5E7EB",
  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  height: "100%",
};

// ─── Main component ───────────────────────────────────────────────────────────
const Overview: React.FC = () => {
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminOverview()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return null;



  return (
    <Box sx={{ mt: 8, px: { xs: 2, md: 4 }, py: 3, bgcolor: "#F5F7FB", minHeight: "100vh" }}>
      {/* ── Section label ── */}
      <Typography
        sx={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1, mb: 2 }}
      >
        OVERVIEW
      </Typography>

      <Grid container spacing={3}>

        {/* ── Weekly Bar Chart (wider) ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={chartCard}>
            <CardContent sx={{ height: 340, pb: "16px !important" }}>
              <WeeklyAttendanceBar report={data.weekly_report} />
            </CardContent>
          </Card>
        </Grid>

        {/* ── Monthly Trend Line ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={chartCard}>
            <CardContent sx={{ height: 340, pb: "16px !important" }}>
              <MonthlyTrendLine trend={data.monthly_trend} />
            </CardContent>
          </Card>
        </Grid>

        {/* ── Donut ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={chartCard}>
            <CardContent sx={{ height: 360, pb: "16px !important" }}>
              <DepartmentDonut summary={data.department_summary} />
            </CardContent>
          </Card>
        </Grid>

        {/* ── Department Breakdown ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={chartCard}>
            <CardContent sx={{ height: 360, overflowY: "auto", pb: "16px !important" }}>
              <DepartmentBreakdownCard
                summary={data.department_summary}
                stats={data.stats}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;