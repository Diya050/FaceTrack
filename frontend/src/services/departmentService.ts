import api from "./api";

// --- Interfaces ---

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

/**
 * Payload for updating a department. 
 * Both fields are optional to allow partial updates.
 */
export interface UpdateDepartmentPayload {
  name?: string;
  description?: string;
}

// --- Service Functions ---

/**
 * Fetches all departments for the organization.
 */
export const listDepartments = async (
  organizationId?: string
): Promise<Department[]> => {
  const response = await api.get<Department[]>("/departments", {
    params: organizationId ? { organization_id: organizationId } : undefined,
  });
  return response.data;
};

/**
 * Creates a new department.
 */
export const createDepartment = async (
  payload: CreateDepartmentPayload
): Promise<Department> => {
  const response = await api.post<Department>("/departments", payload);
  return response.data;
};

/**
 * Updates an existing department's details.
 * @param departmentId The UUID of the department to update
 * @param payload The fields to be updated (name or description)
 */
export const updateDepartment = async (
  departmentId: string,
  payload: UpdateDepartmentPayload
): Promise<Department> => {
  const response = await api.put<Department>(`/departments/${departmentId}`, payload);
  return response.data;
};

/**
 * Deletes (Soft Delete) a department.
 * @param departmentId The UUID of the department to remove
 */
export const deleteDepartment = async (
  departmentId: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/departments/${departmentId}`);
  return response.data;
};