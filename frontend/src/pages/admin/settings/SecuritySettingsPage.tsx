import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Settings - Security
import AuditLogs from "../../../components/admin/settings/security/AuditLogs";
import AccessLogs from "../../../components/admin/settings/security/AccessLogs";
import ConsentManagement from "../../../components/admin/settings/security/ConsentManagement";
import DataRetention from "../../../components/admin/settings/security/DataRetention";


const NAVBAR_HEIGHT = 64;

const SecuritySettingsPage = () => {
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
      <Box id="audit-logs">
        <AuditLogs />
      </Box>

      <Box id="access-logs">
        <AccessLogs />
      </Box>

      <Box id="consents">
        <ConsentManagement />
      </Box>

      <Box id="data-retention">
        <DataRetention />
      </Box>
    </Stack>
  );
};

export default SecuritySettingsPage;