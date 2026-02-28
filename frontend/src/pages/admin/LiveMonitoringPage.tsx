import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Live Monitoring
import CameraGrid from "../../components/admin/monitoring/CameraGrid";
import CameraManagement from "../../components/admin/monitoring/CameraManagement";
import RecognitionEvents from "../../components/admin/monitoring/RecognitionEvents";
import EventHistory from "../../components/admin/monitoring/EventHistory";


const NAVBAR_HEIGHT = 64;

const LiveMonitoringPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");
    const el = document.getElementById(id);

    if (!el) return;

    const y =
      el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 16;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }, [hash]);

  return (
    <Stack spacing={6}>
      <Box id="cameras">
        <CameraGrid />
      </Box>

      <Box id="manage">
        <CameraManagement />
      </Box>

      <Box id="events">
        <RecognitionEvents />
      </Box>

      <Box id="history">
        <EventHistory />
      </Box>
    </Stack>
  );
};

export default LiveMonitoringPage;