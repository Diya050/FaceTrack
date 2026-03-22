import { useEffect, useState } from "react";
import { Box, Stack, CircularProgress, Typography } from "@mui/material";
import SectionLabel from "./Kpisummery/shared/SectionLabel";
import LiveAlertRow from "./livealerts/LiveAlertRow";
import { fetchLiveAlerts } from "../../../services/liveAlertsService";
import type { LiveAlert } from "../../../types/liveAlerts";

export default function LiveAlerts() {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveAlerts()
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Alerts error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <SectionLabel>System Events</SectionLabel>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : alerts.length > 0 ? (
        <Stack spacing={2}>
          {alerts.map((alert) => (
            <LiveAlertRow key={alert.id} alert={alert} />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ color: "text.secondary", textAlign: "center", mt: 4 }}>
          No active alerts found.
        </Typography>
      )}
    </Box>
  );
}