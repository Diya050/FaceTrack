import HeaderIcons from "./HeaderIcons";
import BaseHeader from "./BaseHeader";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/user/dashboard" },
  { label: "Analytics", path: "/user/reports" },
];

const UserHeader = () => {
  const { user } = useAuth();

  return (
    <BaseHeader
      logoLink="/user/dashboard"
      navItems={navItems}
      rightSlot={<HeaderIcons firstName={user?.firstName ?? "U"} />}
    />
  );
};

export default UserHeader;