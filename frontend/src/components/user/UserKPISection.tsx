import { Grid, Paper, Typography, Box, LinearProgress } from "@mui/material";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PercentIcon from "@mui/icons-material/Percent";
import ScheduleIcon from "@mui/icons-material/Schedule";

const metrics = [
  {
    title: "Present Days",
    value: 18,
    subtitle: "Current month",
    progress: 80,
    icon: <EventAvailableIcon />,
    color: "#4CAF50",
  },
  {
    title: "Absent Days",
    value: 2,
    subtitle: "This month",
    progress: 10,
    icon: <EventBusyIcon />,
    color: "#F44336",
  },
  {
    title: "Late Marks",
    value: 3,
    subtitle: "After grace",
    progress: 15,
    icon: <AccessTimeIcon />,
    color: "#FB8C00",
  },
  {
    title: "Leave Taken",
    value: 1,
    subtitle: "Approved leave",
    progress: 5,
    icon: <BeachAccessIcon />,
    color: "#2196F3",
  },
  {
    title: "Attendance %",
    value: "90%",
    subtitle: "Monthly rate",
    progress: 90,
    icon: <PercentIcon />,
    color: "#7E57C2",
  },
  {
    title: "Avg Work Hours",
    value: "7.8h",
    subtitle: "Per day",
    progress: 78,
    icon: <ScheduleIcon />,
    color: "#009688",
  },
];

const UserKPISection = () => {
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
                <span>{metric.progress}%</span>
              </Typography>

              <LinearProgress
                variant="determinate"
                value={metric.progress}
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