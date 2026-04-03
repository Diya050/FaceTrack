import api from "../services/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RetentionPolicyResponse {
  id: string;
  category: string;
  retention_days: number;
  auto_delete: boolean;
  archive_before_delete: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  records_affected: number;
  size_mb: number;
}

export interface RetentionPolicyUpdate {
  retention_days: number;
  auto_delete: boolean;
  archive_before_delete: boolean;
}

export interface PurgeJobResponse {
  id: string;
  category: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  records_deleted: number;
  size_mb: number;
  triggered_by: string;
  error_message: string | null;
}

export interface TriggerPurgeResponse {
  status: string;
  message: string;
  policy_id: string;
  job_id: string;
}

// ─── Data Retention API ───────────────────────────────────────────────────────

export const dataRetentionApi = {
  listPolicies: async (): Promise<RetentionPolicyResponse[]> => {
    const response = await api.get<RetentionPolicyResponse[]>("/data-retention/policies");
    return response.data;
  },

  getPolicy: async (policyId: string): Promise<RetentionPolicyResponse> => {
    const response = await api.get<RetentionPolicyResponse>(`/data-retention/policies/${policyId}`);
    return response.data;
  },

  updatePolicy: async (policyId: string, payload: RetentionPolicyUpdate): Promise<RetentionPolicyResponse> => {
    const response = await api.put<RetentionPolicyResponse>(`/data-retention/policies/${policyId}`, payload);
    return response.data;
  },

  triggerPurge: async (policyId: string): Promise<TriggerPurgeResponse> => {
    const response = await api.post<TriggerPurgeResponse>(`/data-retention/policies/${policyId}/purge`);
    return response.data;
  },

  listPurgeJobs: async (): Promise<PurgeJobResponse[]> => {
    const response = await api.get<PurgeJobResponse[]>("/data-retention/jobs");
    return response.data;
  },

  getPurgeJob: async (jobId: string): Promise<PurgeJobResponse> => {
    const response = await api.get<PurgeJobResponse>(`/data-retention/jobs/${jobId}`);
    return response.data;
  },

  initializePolicies: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/data-retention/policies/initialize");
    return response.data;
  },
};

// Re-export types for better compatibility
export type { RetentionPolicyResponse as RetentionPolicy };
export type { PurgeJobResponse as PurgeJob };
