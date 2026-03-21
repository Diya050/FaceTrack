export interface LiveAlert {
  id: string;
  source: string;
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
}