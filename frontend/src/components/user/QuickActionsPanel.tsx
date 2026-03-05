import { Box, Button } from "@mui/material";

const QuickActionsPanel = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        mb: 4
      }}
    >
      <Button variant="contained">Retry Recognition</Button>
      <Button variant="contained">Apply Leave</Button>
      <Button variant="outlined">Attendance Dispute</Button>
      <Button variant="outlined">Download Report</Button>
      <Button variant="outlined">Face Re-Registration</Button>
    </Box>
  );
};

export default QuickActionsPanel;