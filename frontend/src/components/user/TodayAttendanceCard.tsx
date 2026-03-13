import { useEffect, useState } from "react";
import { Box, Typography, Grid, Chip, LinearProgress, Avatar, CircularProgress } from "@mui/material";
import { getTodayAttendance,type TodayAttendanceData } from "../../services/userDashboardService";

const TodayAttendanceCard = () => {
  const [data, setData] = useState<TodayAttendanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTodayAttendance();
        setData(result);
      } catch (error) {
        console.error("Error fetching today's attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, mb: 4, borderRadius: 3, background: "#ffffff", boxShadow: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return null;

  // Format time (removes seconds if your API returns HH:MM:SS)
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "--";
    return timeStr.slice(0, 5); // Just grabs "09:12" from "09:12:00"
  };

  return (
    <Box
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        background: "#ffffff",
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Today's Attendance
      </Typography>

      <Grid container spacing={3} alignItems="center">
        {/* Snapshot */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Avatar
            src="/face-snapshot.png" // You can later make this dynamic if you store image URLs!
            variant="rounded"
            sx={{ width: "100%", height: 160 }}
          />
        </Grid>

        {/* Main Fields */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Status</Typography>
              <Chip 
                label={data.status} 
                color={data.status.includes("Absent") ? "error" : "success"} 
              />
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Check-In</Typography>
              <Typography fontWeight="bold">{formatTime(data.check_in)}</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Check-Out</Typography>
              <Typography fontWeight="bold">{formatTime(data.check_out)}</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Work Duration</Typography>
              <Typography fontWeight="bold">{data.work_duration}</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Camera</Typography>
              <Typography>{data.camera_name}</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Location</Typography>
              <Typography>{data.location}</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Recognition Method</Typography>
              <Typography>{data.recognition_method}</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Frame ID</Typography>
              <Typography>{data.frame_id}</Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* AI Confidence */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" mb={1}>
            Recognition Confidence ({data.confidence_score}%)
          </Typography>

          <LinearProgress
            variant="determinate"
            value={data.confidence_score}
            sx={{ height: 8, borderRadius: 5 }}
          />
        </Grid>

        {/* Advanced AI Fields */}
        <Grid container spacing={2} mt={1}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption">AI Similarity Score</Typography>
            <Typography>{data.ai_similarity_score}</Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption">Re-verification</Typography>
            <Chip label={data.confidence_score > 85 ? "Verified" : "Pending"} color={data.confidence_score > 85 ? "success" : "warning"} size="small" />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption">Retry Attempts</Typography>
            <Typography>{data.confidence_score === 0 ? "0" : "1"}</Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption">Threshold</Typography>
            <Typography>0.90</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TodayAttendanceCard;