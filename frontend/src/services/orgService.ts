import api from "./api";

export interface Organization {
  organization_id: string;
  name: string;
  email: string;
  contact_number: string;
  address: string;
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