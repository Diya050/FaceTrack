import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Settings - System
import AIModels from "../../../components/admin/settings/system/AIModels";
import RecognitionThreshold from "../../../components/admin/settings/system/RecognitionThreshold";
import NotificationConfig from "../../../components/admin/settings/system/NotificationConfig";
import StorageBackup from "../../../components/admin/settings/system/StorageBackup";
import SystemStatus from "../../../components/admin/settings/system/SystemStatus";



const NAVBAR_HEIGHT = 64;

const SystemSettingsPage = () => {
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
    <Stack spacing={6} sx={{ pt: 8, px: 4, pb: 6, mt:5 }}>
      <Box id="ai-models">
        <AIModels />
      </Box>
      
      <Box id="threshold">
        <RecognitionThreshold />
      </Box>

      <Box id="notifications">
        <NotificationConfig />
      </Box>

      <Box id="storage">
        <StorageBackup />
      </Box>

      <Box id="system-status">
        <SystemStatus />
      </Box>
    </Stack>
  );
};

export default SystemSettingsPage;