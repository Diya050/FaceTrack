import api from "./api";

export interface Department {
  department_id: string;
  name: string;
  description: string | null;
  organization_id: string;
}

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
  organization_id?: string;
}

export const listDepartments = async (
  organizationId?: string
): Promise<Department[]> => {
  const response = await api.get<Department[]>("/departments", {
    params: organizationId ? { organization_id: organizationId } : undefined,
  });
  return response.data;
};

export const createDepartment = async (
  payload: CreateDepartmentPayload
): Promise<Department> => {
  const response = await api.post<Department>("/departments", payload);
  return response.data;
};
