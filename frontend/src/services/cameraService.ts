import api from "./api";


export const getActiveStreams = async () => {
  const res = await api.get("/cameras/active");
  return res.data;
};

export const getCameraStreamUrl = (cameraId: string) => {
  return `${api.defaults.baseURL}/cameras/${cameraId}/stream`;
};