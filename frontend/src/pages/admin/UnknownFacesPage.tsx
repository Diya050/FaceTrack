import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import UnknownFacesTable from "../../components/admin/monitoring/UnknownFacesTable";

const NAVBAR_HEIGHT = 64;

const UnknownFacesPage = () => {
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
      <Box id="unknown">
        <UnknownFacesTable />
      </Box>
    </Stack>
  );
};

export default UnknownFacesPage;