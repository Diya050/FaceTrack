from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from typing import List, Dict, Any
from uuid import UUID

from app.models.system import AuditLog
from app.models.core import User


class AuditLogService:

    @staticmethod
    def get_audit_logs(
        db: Session,
        organization_id: UUID,
        limit: int = 50,
        skip: int = 0,
        role_name: str = None,
        department_id: UUID = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch audit logs for an organization.
        - HR_ADMIN: sees all organization logs
        - ADMIN: sees only logs from their department
        """
        query = db.query(AuditLog)\
            .filter(AuditLog.organization_id == organization_id)\
            .options(joinedload(AuditLog.user))\
            .order_by(desc(AuditLog.timestamp))\
            .offset(skip)\
            .limit(limit)

        # Filter by department for ADMIN users
        if role_name == "ADMIN" and department_id:
            query = query.join(User, AuditLog.user_id == User.user_id, isouter=True)\
                    .filter(User.department_id == department_id)

        logs = query.all()
        
        formatted_logs = []
        for log in logs:
            user_name = log.user.full_name if log.user else "System"
            user_role = log.user.role.role_name if log.user and hasattr(log.user, "role") and log.user.role else "System"
            user_email = log.user.email if log.user else "system@facetrack.io"
            
            # Map action to category and severity
            category, severity = AuditLogService._categorize_action(log.action)
            resource, resource_id = AuditLogService._extract_resource(log.action, log.log_id)
            
            formatted_logs.append({
                "id": str(log.log_id),
                "timestamp": log.timestamp.isoformat() if log.timestamp else None,
                "actor": user_name,
                "actor_role": user_role,
                "email": user_email,
                "action": log.action,
                "category": category,
                "severity": severity,
                "resource": resource,
                "resource_id": resource_id,
                "ip": log.ip_address or "N/A",
                "details": f"{log.action.replace('_', ' ')} performed by {user_name}",
            })
        
        return formatted_logs

    @staticmethod
    def _categorize_action(action: str) -> tuple:
        """Map action to category and severity level."""
        action_map = {
            "LOGIN": ("auth", "info"),
            "LOGOUT": ("auth", "info"),
            "CREATE_USER": ("user", "info"),
            "UPDATE_USER": ("user", "warning"),
            "DELETE_USER": ("user", "critical"),
            "UPDATE_PERMISSIONS": ("user", "critical"),
            "CREATE_CAMERA": ("config", "info"),
            "UPDATE_CAMERA": ("config", "warning"),
            "DELETE_CAMERA": ("config", "critical"),
            "UPDATE_SETTINGS": ("config", "warning"),
            "UPDATE_RETENTION": ("config", "warning"),
            "CREATE_PROFILE": ("data", "info"),
            "VIEW_BIOMETRICS": ("data", "warning"),
            "DELETE_PROFILE": ("data", "critical"),
            "EXPORT_REPORT": ("data", "warning"),
            "UPDATE_PASSWORD": ("auth", "warning"),
            "ROLE_ASSIGNMENT": ("user", "critical"),
            "FACE_ENROLLMENT": ("data", "info"),
            "BACKUP_CREATED": ("system", "info"),
            "PURGE_LOGS": ("system", "warning"),
        }
        
        for key, (cat, sev) in action_map.items():
            if key in action:
                return cat, sev
        
        return "system", "info"

    @staticmethod
    def _extract_resource(action: str, log_id) -> tuple:
        """Extract resource type and ID from action."""
        resource_map = {
            "USER": "UserProfile",
            "CAMERA": "CameraStream",
            "PERMISSION": "Role",
            "PROFILE": "BiometricProfile",
            "SETTINGS": "Settings",
            "REPORT": "AttendanceReport",
            "BIOMETRIC": "BiometricProfile",
        }
        
        for key, resource in resource_map.items():
            if key in action:
                return resource, f"res-{str(log_id)[:8]}"
        
        return "System", f"sys-{str(log_id)[:8]}"

    @staticmethod
    def log_action(
        db: Session,
        user_id: UUID,
        action: str,
        organization_id: UUID,
        ip_address: str = None
    ) -> AuditLog:
        """Create a new audit log entry."""
        log = AuditLog(
            user_id=user_id,
            action=action,
            organization_id=organization_id,
            ip_address=ip_address
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log
