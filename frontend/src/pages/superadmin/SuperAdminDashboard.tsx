import { Box, Stack, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import StatCard from "../../components/superadmin/StatCard";
import { getPlatformStats } from "../../services/orgService";

type PlatformStats = {
  total_organizations: number;
  active_organizations: number;
  total_users: number;
};

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<PlatformStats>({
    total_organizations: 0,
    active_organizations: 0,
    total_users: 0,
  });

  useEffect(() => {
    getPlatformStats().then(setStats);
  }, []);

  return (
    <Stack spacing={4} sx={{ p: 3 }}>
      {/* HEADER */}
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Platform Overview
        </Typography>
        <Typography color="text.secondary" fontSize={14}>
          Monitor system-wide metrics and organization activity
        </Typography>
      </Box>

      {/* STATS GRID */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Organizations"
            value={stats.total_organizations}
            subtitle="All registered organizations"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Active Organizations"
            value={stats.active_organizations}
            subtitle="Currently operational"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Users"
            value={stats.total_users}
            subtitle="Across all organizations"
          />
        </Grid>
      </Grid>
    </Stack>
  );
}