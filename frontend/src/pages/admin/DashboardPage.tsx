import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Dashboard
import Overview from "../../components/admin/dashboard/Overview";
import KPISummary from "../../components/admin/dashboard/KPISummary";
import SystemHealth from "../../components/admin/dashboard/SystemHealth";
import LiveAlerts from "../../components/admin/dashboard/LiveAlerts";


const NAVBAR_HEIGHT = 64;

const DashboardPage = () => {
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
      <Box id="overview">
        <Overview />
      </Box>

      <Box id="kpis">
        <KPISummary />
      </Box>

      <Box id="system-health">
        <SystemHealth />
      </Box>

      <Box id="live-alerts">
        <LiveAlerts />
      </Box>
    </Stack>
  );
};

export default DashboardPage;