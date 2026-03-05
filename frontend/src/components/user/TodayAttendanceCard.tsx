import { Box, Typography, Grid, Chip, LinearProgress, Avatar } from "@mui/material";

const TodayAttendanceCard = () => {
  const confidence = 97.4;

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
            src="/face-snapshot.png"
            variant="rounded"
            sx={{ width: "100%", height: 160 }}
          />
        </Grid>

        {/* Main Fields */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Status</Typography>
              <Chip label="Present" color="success" />
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Check-In</Typography>
              <Typography fontWeight="bold">09:12 AM</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Check-Out</Typography>
              <Typography fontWeight="bold">--</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Work Duration</Typography>
              <Typography fontWeight="bold">6h 12m</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Camera</Typography>
              <Typography>Entrance Gate Cam-2</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Location</Typography>
              <Typography>Main Office</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Recognition Method</Typography>
              <Typography>Live Detection</Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography>Frame ID</Typography>
              <Typography>#FRM-28941</Typography>
            </Grid>

          </Grid>
        </Grid>

        {/* AI Confidence */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" mb={1}>
            Recognition Confidence ({confidence}%)
          </Typography>

          <LinearProgress
            variant="determinate"
            value={confidence}
            sx={{ height: 8, borderRadius: 5 }}
          />
        </Grid>

        {/* Advanced AI Fields */}
        <Grid container spacing={2} mt={1}>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption">AI Similarity Score</Typography>
            <Typography>0.974</Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption">Re-verification</Typography>
            <Chip label="Verified" color="success" size="small" />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption">Retry Attempts</Typography>
            <Typography>1</Typography>
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