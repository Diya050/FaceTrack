import api from "./api";

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actor_role: string;
  email: string;
  action: string;
  category: "auth" | "user" | "config" | "data" | "system";
  severity: "info" | "warning" | "critical";
  resource: string;
  resource_id: string;
  ip: string;
  details: string;
}

export const auditLogService = {
  async getAuditLogs(limit: number = 50, skip: number = 0): Promise<AuditLog[]> {
    const response = await api.get<AuditLog[]>("/audit/logs", {
      params: {
        limit,
        skip,
      },
    });
    return response.data;
  },
};
