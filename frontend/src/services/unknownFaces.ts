import api from "./api";

export const UnknownFaceAction = {
  MAP_EMPLOYEE: "MAP_EMPLOYEE",
  SECURITY_ALERT: "SECURITY_ALERT"
} as const;

export type UnknownFaceAction =
  typeof UnknownFaceAction[keyof typeof UnknownFaceAction];

export interface UnknownFace {
  unknown_id: string;
  stream_id: string;
  camera_name: string;
  detected_time: string;
  image_path: string;
  confidence_score: number | null;
  resolved: boolean;
}

export interface ResolveUnknownFaceRequest {
  unknown_id: string;
  employee_id?: string | null;
  action: UnknownFaceAction;
}

export const unknownFacesService = {
  getUnknownFaces: async () => {
    const res = await api.get<UnknownFace[]>("/unknown-faces");
    return res.data;
  },

  resolveFace: async (data: ResolveUnknownFaceRequest) => {
    const res = await api.post("/unknown-faces/resolve", data);
    return res.data;
  },

  deleteFace: async (unknown_id: string) => {
    const res = await api.delete(`/unknown-faces/${unknown_id}`);
    return res.data;
  },

  getEmployees: async (search: string) => {
    const res = await api.get(`/unknown-faces/employees?search=${search}`);
    return res.data;
  }
};