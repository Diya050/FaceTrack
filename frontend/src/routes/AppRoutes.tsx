import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PendingApproval from "../pages/auth/PendingApproval";

//Public Pages
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


export default function AppRoutes() {
  return (
    <Routes>

<<<<<<< Updated upstream
      {/* Public Pages With Header */}
      <Route element={<PublicLayout />}>
        <Route path="/" />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/help-center" />
        <Route path="/privacy-policy" />
        <Route path="/terms-of-use" element={<TermsOfUsePage/>}/>
        <Route path="/about-technology" element={<AboutTechnologyPage/>} />
        <Route path="/faqs" element={<FAQ/>} />
        <Route path="/team" element={<MeetOurTeam />} /> 
        <Route path="/help-center" element={<HelpCenterPage/>}/>
        <Route path="/admin-guide" element={<AdminGuidePage/>} />
        <Route path="/user-guide" element={<UserGuidePage/>}/>
        <Route path="/query" element={<QueryForm/>} />
      </Route>

      {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
    </Routes>
  );
}
=======
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
>>>>>>> Stashed changes
