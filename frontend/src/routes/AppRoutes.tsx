import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

//Public Pages
import MeetOurTeam from "../pages/MeetOurTeam";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PendingApproval from "../pages/auth/PendingApproval";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Pages With Header */}
      <Route element={<PublicLayout />}>
        <Route path="/" />
        <Route path="/features" />
        <Route path="/contact" />
        <Route path="/how-it-works" />
        <Route path="/help-center" />
        <Route path="/privacy-policy" />
        <Route path="/terms-of-use" />
        <Route path="/about-technology" />
        <Route path="/faqs" />
        <Route path="/team" element={<MeetOurTeam />} /> 
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
    </Routes>
  );
}
