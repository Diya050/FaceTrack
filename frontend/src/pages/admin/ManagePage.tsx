import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Manage Department
import Departments from "../../components/admin/manage/Departments";
import UserProfiles from "../../components/admin/manage/UserProfiles";
import BulkUpload from "../../components/admin/manage/BulkUpload";
import FaceGallery from "../../components/admin/manage/FaceGallery";
import Roles from "../../components/admin/manage/Roles";
import AccessControl from "../../components/admin/manage/AccessControl";


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
    <Stack spacing={6}>
      <Box id="departments">
        <Departments />
      </Box>

      <Box id="users">
        <UserProfiles />
      </Box>

      <Box id="bulk-upload">
        <BulkUpload />
      </Box>

      <Box id="face-gallery">
        <FaceGallery />
      </Box>

      <Box id="roles">
        <Roles />
      </Box>
      
      <Box id="access-control">
        <AccessControl />
      </Box>
    </Stack>
  );
};

export default ManagePage;