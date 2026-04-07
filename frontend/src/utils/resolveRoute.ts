export const resolveRoute = async (auth: any, axios: any) => {
  try {
    const { status, face_enrolled, role, organization_id } = auth;

    // ---------------- SUPER ADMIN ----------------
    if (!organization_id && role === "SUPER_ADMIN") {
      return "/super-admin/dashboard";
    }

    // ---------------- ORG ADMINS (No face enrollment required) ----------------
    if (role === "ORG_ADMIN") {
      if (status === "active") {
        return "/admin/dashboard";
      }
      if (status === "pending") {
        return "/pending-approval";
      }
      // If approved but not active yet, still redirect to dashboard
      return "/admin/dashboard";
    }

    // ---------------- OTHER ADMINS (HR_ADMIN, ADMIN) ----------------
    if (role === "HR_ADMIN" || role === "ADMIN") {
      if (status === "active" && face_enrolled) {
        return "/admin/dashboard";
      }
      // These roles need face enrollment
      if (status === "approved" && !face_enrolled) {
        try {
          const res = await axios.get("/face-enrollment/my-status");

          if (!res.data.has_request) return "/user/capture";
          if (res.data.status === "started") return "/user/capture";
          if (res.data.status === "pending_approval") {
            return "/user/pending-face-approval";
          }
        } catch {
          return "/user/capture";
        }
      }
      if (status === "pending") return "/pending-approval";
      return "/admin/dashboard";
    }

    // ---------------- USER FLOW ----------------
    if (!status) return "/pending-approval";

    if (status === "pending") return "/pending-approval";

    if (status === "approved" && !face_enrolled) {
      try {
        const res = await axios.get("/face-enrollment/my-status");

        if (!res.data.has_request) return "/user/capture";
        if (res.data.status === "started") return "/user/capture";
        if (res.data.status === "pending_approval") {
          return "/user/pending-face-approval";
        }
      } catch {
        return "/user/capture";
      }
    }

    if (status === "active" && face_enrolled) {
      return "/user/dashboard";
    }

    return "/home";
  } catch (error) {
    console.error("resolveRoute failed:", error);
    return "/home";
  }
};