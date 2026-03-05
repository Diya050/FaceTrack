import { Box, Typography } from "@mui/material";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const UserContextPanel = () => {
  return (
    <Box
      sx={{
        mb: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        {getGreeting()}, Pranjal 👋
      </Typography>

      <Typography color="text.secondary" mt={1}>
        Here's your attendance summary for today
      </Typography>
    </Box>
  );
};

export default UserContextPanel;