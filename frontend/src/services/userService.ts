import api from "./api";

export type UserStatus = "pending" | "approved" | "rejected" | "active" | "inactive";

export interface OrganizationUser {
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  role: string | null;
  department: string | null;
  organization: string | null;
  status: UserStatus;
  is_active: boolean;
  face_enrolled: boolean;
  approved_by: string | null;
  created_at: string | null;
  approved_at: string | null;
  last_login: string | null;
  updated_at: string | null;
}

export const getCurrentUser = async () => {
  const res = await api.get("/profile/users/me");
  console.log(res.data)
  return res.data;
};

export const updateCurrentUser = async (data: any) => {
  const res = await api.put("/profile/users/me", data);
  return res.data;
};

export const listOrganizationUsers = async (
  status?: UserStatus
): Promise<OrganizationUser[]> => {
  const res = await api.get<OrganizationUser[]>("/profile/users", {
    params: status ? { status } : undefined,
  });
  return res.data;
};