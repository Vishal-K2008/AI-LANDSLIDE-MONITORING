from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.models.models import Alert, Location
from app.schemas.schemas import AlertResponse, AlertCreate

router = APIRouter(prefix="/alerts", tags=["Early Warning Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(
    is_active: Optional[bool] = Query(True, description="Get active or dismissed alerts"),
    db: Session = Depends(get_db)
):
    alerts = (
        db.query(Alert)
        .filter(Alert.is_active == is_active)
        .order_by(Alert.created_at.desc())
        .all()
    )
    result = []
    for a in alerts:
        res_dict = AlertResponse.model_validate(a)
        res_dict.location_name = a.location.name if a.location else "Unknown Location"
        result.append(res_dict)
    return result

@router.post("", response_model=AlertResponse)
def create_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    loc = db.query(Location).filter(Location.id == alert_in.location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    new_alert = Alert(
        location_id=alert_in.location_id,
        alert_level=alert_in.alert_level.upper(),
        title=alert_in.title,
        description=alert_in.description,
        reason=alert_in.reason,
        recommended_action=alert_in.recommended_action,
        is_active=True
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    
    res = AlertResponse.model_validate(new_alert)
    res.location_name = loc.name
    return res

@router.patch("/{alert_id}/dismiss", response_model=AlertResponse)
def dismiss_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_active = False
    db.commit()
    db.refresh(alert)
    res = AlertResponse.model_validate(alert)
    res.location_name = alert.location.name if alert.location else "Unknown Location"
    return res
