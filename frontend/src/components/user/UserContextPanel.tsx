import { Box, Typography, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { getDashboardUser } from "../../services/userDashboardService";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const UserContextPanel = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getDashboardUser();
        // If the name is "First Last", you might want to split it to just show the first name:
        const firstName = data.full_name.split(" ")[0];
        setUserName(firstName);
      } catch (error) {
        console.error("Failed to fetch user info", error);
        setUserName("User"); // Fallback name
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center" gap={1}>
        {getGreeting()}, 
        {loading ? <Skeleton width={120} sx={{ ml: 1 }} /> : `${userName} 👋`}
      </Typography>

      <Typography color="text.secondary" mt={1}>
        Here's your attendance summary for today
      </Typography>
    </Box>
  );
};

export default UserContextPanel;