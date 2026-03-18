export const resolveRoute = async (auth: any, axios: any) => {
  try {
    const { status, face_enrolled, role } = auth;

    if (!status) return "/home"; // prevent crash

    if (role === "SUPER_ADMIN") return "/platform/dashboard";

    if (role === "HR_ADMIN") return "/admin/dashboard";

    if (role === "ADMIN") return "/admin/dashboard";

    if (status === "pending") return "/pending-approval";

    if (status === "approved" && !face_enrolled) {
      try {
        const res = await axios.get("/face-enrollment/my-status");

        if (!res.data.has_request) return "/pending-approval";

        if (res.data.status === "started") return "/user/capture";

        if (res.data.status === "pending_approval") {
          return "/user/pending-face-approval";
        }
      } catch {
        return "/pending-approval"; // fallback if API fails
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