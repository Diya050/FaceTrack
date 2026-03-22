import api from "./api";

const API = "/admin/face-enrollment"; 

export const getEnrollmentRequests = async () => {
  const res = await api.get(`${API}/requests`);
  return res.data;
};

export const approveEnrollmentRequest = async (sessionId: string) => {
  const res = await api.post(`${API}/${sessionId}/approve`);
  return res.data;
};

export const rejectEnrollmentRequest = async (sessionId: string, reason: string) => {
  const response = await api.post(`/admin/face-enrollment/${sessionId}/reject`, { reason });
  return response.data;
};