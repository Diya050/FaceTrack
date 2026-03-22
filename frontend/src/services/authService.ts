import api from "./api";

export const orgLogin = async (data: {
  email: string;
  password: string;
  organization_name: string;
}) => {
  const res = await api.post("/auth/org-login", data);
  return res.data;
};

export const platformLogin = async (
  email: string,
  password: string
) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await api.post("/auth/platform-login", formData);
  return res.data;
};

export const registerUser = async (data: {
  full_name: string;
  email: string;
  password: string;
  organization_name: string;
  department_name: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// Forgot Password
export const forgotPassword = async (data: {
  email: string;
  organization_name?: string | null;
}) => {
  const res = await api.post("/auth/forgot-password", data);
  return res.data;
};

// Reset Password
export const resetPassword = async (data: {
  token_id: string;
  new_password: string;
}) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};
