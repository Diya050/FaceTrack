import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/header/AdminHeader";
import Footer from "../components/Footer";

const NAVBAR_HEIGHT = 64;
const SIDEBAR_WIDTH = 265;

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />

      <AdminSidebar width={SIDEBAR_WIDTH} />

      <Box
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          mt: `${NAVBAR_HEIGHT}px`,
          display: "flex",
          flexDirection: "column",
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            bgcolor: "#ffffff",
          }}
        >
          <Outlet />
        </Box>

        <Footer />
      </Box>
    </>
  );
};

export default AdminLayout;