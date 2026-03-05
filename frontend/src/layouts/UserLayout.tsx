import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import UserHeader from "../components/header/UserHeader";
import UserSidebar from "../components/user/UserSidebar";
import Footer from "../components/Footer";

const NAVBAR_HEIGHT = 64;
const SIDEBAR_WIDTH = 260;

const UserLayout = () => {
  return (
    <>
      <UserHeader />

      <UserSidebar width={SIDEBAR_WIDTH} />

      <Box
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          mt: `${NAVBAR_HEIGHT}px`,
          minHeight: "calc(100vh - 64px)",
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