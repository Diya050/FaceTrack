import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  LinearProgress,
  Divider,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SecurityIcon from "@mui/icons-material/Security";
import FlashOnIcon from "@mui/icons-material/FlashOn";

import type { DeptCameraStatsResponse } from "../../types/adminAnalytics.types";
import { fetchDeptCameraStats } from "../../services/adminAnalyticsService";

const DeptCameraWidget = () => {
  const [stats, setStats] = useState<DeptCameraStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDeptCameraStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load camera stats:", err);
      setError("Unable to load live camera analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <Card sx={cardStyle}>
        <CardContent sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card sx={cardStyle}>
        <CardContent sx={{ py: 6, textAlign: "center" }}>
          <Typography color="error">{error || "No analytics data found."}</Typography>
        </CardContent>
      </Card>
    );
  }

  const displayPercentage = Math.round(stats.avg_confidence_score * 100);

  return (
    <Card sx={cardStyle}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box mb={2}>
          <Typography variant="h5" fontWeight={700} color="#1F2A44">
            Departmental Node Health
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Live edge tracking behaviors for your department today
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          {/* Cameras */}
          <Grid item xs={12} md={4}>
            <StatBlock
              icon={<CameraAltIcon />}
              label="Recording Cameras Today"
              value={stats.active_cameras_count}
              bg="linear-gradient(135deg, #3B82F6, #6366F1)"
            />
          </Grid>

          {/* Confidence */}
          <Grid item xs={12} md={4}>
            <StatBlock
              icon={<SecurityIcon />}
              label="Avg Precision Rating"
              value={`${displayPercentage}%`}
              bg="linear-gradient(135deg, #10B981, #34D399)"
            >
              <LinearProgress
                variant="determinate"
                value={displayPercentage}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "rgba(0,0,0,0.05)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                  },
                }}
              />
            </StatBlock>
          </Grid>

          {/* Scans */}
          <Grid item xs={12} md={4}>
            <StatBlock
              icon={<FlashOnIcon />}
              label="Total Faces Detected"
              value={stats.total_department_scans_today}
              bg="linear-gradient(135deg, #F59E0B, #FBBF24)"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

/* ---------- Reusable Stat Block ---------- */

const StatBlock = ({
  icon,
  label,
  value,
  bg,
  children,
}: any) => (
  <Box
    sx={{
      p: 3,
      borderRadius: 4,
      background: "#ffffff",
      boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
      },
    }}
  >
    <Box display="flex" alignItems="center" gap={2}>
      {/* Icon Circle */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          color: "#fff",
        }}
      >
        {icon}
      </Box>

      <Box flex={1}>
        <Typography variant="h4" fontWeight={800} color="#111827">
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>

    {children}
  </Box>
);

/* ---------- Card Style ---------- */

const cardStyle = {
  borderRadius: 4,
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
};

export default DeptCameraWidget;