import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";

const PublicLayout: React.FC = () => {
  return (
    <Box
        sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}
    >
      <PublicHeader />
      <Box sx={{ mt: 4, px: 3, flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default PublicLayout;