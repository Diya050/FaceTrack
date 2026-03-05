import { Box, Typography, Paper } from "@mui/material";
import UserAttendanceChart from "../charts/UserAttendanceChart";

const RecognitionAnalytics = () => {
  return (
    <Paper
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" mb={2} fontWeight="bold">
        Recognition Analytics
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          height: 320,
          mx: "auto",
        }}
      >
        <UserAttendanceChart />
      </Box>
    </Paper>
  );
};

export default RecognitionAnalytics;