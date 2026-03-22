import { Box, Stack, Container } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import UnknownFacesTable from "./UnknownFacesTable";

const NAVBAR_HEIGHT = 64;

const UnknownFacesPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 16;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [hash]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={4}>

        <Box id="unknown">
          <UnknownFacesTable />
        </Box>
      </Stack>
    </Container>
  );
};

export default UnknownFacesPage;