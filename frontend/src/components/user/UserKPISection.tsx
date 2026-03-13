import { useState, useEffect } from "react";
import { Grid, Paper, Typography, Box, LinearProgress, CircularProgress } from "@mui/material";


// Icons
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PercentIcon from "@mui/icons-material/Percent";
import ScheduleIcon from "@mui/icons-material/Schedule";

// Import our new service
import { getMyKPIs,type KPIData } from "../../services/userDashboardService";

const UserKPISection = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const data = await getMyKPIs();
      setKpiData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error fetching KPIs:", err.message);
      } else {
        console.error("Unknown error fetching KPIs:", err);
      }
      setError("Failed to load metrics.");
    } finally {
      setLoading(false);
    }
  };

  fetchKPIs();
}, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={160}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !kpiData) {
    return <Typography color="error">{error}</Typography>;
  }

  // Map the dynamic API data to your UI metrics format
  const metrics = [
    {
      title: "Present Days",
      value: kpiData.present_days,
      subtitle: "Current month",
      progress: (kpiData.present_days / 30) * 100, // Assuming 30 days scale
      icon: <EventAvailableIcon />,
      color: "#4CAF50",
    },
    {
      title: "Absent Days",
      value: kpiData.absent_days,
      subtitle: "This month",
      progress: (kpiData.absent_days / 30) * 100,
      icon: <EventBusyIcon />,
      color: "#F44336",
    },
    {
      title: "Late Marks",
      value: kpiData.late_marks,
      subtitle: "After grace",
      progress: (kpiData.late_marks / 10) * 100, // Example 10 limit scale
      icon: <AccessTimeIcon />,
      color: "#FB8C00",
    },
    {
      title: "Leave Taken",
      value: kpiData.leave_taken,
      subtitle: "Approved leave",
      progress: (kpiData.leave_taken / 10) * 100,
      icon: <BeachAccessIcon />,
      color: "#2196F3",
    },
    {
      title: "Attendance %",
      value: `${kpiData.attendance_percentage}%`,
      subtitle: "Monthly rate",
      progress: kpiData.attendance_percentage,
      icon: <PercentIcon />,
      color: "#7E57C2",
    },
    {
      title: "Avg Work Hours",
      value: `${kpiData.avg_work_hours}h`,
      subtitle: "Per day",
      progress: (kpiData.avg_work_hours / 9) * 100, // Assuming 9 hour workday scale
      icon: <ScheduleIcon />,
      color: "#009688",
    },
  ];

  return (
    <Grid container spacing={3} mb={4}>
      {metrics.map((metric) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={metric.title}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              height: 160,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "0.25s",
              border: "1px solid #ECEFF1",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: 6,
              },
            }}
          >
            {/* Top Section */}
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    letterSpacing: 1,
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                >
                  {metric.title.toUpperCase()}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 36,
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  {metric.value}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {metric.subtitle}
                </Typography>
              </Box>

              {/* Icon block */}
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${metric.color}15`,
                  color: metric.color,
                }}
              >
                {metric.icon}
              </Box>
            </Box>

            {/* Progress */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 500,
                }}
              >
                Progress
                <span>{Math.round(metric.progress)}%</span>
              </Typography>

              <LinearProgress
                variant="determinate"
                value={Math.min(100, metric.progress)}
                sx={{
                  mt: 0.7,
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "#ECEFF1",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: metric.color,
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserKPISection;