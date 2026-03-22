import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/header/AdminHeader";
import Footer from "../components/Footer";

const NAVBAR_HEIGHT = 64;
const SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 64;

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {/* ✅ SAME HEADER POSITION */}
      <AdminHeader />

      {/* ✅ SAME SIDEBAR LOGIC */}
      {!isMobile && (
        <AdminSidebar
          width={SIDEBAR_WIDTH}
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      )}

      {/* ✅ IDENTICAL CONTENT WRAPPER */}
      <Box
        sx={{
          ml: isMobile
            ? 0
            : collapsed
            ? `${COLLAPSED_WIDTH}px`
            : `${SIDEBAR_WIDTH}px`,
          mt: `${NAVBAR_HEIGHT}px`,
          transition: "margin-left 0.25s ease",
          display: "flex",
          flexDirection: "column",
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        {/* MAIN CONTENT */}
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

        {/* FOOTER */}
        <Footer />
      </Box>
    </>
  );
};

export default SuperAdminLayout;