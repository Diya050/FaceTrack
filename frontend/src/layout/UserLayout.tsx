import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import UserHeader from "../components/header/UserHeader";
import UserSidebar from "../components/user/UserSidebar";
import Footer from "../components/Footer";

const NAVBAR_HEIGHT = 64;
const SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 64;

const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <UserHeader />

      {!isMobile && (
        <UserSidebar
          width={SIDEBAR_WIDTH}
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      )}

      <Box
        sx={{
          ml: isMobile
            ? 0
            : collapsed
            ? `${COLLAPSED_WIDTH}px`
            : `${SIDEBAR_WIDTH}px`,
          mt: `${NAVBAR_HEIGHT}px`,
          transition: "margin-left 0.25s ease",
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>

        <Footer />
      </Box>
    </>
  );
};

export default UserLayout;