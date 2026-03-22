import api from "./api";

export interface Organization {
  organization_id: string;
  name: string;
  email: string;
  contact_number: string;
  address: string;
  status: "active" | "suspended" | "inactive";
}

export interface Department {
  department_id: string;
  name: string;
  description?: string;
  organization_id: string;
}

export const getOrganizations = async (): Promise<Organization[]> => {
  const res = await api.get("/organizations/public");
  return res.data;
};

export const getDepartmentsByOrgName = async (
  organizationName: string
): Promise<Department[]> => {
  const res = await api.get(
    `/departments/public/by-org-name/${organizationName}`
  );
  return res.data;
};

export const createOrganization = async (data: any) => {
  const res = await api.post("/organizations", data);
  return res.data;
};

export const updateOrganizationStatus = async (
  orgId: string,
  status: string
) => {
  const res = await api.patch(
    `/organizations/${orgId}/status?status=${status}`
  );
  return res.data;
};

export const deleteOrganization = async (orgId: string) => {
  const res = await api.delete(`/organizations/${orgId}`);
  return res.data;
};

export const getPlatformStats = async () => {
  const res = await api.get("/organizations/stats");
  return res.data;
};