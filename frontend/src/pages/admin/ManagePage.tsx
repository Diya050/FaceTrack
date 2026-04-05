import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Components
import Departments from "../../components/admin/manage/Departments";
import AssignRolePage from "../../components/admin/manage/AssignRolePage";
import ViewOrganizationUsers from "./ViewOrganizationUsers";
import AttendanceRules from "../../components/admin/manage/AttendanceRules";
import RegistrationRequests from "../../components/admin/manage/RegistrationRequests";
import AdminFaceEnrollmentRequests from "../../components/admin/manage/FaceEnrollmentRequests";
import DepartmentUsers from "../../components/admin/manage/DepartmentUsers";
import InviteUsers from "../../components/admin/manage/InviteUsers";

const NAVBAR_HEIGHT = 64;

const ManagePage = () => {
  const { hash } = useLocation();
  const { role } = useAuth();

  // ✅ Role Groups (SCALABLE)
  const isHRLevel = role === "HR_ADMIN" || role === "ORG_ADMIN";
  const isAdminLevel =
    role === "ADMIN" || role === "HR_ADMIN" || role === "ORG_ADMIN";

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

        {role === "ORG_ADMIN" && (
          <Box id="invite-users">
            <InviteUsers />
          </Box>
        )}
        
        {/* Departments (HR + ORG_ADMIN) */}
        {isHRLevel && (
          <Box id="departments">
            <Departments />
          </Box>
        )}

        {/* Department Users (ADMIN + ORG_ADMIN optional) */}
        {(role === "ADMIN") && (
          <Box id="users">
            <DepartmentUsers />
          </Box>
        )}

        {/* Organization Users */}
        {isHRLevel && (
          <Box id="organization-users">
            <ViewOrganizationUsers embedded />
          </Box>
        )}

        {/* Assign Role */}
        {isHRLevel && (
          <Box id="assign-role">
            <AssignRolePage />
          </Box>
        )}

        {/* Registration Requests */}
        {isHRLevel && (
          <Box id="requests">
            <RegistrationRequests />
          </Box>
        )}

        {/* Face Enrollment Requests */}
        {isHRLevel && (
          <Box id="face-enrollment-requests">
            <AdminFaceEnrollmentRequests />
          </Box>
        )}

        {/* Attendance Rules (Admin-level access) */}
        {isAdminLevel && (
          <Box id="rules">
            <AttendanceRules />
          </Box>
        )}

      </Stack>
    </Box>
  );
};

export default ManagePage;