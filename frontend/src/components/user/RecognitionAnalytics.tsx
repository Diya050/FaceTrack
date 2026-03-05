import { Box, Typography, Paper } from "@mui/material";
import UserAttendanceChart from "../charts/UserAttendanceChart";

const RecognitionAnalytics = () => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Recognition Analytics
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 380,
          height: 300,
          mx: "auto",
        }}
      >
        <UserAttendanceChart />
      </Box>
    </Paper>
  );
};

export default RecognitionAnalytics;