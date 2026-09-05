import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import Location, EnvironmentalData, RiskPrediction, RiskHistory
from app.schemas.schemas import RiskPredictionResponse, RiskPredictionRequest, RiskHistoryResponse
from app.ml.risk_model import risk_ai_engine

router = APIRouter(tags=["AI Risk Analysis"])

@router.get("/risk/{location_id}", response_model=RiskPredictionResponse)
def get_location_risk(location_id: int, db: Session = Depends(get_db)):
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    env = (
        db.query(EnvironmentalData)
        .filter(EnvironmentalData.location_id == location_id)
        .order_by(EnvironmentalData.timestamp.desc())
        .first()
    )
    
    rainfall = env.rainfall_mm if env else 50.0
    moisture = env.soil_moisture_pct if env else 60.0
    slope = location.slope_deg
    elevation = location.elevation_m
    temp = env.temp_c if env else 20.0
    humidity = env.humidity_pct if env else 80.0

    prediction = risk_ai_engine.predict_risk(
        rainfall_mm=rainfall,
        soil_moisture_pct=moisture,
        slope_deg=slope,
        elevation_m=elevation,
        temp_c=temp,
        humidity_pct=humidity
    )
    prediction["location_id"] = location.id
    prediction["location_name"] = location.name
    return prediction

@router.post("/risk/predict", response_model=RiskPredictionResponse)
def run_custom_risk_prediction(data: RiskPredictionRequest):
    """
    ML Playground endpoint: Pass any custom rainfall, moisture, slope parameters 
    to evaluate the AI model in real time.
    """
    prediction = risk_ai_engine.predict_risk(
        rainfall_mm=data.rainfall_mm,
        soil_moisture_pct=data.soil_moisture_pct,
        slope_deg=data.slope_deg,
        elevation_m=data.elevation_m,
        temp_c=data.temp_c,
        humidity_pct=data.humidity_pct
    )
    return prediction

@router.get("/risk-history/{location_id}", response_model=List[RiskHistoryResponse])
def get_location_risk_history(location_id: int, limit: int = 24, db: Session = Depends(get_db)):
    records = (
        db.query(RiskHistory)
        .filter(RiskHistory.location_id == location_id)
        .order_by(RiskHistory.timestamp.desc())
        .limit(limit)
        .all()
    )
    return list(reversed(records))
