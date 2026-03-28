import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Manage Department
import Departments from "../../components/admin/manage/Departments";
import AssignRolePage from "../../components/admin/manage/AssignRolePage";
import ViewOrganizationUsers from "./ViewOrganizationUsers";
// import BulkUpload from "../../components/admin/manage/BulkUpload";
import AttendanceRules from "../../components/admin/manage/AttendanceRules";
import RegistrationRequests from "../../components/admin/manage/RegistrationRequests";
import AdminFaceEnrollmentRequests from "../../components/admin/manage/FaceEnrollmentRequests";
import DepartmentUsers from "../../components/admin/manage/DepartmentUsers";


const NAVBAR_HEIGHT = 64;

const ManagePage = () => {
  const { hash } = useLocation();
  const { role } = useAuth();

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
        {role === "HR_ADMIN" && (<Box id="departments">
          <Departments />
        </Box>
        )}

        {role === "ADMIN" && (<Box id="users">
          <DepartmentUsers />
        </Box>
        )}

        {role === "HR_ADMIN" && (
          <Box id="organization-users">
            <ViewOrganizationUsers embedded />
          </Box>
        )}

        {role === "HR_ADMIN" && (
          <Box id="assign-role">
          <AssignRolePage />
        </Box>
        )}

        {role === "HR_ADMIN" && (
        <Box id="requests">
          <RegistrationRequests />
        </Box>
        )}

        {role === "HR_ADMIN" && (
        <Box id="face-enrollment-requests">
          <AdminFaceEnrollmentRequests />
        </Box>
        )}
        <Box id="rules">
          <AttendanceRules />
        </Box>

      </Stack>
    </Box>
  );
};

export default ManagePage;