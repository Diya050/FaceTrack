import { useRoutes, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminRoutes } from "./AdminRoute";

import PublicLayout from "../layout/PublicLayout";
import UserLayout from "../layout/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import StatusGuard from "./StatusGuard";

/* ---------------- USER PAGES ---------------- */
import UserDashboardPage from "../pages/user/UserDashboardPage";
import MyAttendancePage from "../pages/user/MyAttendancePage";
import UserReportsPage from "../pages/user/UserReportsPage";
import Profiles from "../pages/user/Profiles";
import HelpCenterPage from "../pages/user/HelpCenterPage";
import UserGuidePage from "../pages/user/UserGuidePage";
import FaceEnrollment from "../pages/user/FaceEnrollment";
import CreateTicket from "../pages/user/CreateTicket";

/* ---------------- AUTH PAGES ---------------- */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PendingApproval from "../pages/auth/PendingApproval";
import PendingFaceApproval from "../pages/auth/PendingFaceApproval";

/* ---------------- PUBLIC PAGES ---------------- */
import MeetOurTeam from "../pages/MeetOurTeam";
import AdminGuidePage from "../pages/admin/AdminGuidePage";
import TermsOfUsePage from "../pages/TermsOfUse";
import Features from "../pages/public/Features";
import HowItWorks from "../pages/public/HowItWorks";
import FAQ from "../pages/public/FAQ/FAQ";
import QueryForm from "../pages/public/FAQ/QueryForm";
import ContactPage from "../pages/ContactPage";
import AboutTechnologyPage from "../pages/AboutTechnologyPage";
import Home from "../pages/Home";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";

function RootDecider() {
  const auth = useAuth();

  if (auth.loading) return <div>Loading...</div>;

  if (!auth.token) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/user" replace />;
}

/* ---------------- ROUTES ---------------- */

export default function AppRoutes() {
  return useRoutes([

    /*  ADMIN ROUTES */
    adminRoutes,

    /*  USER ROUTES */
    {
      path: "/user",
      element: (
        <ProtectedRoute>
          <StatusGuard>
            <UserLayout />
          </StatusGuard>
        </ProtectedRoute>
      ),
      children: [
        // { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "pending-face-approval", element: <PendingFaceApproval />},
        { path: "dashboard", element: <UserDashboardPage /> },
        { path: "me", element: <Profiles /> },
        { path: "attendance", element: <MyAttendancePage /> },
        { path: "reports", element: <UserReportsPage /> },
        { path: "help", element: <HelpCenterPage /> },
        { path: "settings/user-guide", element: <UserGuidePage /> },
        { path: "capture", element: <FaceEnrollment /> },
        { path: "support", element: <CreateTicket /> },
      ],
    },

    /*  COMMON */
    {
      path: "/pending-approval",
      element: (
        <ProtectedRoute>
          <PendingApproval />
        </ProtectedRoute>
      ),
    },

    /*  PUBLIC ROUTES */
    {
      element: <PublicLayout />,
      children: [ 
        { index: true, element: <RootDecider />},
        { path: "/", element: <RootDecider /> },
        { path: "/home", element: <Home /> },
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

    /*  AUTH ROUTES */
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password/:token", element: <ResetPassword /> },

    /*  FALLBACK */
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
}