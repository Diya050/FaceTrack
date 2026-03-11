import api from "./api";

// This must match the prefix in your FastAPI router
const API = "/admin/face-enrollment"; 

export const getEnrollmentRequests = async () => {
  // Assuming your GET route is /admin/face-enrollment/requests
  const res = await api.get(`${API}/requests`);
  return res.data;
};

/**
 * Corrected to use Path Parameters: /admin/face-enrollment/{id}/approve
 * Also changed type to string since we are using UUIDs
 */
export const approveEnrollmentRequest = async (sessionId: string) => {
  const res = await api.post(`${API}/${sessionId}/approve`);
  return res.data;
};

/**
 * Corrected to use Path Parameters: /admin/face-enrollment/{id}/reject
 */
export const rejectEnrollmentRequest = async (sessionId: string) => {
  const res = await api.post(`${API}/${sessionId}/reject`);
  return res.data;
};