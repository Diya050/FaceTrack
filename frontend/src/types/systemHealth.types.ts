export interface Incident {
  id: string;
  message: string;
}

export interface CameraNode {
  id: string;
  name: string;
  status: string;
  fps: number;
}

export interface SystemHealthResponse {
  overview: {
    uptimePercent: number;
    activeIncidents: Incident[];
  };
  faceTrackEngine: {
    averageFps: number;
    matchingLatencyMs: number;
    livenessFailuresToday: number;
    cameras: CameraNode[];
  };
  infrastructure: {
    cpu: { usagePercent: number };
    memory: { usedGB: number; totalGB: number };
    disk: { usedTB: number; totalTB: number };
    network: { inboundMbps: number; outboundMbps: number };
  };
  apm: {
    averageResponseTimeMs: number;
    requestsPerMinute: number;
    errorRatePercent: number;
  };
  database: {
    status: string;
    activeConnections: number;
    idleConnections: number;
    averageQueryTimeMs: number;
  };
  queues: {
    videoProcessingBacklog: number;
    processingRatePerMinute: number;
    failedJobsToday: number;
  };
}