import api from "./api";

const API_BASE = "/users"; 

export interface RegistrationRequest {
  id: string;
  full_name: string;
  email: string;
  organization_name: string;
  department_name: string;
  role: string;
  employee_id: string;
  created_at: string;
  status: string;
}

/**
 * Fetch all users with PENDING status
 */
export const getPendingUsers = async (): Promise<RegistrationRequest[]> => {
  const res = await api.get(`${API_BASE}/pending`);
  return res.data;
};

/**
 * Approve a user and trigger face enrollment request
 */
export const approveUserRequest = async (userId: string) => {
  // Step 1: Approve the account
  await api.patch(`${API_BASE}/${userId}/approve`);
  // Step 2: Request face enrollment session
  const res = await api.post(`${API_BASE}/${userId}/request-face-enrollment`);
  return res.data;
};

/**
 * Reject a user registration with a reason
 */
export const rejectUserRequest = async (userId: string, reason?: string) => {
  // If reason is empty, we still send the request
  const res = await api.patch(`/users/${userId}/reject`, { reason: reason || "No reason provided" });
  return res.data;
};