// src/data/liveAlerts.mock.ts

export type AlertSeverity = "critical" | "warning" | "info";

export interface LiveAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  source: string;
  message: string;
}

export const mockLiveAlerts: LiveAlert[] = [
  {
    id: "AL-001",
    timestamp: "2026-02-26T12:48:10Z",
    severity: "warning",
    source: "Camera CAM-03",
    message: "Intermittent packet loss detected in Hallway B camera.",
  },
  {
    id: "AL-002",
    timestamp: "2026-02-26T18:32:45Z",
    severity: "critical",
    source: "FaceTrack Engine",
    message: "Matching latency exceeded 800ms for more than 2 minutes.",
  }
];