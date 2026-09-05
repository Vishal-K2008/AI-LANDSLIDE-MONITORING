from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.models.models import Location
from app.schemas.schemas import LocationResponse, LocationCreate

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.get("", response_model=List[LocationResponse])
def get_locations(
    risk_level: Optional[str] = Query(None, description="Filter by risk level: LOW, MODERATE, HIGH, CRITICAL"),
    search: Optional[str] = Query(None, description="Search by location name or district"),
    db: Session = Depends(get_db)
):
    query = db.query(Location)
    if risk_level:
        query = query.filter(Location.risk_level == risk_level.upper())
    if search:
        query = query.filter(
            (Location.name.ilike(f"%{search}%")) | (Location.district.ilike(f"%{search}%"))
        )
    return query.all()

@router.get("/{location_id}", response_model=LocationResponse)
def get_location_by_id(location_id: int, db: Session = Depends(get_db)):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    return loc

@router.post("", response_model=LocationResponse)
def create_location(location_in: LocationCreate, db: Session = Depends(get_db)):
    new_loc = Location(**location_in.model_dump())
    db.add(new_loc)
    db.commit()
    db.refresh(new_loc)
    return new_loc
