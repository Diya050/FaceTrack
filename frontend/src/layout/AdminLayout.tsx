import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";

const NAVBAR_HEIGHT = 64;
const SIDEBAR_WIDTH = 260;

const AdminLayout = () => {
  return (
    <>
      {/* Fixed Navbar */}
      <PublicHeader />

      {/* Fixed Sidebar */}
      <AdminSidebar width={SIDEBAR_WIDTH} />

      {/* Content + Footer wrapper */}
      <Box
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          mt: `${NAVBAR_HEIGHT}px`,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Scrollable content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 3,
            bgcolor: "#fffff",
          }}
        >
          <Outlet />
        </Box>

        {/* Footer always at bottom */}
        <Footer />
      </Box>
    </>
  );
};

export default AdminLayout;