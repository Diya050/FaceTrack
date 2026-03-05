import HeaderIcons from "./HeaderIcons";
import BaseHeader from "./BaseHeader";
import { useAuth } from "../../context/AuthContext";

const userNavItems = [
  {
    label: "Dashboard",
    path: "/user/dashboard",
    children: [
      { label: "Dashboard", path: "/user/dashboard#dashboard" },
      { label: "My Attendance", path: "/user/dashboard#attendance" },
    ],
  },
  { label: "My Profile", path: "/user/me" },
  { label: "Analytics", path: "/user/reports" },

  /* Hidden on Desktop — visible in hamburger */
  {
    label: "Help & Support",
    path: "/user/help",
    hideOnDesktop: true,
    children: [
      { label: "User Guide", path: "/user/help#guide" },
      { label: "Contact Support", path: "/user/help#contact" },
    ],
  },
];

const UserHeader = () => {
  const { user } = useAuth();

  return (
    <BaseHeader
      logoLink="/user/dashboard"
      navItems={userNavItems}
      rightSlot={<HeaderIcons firstName={user?.firstName ?? "U"} />}
    />
  );
};

export default UserHeader;