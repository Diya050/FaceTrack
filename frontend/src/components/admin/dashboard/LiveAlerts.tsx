import { Box, Stack } from "@mui/material";
import SectionLabel from "./Kpisummery/shared/SectionLabel";
import LiveAlertRow from "./livealerts/LiveAlertRow";
import { mockLiveAlerts } from "../../../data/liveAlerts.mock";

export default function LiveAlerts() {
  return (
    <Box sx={{ p: 4, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <SectionLabel>System Events</SectionLabel>

      <Stack spacing={2}>
        {mockLiveAlerts.map((alert) => (
          <LiveAlertRow key={alert.id} alert={alert} />
        ))}
      </Stack>
    </Box>
  );
}