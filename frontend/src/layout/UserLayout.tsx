import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import UserHeader from "../components/header/UserHeader";
import UserSidebar from "../components/user/UserSidebar";
import Footer from "../components/Footer";

const NAVBAR_HEIGHT = 64;
const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 70;

const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      {/* Top Header */}
      <UserHeader />

      {/* Sidebar */}
      <UserSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <Box
        sx={{
          ml: `${sidebarWidth}px`,
          mt: `${NAVBAR_HEIGHT}px`,
          p: 0,
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          transition: "margin-left 0.3s ease",
          backgroundColor: "#f5f6fa"
        }}
      >
        {/* Page Content */}
        <Outlet />

        {/* Footer */}
        <Footer />
      </Box>

    </Box>
  );
};

export default UserLayout;