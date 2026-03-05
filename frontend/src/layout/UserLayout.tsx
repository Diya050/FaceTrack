import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import UserHeader from "../components/header/UserHeader";
import UserSidebar from "../components/user/UserSidebar";
import Footer from "../components/Footer";

const NAVBAR_HEIGHT = 64;
const SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 64;

const SIDEBAR_COLLAPSED = 80;

const UserLayout = () => {

  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;


  return (
    <>
      <UserHeader />

      <UserSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <Box
        sx={{
          ml: `${sidebarWidth}px`,
          mt: `${NAVBAR_HEIGHT}px`,
          minHeight: "calc(100vh - 64px)",
          transition: "margin-left 0.3s"

        }}
      >
        <Outlet />
        <Footer />
      </Box>
    </>
  );
};

export default UserLayout;