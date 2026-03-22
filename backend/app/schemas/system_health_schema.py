from pydantic import BaseModel
from typing import List

class IncidentModel(BaseModel):
    id: str
    message: str

class OverviewModel(BaseModel):
    uptimePercent: float
    activeIncidents: List[IncidentModel]

class CameraNodeModel(BaseModel):
    id: str
    name: str
    status: str
    fps: int

class FaceTrackEngineModel(BaseModel):
    averageFps: int
    matchingLatencyMs: int
    livenessFailuresToday: int
    cameras: List[CameraNodeModel]

class InfrastructureModel(BaseModel):
    cpu: dict      # { "usagePercent": float }
    memory: dict   # { "usedGB": float, "totalGB": float }
    disk: dict     # { "usedTB": float, "totalTB": float }
    network: dict  # { "inboundMbps": int, "outboundMbps": int }

class APMModel(BaseModel):
    averageResponseTimeMs: int
    requestsPerMinute: int
    errorRatePercent: float

class DatabaseModel(BaseModel):
    status: str
    activeConnections: int
    idleConnections: int
    averageQueryTimeMs: int

class QueuesModel(BaseModel):
    videoProcessingBacklog: int
    processingRatePerMinute: int
    failedJobsToday: int

class SystemHealthResponse(BaseModel):
    overview: OverviewModel
    faceTrackEngine: FaceTrackEngineModel
    infrastructure: InfrastructureModel
    apm: APMModel
    database: DatabaseModel
    queues: QueuesModel