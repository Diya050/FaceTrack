import { useRoutes } from "react-router-dom";
import { adminRoutes } from "./AdminRoute";

import PublicLayout from "../layout/PublicLayout";
import UserLayout from "../layout/UserLayout";
import UserDashboardPage from "../pages/user/UserDashboardPage";
import MyAttendancePage from "../pages/user/MyAttendancePage";
import UserReportsPage from "../pages/user/UserReportsPage";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PendingApproval from "../pages/auth/PendingApproval";

// Public Pages
import MeetOurTeam from "../pages/MeetOurTeam";
import HelpCenterPage from "../pages/user/HelpCenterPage";
import AdminGuidePage from "../pages/admin/AdminGuidePage";
import UserGuidePage from "../pages/user/UserGuidePage";
import TermsOfUsePage from "../pages/TermsOfUse";
import Features from "../pages/public/Features";
import HowItWorks from "../pages/public/HowItWorks";
import FAQ from "../pages/public/FAQ/FAQ";
import QueryForm from "../pages/public/FAQ/QueryForm";
import ContactPage from "../pages/ContactPage";
import AboutTechnologyPage from "../pages/AboutTechnologyPage";
import Home from "../pages/Home";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";

export default function AppRoutes() {
  return useRoutes([
    // Admin Routes
    adminRoutes,

    //User Routes
    {
      path: "/user",
      element: <UserLayout />,
      children: [
        { path: "dashboard", element: <UserDashboardPage /> },
        { path: "attendance", element: <MyAttendancePage /> },
        { path: "reports", element: <UserReportsPage /> },

        { path: "help", element: <HelpCenterPage /> },
        { path: "settings/user-guide", element: <UserGuidePage /> },
      ],
    },

    // Public Pages
    {
      element: <PublicLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/features", element: <Features /> },
        { path: "/contact", element: <ContactPage /> },
        { path: "/how-it-works", element: <HowItWorks /> },
        { path: "/privacy-policy", element: <PrivacyPolicy /> },
        { path: "/terms-of-use", element: <TermsOfUsePage /> },
        { path: "/about-technology", element: <AboutTechnologyPage /> },
        { path: "/faqs", element: <FAQ /> },
        { path: "/team", element: <MeetOurTeam /> },
        { path: "/help-center", element: <HelpCenterPage /> },
        { path: "/admin-guide", element: <AdminGuidePage /> },
        { path: "/user-guide", element: <UserGuidePage /> },
        { path: "/query", element: <QueryForm /> },
      ],
    },

    // Auth Pages
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/pending-approval", element: <PendingApproval /> },
  ]);
}