from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import EnvironmentalData, Location
from app.schemas.schemas import EnvironmentalDataResponse

router = APIRouter(prefix="/environmental-data", tags=["Environmental Data"])

@router.get("/{location_id}", response_model=EnvironmentalDataResponse)
def get_latest_environmental_data(location_id: int, db: Session = Depends(get_db)):
    record = (
        db.query(EnvironmentalData)
        .filter(EnvironmentalData.location_id == location_id)
        .order_by(EnvironmentalData.timestamp.desc())
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="No environmental records found for this location")
    return record

@router.get("/{location_id}/history", response_model=List[EnvironmentalDataResponse])
def get_environmental_data_history(location_id: int, limit: int = 30, db: Session = Depends(get_db)):
    records = (
        db.query(EnvironmentalData)
        .filter(EnvironmentalData.location_id == location_id)
        .order_by(EnvironmentalData.timestamp.desc())
        .limit(limit)
        .all()
    )
    # Return chronologically ascending for charts
    return list(reversed(records))
