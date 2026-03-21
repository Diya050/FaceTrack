from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.system_health_service import get_system_health
from app.schemas.system_health_schema import SystemHealthResponse
# Import your specific dependency here
from app.core.dependencies import get_org_id 

router = APIRouter()

@router.get("/system-health", response_model=SystemHealthResponse)
def api_get_system_health(
    db: Session = Depends(get_db),
    # The backend now extracts this from the Token or Session automatically
    organization_id: str = Depends(get_org_id) 
):
  
    return get_system_health(db, organization_id)