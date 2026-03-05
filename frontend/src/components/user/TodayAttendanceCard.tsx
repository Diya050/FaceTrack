import { Box, Typography, Grid, Chip } from "@mui/material";

const TodayAttendanceCard = () => {
  return (
    <Box
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        background: "#ffffff",
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Today's Attendance
      </Typography>

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
          <Typography>Confidence</Typography>
          <Typography>97.4%</Typography>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Typography>Recognition Method</Typography>
          <Typography>Live Detection</Typography>
        </Grid>

      </Grid>
    </Box>
  );
};

export default TodayAttendanceCard;