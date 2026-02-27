import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/header/AdminHeader";
import Footer from "../components/Footer";

const NAVBAR_HEIGHT = 64;
const SIDEBAR_WIDTH = 265;
const COLLAPSED_WIDTH = 65;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <AdminHeader />

      <AdminSidebar
        width={SIDEBAR_WIDTH}
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      <Box
        sx={{
          ml: collapsed ? `${COLLAPSED_WIDTH}px` : `${SIDEBAR_WIDTH}px`,
          mt: `${NAVBAR_HEIGHT}px`,
          transition: "margin-left 0.25s ease",
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