// import type { UUID } from "crypto";
import api from "./api";

export interface AssignRoleRequest {
  user_id: string;
  role_name: "USER" | "ADMIN" | "HR_ADMIN" | "ORG_ADMIN";
}

export const assignRole = async (data: AssignRoleRequest) => {
  return api.post("/roles/assign", data);
};

export const getUsers = async () => {
  return api.get("/users/assignable");
};