import api from "./api";

export interface Camera {
  camera_id: string;
  camera_name: string;
  camera_type: string | null;
  location: string | null;
  ip_address: string | null;
  device_identifier: string;
  status: string;
  last_heartbeat: string | null;
}

export const getCameras = async (): Promise<Camera[]> => {
  const res = await api.get<Camera[]>("/cameras");
  return res.data;
};

export const getActiveStreams = async () => {
  const res = await api.get("/cameras/active");
  return res.data;
};

export const getCameraStreamUrl = (cameraId: string) => {
  return `${api.defaults.baseURL}/cameras/${cameraId}/stream`;
};