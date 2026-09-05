from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.models import Location, Alert, CitizenReport
from app.schemas.schemas import DashboardStatisticsResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard Statistics"])

@router.get("/statistics", response_model=DashboardStatisticsResponse)
def get_dashboard_statistics(db: Session = Depends(get_db)):
    total_locations = db.query(Location).count()
    high_risk = db.query(Location).filter(Location.risk_level == "HIGH").count()
    critical_risk = db.query(Location).filter(Location.risk_level == "CRITICAL").count()
    
    active_alerts = db.query(Alert).filter(Alert.is_active == True).count()
    total_reports = db.query(CitizenReport).count()
    pending_reports = db.query(CitizenReport).filter(CitizenReport.status == "Pending").count()
    
    avg_risk = db.query(func.avg(Location.risk_probability)).scalar() or 0.0

    if critical_risk > 0:
        system_status = "CRITICAL LANDSLIDE WARNING"
    elif high_risk > 0:
        system_status = "ELEVATED RISK - ACTIVE ALERTS"
    else:
        system_status = "STABLE MONITORING STATUS"

    return {
        "total_locations": total_locations,
        "high_risk_locations": high_risk,
        "critical_risk_locations": critical_risk,
        "active_alerts": active_alerts,
        "total_citizen_reports": total_reports,
        "pending_citizen_reports": pending_reports,
        "average_risk_probability": round(float(avg_risk), 4),
        "overall_system_status": system_status
    }
