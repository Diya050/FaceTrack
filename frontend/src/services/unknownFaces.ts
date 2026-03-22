import api from "./api";

export const UnknownFaceAction = {
  MAP_EMPLOYEE: "MAP_EMPLOYEE",
  SECURITY_ALERT: "SECURITY_ALERT"
} as const;

export type UnknownFaceAction = typeof UnknownFaceAction[keyof typeof UnknownFaceAction];

export interface UnknownFace {
  unknown_id: string;
  stream_id: string;
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
    const response = await api.get<UnknownFace[]>("/unknown-faces");
    return response.data;
  },

  resolveFace: async (data: ResolveUnknownFaceRequest) => {
    const response = await api.post("/unknown-faces/resolve", data);
    return response.data;
  }
};