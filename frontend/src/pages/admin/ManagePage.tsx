import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Manage Department
import Departments from "../../components/admin/manage/Departments";
import UserProfiles from "../../components/admin/manage/UserProfiles";
import BulkUpload from "../../components/admin/manage/BulkUpload";
import Roles from "../../components/admin/manage/Roles";
import AttendanceRules from "../../components/admin/manage/AttendanceRules";
import RegistrationRequests from "../../components/admin/manage/RegistrationRequests";


const NAVBAR_HEIGHT = 64;

const ManagePage = () => {
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
    <Box sx={{ bgcolor: "#F8F9FA" }}>
      <Stack spacing={0}>
        <Box id="departments">
          <Departments />
        </Box>

        <Box id="users">
          <UserProfiles />
        </Box>

        <Box id="bulk-upload">
          <BulkUpload />
        </Box>

        <Box id="requests">
          <RegistrationRequests />
        </Box>

        <Box id="roles">
          <Roles />
        </Box>

        <Box id="rules">
          <AttendanceRules />
        </Box>
      </Stack>
    </Box>
  );
};

export default ManagePage;