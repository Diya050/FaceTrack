import api from "./api";

export const getCurrentUser = async () => {
  const res = await api.get("/profile/users/me");
  console.log(res.data)
  return res.data;
};

export const updateCurrentUser = async (data: any) => {
  const res = await api.put("/profile/users/me", data);
  return res.data;
};