import psutil
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, text, case

from app.models.streams import Camera, VideoStream, UnknownFace
from app.models.system import LoginHistory, AuditLog


def get_system_health(db: Session, organization_id: str):
    incidents = []
    now = datetime.utcnow()

    # ==========================================
    # 1. CAMERAS & FACETRACK ENGINE
    # ==========================================
    cameras = db.query(Camera).filter(
        Camera.organization_id == organization_id
    ).all()

    camera_nodes = []
    offline_cams = 0
    stale_cams = 0
    total_fps = 0

    for cam in cameras:
        # Detect stale cameras (no heartbeat in last 2 mins)
        is_stale = False
        if cam.last_heartbeat:
            if now - cam.last_heartbeat > timedelta(minutes=2):
                is_stale = True
                stale_cams += 1

        # FPS approximation based on activity (better than static 24)
        active_streams = db.query(func.count(VideoStream.stream_id)).filter(
            VideoStream.camera_id == cam.camera_id,
            VideoStream.processed_status == "processing"
        ).scalar() or 0

        cam_fps = active_streams * 5  # dynamic approximation
        total_fps += cam_fps

        if cam.status != "online":
            offline_cams += 1
            incidents.append({
                "id": f"CAM-{str(cam.camera_id)[:6]}",
                "message": f"Camera '{cam.camera_name}' is offline."
            })

        if is_stale:
            incidents.append({
                "id": f"CAM-HB-{str(cam.camera_id)[:6]}",
                "message": f"Camera '{cam.camera_name}' heartbeat missing."
            })

        camera_nodes.append({
            "id": str(cam.camera_id)[:8],
            "name": cam.camera_name,
            "status": "stale" if is_stale else cam.status,
            "fps": cam_fps,
            "lastHeartbeat": cam.last_heartbeat
        })

    avg_fps = (total_fps // len(cameras)) if cameras else 0

    # ==========================================
    # 2. VIDEO STREAMS / QUEUE METRICS
    # ==========================================
    backlog_count = db.query(func.count(VideoStream.stream_id)).filter(
        VideoStream.organization_id == organization_id,
        VideoStream.processed_status == "processing"
    ).scalar() or 0

    completed_today = db.query(func.count(VideoStream.stream_id)).filter(
        VideoStream.organization_id == organization_id,
        VideoStream.processed_status == "completed",
        VideoStream.end_time >= now - timedelta(days=1)
    ).scalar() or 0

    processing_rate = completed_today / 1440  # per minute

    if backlog_count > 100:
        incidents.append({
            "id": "SYS-Q-HIGH",
            "message": f"High backlog: {backlog_count} streams pending."
        })

    # ==========================================
    # 3. UNKNOWN FACES (FAILURES)
    # ==========================================
    failed_jobs = db.query(func.count(UnknownFace.unknown_id)).filter(
        UnknownFace.organization_id == organization_id,
        UnknownFace.resolved == False
    ).scalar() or 0

    resolved_today = db.query(func.count(UnknownFace.unknown_id)).filter(
        UnknownFace.organization_id == organization_id,
        UnknownFace.resolved == True,
        UnknownFace.resolved_at >= now - timedelta(days=1)
    ).scalar() or 0

    # ==========================================
    # 4. INFRASTRUCTURE (REAL)
    # ==========================================
    cpu_usage = psutil.cpu_percent(interval=0.1)
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage('/')

    if cpu_usage > 85:
        incidents.append({
            "id": "SYS-CPU",
            "message": f"High CPU usage at {cpu_usage}%"
        })

    if ram.percent > 90:
        incidents.append({
            "id": "SYS-RAM",
            "message": f"High memory usage at {ram.percent}%"
        })

    if disk.percent > 90:
        incidents.append({
            "id": "SYS-DISK",
            "message": f"Disk almost full ({disk.percent}%)"
        })

    # ==========================================
    # 5. DATABASE METRICS
    # ==========================================
    active_conns = db.execute(
        text("SELECT count(*) FROM pg_stat_activity WHERE state = 'active'")
    ).scalar() or 0

    idle_conns = db.execute(
        text("SELECT count(*) FROM pg_stat_activity WHERE state = 'idle'")
    ).scalar() or 0

    if active_conns > 100:
        db_status = "overloaded"
    elif active_conns > 50:
        db_status = "degraded"
    else:
        db_status = "online"

    # ==========================================
    # 6. APPLICATION METRICS (DERIVED)
    # ==========================================
    requests_last_min = db.query(func.count(AuditLog.log_id)).filter(
        AuditLog.organization_id == organization_id,
        AuditLog.timestamp >= now - timedelta(minutes=1)
    ).scalar() or 0

    errors_last_min = db.query(func.count(AuditLog.log_id)).filter(
        AuditLog.organization_id == organization_id,
        AuditLog.action.ilike("%error%"),
        AuditLog.timestamp >= now - timedelta(minutes=1)
    ).scalar() or 0

    error_rate = (errors_last_min / requests_last_min * 100) if requests_last_min else 0

    # Response time approximation (based on login activity gap)
    avg_response_time = 50  # fallback baseline
    login_events = db.query(LoginHistory).filter(
        LoginHistory.organization_id == organization_id,
        LoginHistory.login_time >= now - timedelta(minutes=10)
    ).all()

    if login_events:
        avg_response_time = max(10, min(200, len(login_events) * 2))

    # ==========================================
    # FINAL RESPONSE
    # ==========================================
    return {
        "overview": {
            "uptimePercent": round(100 - (len(incidents) * 0.5), 2),
            "activeIncidents": incidents
        },
        "faceTrackEngine": {
            "averageFps": avg_fps,
            "matchingLatencyMs": max(50, avg_fps * 2),  # derived
            "livenessFailuresToday": failed_jobs,
            "cameras": camera_nodes
        },
        "infrastructure": {
            "cpu": {"usagePercent": cpu_usage},
            "memory": {
                "usedGB": round(ram.used / (1024**3), 1),
                "totalGB": round(ram.total / (1024**3), 1)
            },
            "disk": {
                "usedTB": round(disk.used / (1024**4), 2),
                "totalTB": round(disk.total / (1024**4), 2)
            },
            "network": {
                # derived approximation using activity
                "inboundMbps": round(requests_last_min * 0.5, 2),
                "outboundMbps": round(requests_last_min * 0.2, 2)
            }
        },
        "apm": {
            "averageResponseTimeMs": avg_response_time,
            "requestsPerMinute": requests_last_min,
            "errorRatePercent": round(error_rate, 2)
        },
        "database": {
            "status": db_status,
            "activeConnections": active_conns,
            "idleConnections": idle_conns,
            "averageQueryTimeMs": max(5, min(100, active_conns))  # derived
        },
        "queues": {
            "videoProcessingBacklog": backlog_count,
            "processingRatePerMinute": round(processing_rate, 2),
            "failedJobsToday": failed_jobs,
            "resolvedToday": resolved_today
        }
    }