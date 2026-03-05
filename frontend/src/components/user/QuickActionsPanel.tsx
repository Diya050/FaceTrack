import { Box, Button, Paper, Typography } from "@mui/material";

const actions = [
  "Retry Recognition",
  "Apply Leave",
  "Attendance Dispute",
  "Download Report",
  "Face Re-Registration",
];

const QuickActionsPanel = () => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Quick Actions
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="1fr"
        gap={2}
      >
        {actions.map((action) => (
          <Button
            key={action}
            variant="outlined"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
            }}
          >
            {action}
          </Button>
        ))}
      </Box>
    </Paper>
  );
};

export default QuickActionsPanel;