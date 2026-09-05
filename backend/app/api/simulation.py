from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import random
from app.database.database import get_db
from app.models.models import Location, EnvironmentalData, Alert, RiskHistory, RiskPrediction
from app.ml.risk_model import risk_ai_engine

router = APIRouter(prefix="/simulation", tags=["Real-time Weather Simulation Engine"])

@router.post("/trigger-rain")
def trigger_simulated_rain_storm(db: Session = Depends(get_db)):
    """
    Simulates a sudden heavy monsoon cloudburst event across vulnerable high-slope locations.
    Recalculates ML predictions, updates environmental sensors, and generates emergency alerts.
    """
    locations = db.query(Location).all()
    updated_locations = []
    now = datetime.utcnow()

    for loc in locations:
        # Increase rainfall and moisture randomly to simulate heavy storm
        added_rain = random.uniform(35.0, 75.0)
        added_moisture = random.uniform(15.0, 30.0)

        # Get latest telemetry
        latest_env = (
            db.query(EnvironmentalData)
            .filter(EnvironmentalData.location_id == loc.id)
            .order_by(EnvironmentalData.timestamp.desc())
            .first()
        )
        
        new_rain = round(latest_env.rainfall_mm + added_rain if latest_env else added_rain, 1)
        new_moist = min(98.0, round(latest_env.soil_moisture_pct + added_moisture if latest_env else 75.0, 1))

        # Run AI prediction
        pred = risk_ai_engine.predict_risk(
            rainfall_mm=new_rain,
            soil_moisture_pct=new_moist,
            slope_deg=loc.slope_deg,
            elevation_m=loc.elevation_m,
            temp_c=15.0,
            humidity_pct=96.0
        )

        # Update Location DB record
        loc.risk_level = pred["risk_level"]
        loc.risk_probability = pred["risk_probability"]
        loc.last_updated = now

        # Insert new Environmental Data Point
        new_env = EnvironmentalData(
            location_id=loc.id,
            rainfall_mm=new_rain,
            soil_moisture_pct=new_moist,
            slope_deg=loc.slope_deg,
            elevation_m=loc.elevation_m,
            temp_c=15.0,
            humidity_pct=96.0,
            weather_condition="Severe Cloudburst Storm (Simulated)",
            satellite_index=round(new_moist / 100.0, 2),
            timestamp=now
        )
        db.add(new_env)

        # Insert Risk History entry
        rh = RiskHistory(
            location_id=loc.id,
            risk_probability=pred["risk_probability"],
            risk_level=pred["risk_level"],
            timestamp=now
        )
        db.add(rh)

        # If risk became HIGH or CRITICAL, create active alert
        if pred["risk_level"] in ["HIGH", "CRITICAL"]:
            new_alert = Alert(
                location_id=loc.id,
                alert_level=pred["risk_level"],
                title=f"⚠️ SIMULATED EMERGENCY ALERT - {loc.name}",
                description=f"Simulated cloudburst detected! Rainfall reached {new_rain} mm with soil moisture at {new_moist}%. Instantaneous risk probability evaluated at {int(pred['risk_probability']*100)}%.",
                reason=f"Extreme precipitation ({new_rain} mm) on {loc.slope_deg}° slope.",
                recommended_action=pred["recommended_action"],
                is_active=True,
                created_at=now
            )
            db.add(new_alert)

        updated_locations.append({
            "id": loc.id,
            "name": loc.name,
            "new_rainfall_mm": new_rain,
            "new_moisture_pct": new_moist,
            "new_risk_level": pred["risk_level"],
            "new_probability": pred["risk_probability"]
        })

    db.commit()
    return {
        "message": "Heavy monsoon downpour simulation executed successfully across all monitored sensors.",
        "simulated_locations": updated_locations
    }

@router.post("/reset")
def reset_simulation_to_baseline(db: Session = Depends(get_db)):
    """
    Resets environmental sensors back to baseline normal weather.
    """
    locations = db.query(Location).all()
    now = datetime.utcnow()

    for loc in locations:
        normal_rain = round(random.uniform(5.0, 25.0), 1)
        normal_moist = round(random.uniform(25.0, 45.0), 1)

        pred = risk_ai_engine.predict_risk(
            rainfall_mm=normal_rain,
            soil_moisture_pct=normal_moist,
            slope_deg=loc.slope_deg,
            elevation_m=loc.elevation_m,
            temp_c=22.0,
            humidity_pct=65.0
        )

        loc.risk_level = pred["risk_level"]
        loc.risk_probability = pred["risk_probability"]
        loc.last_updated = now

        new_env = EnvironmentalData(
            location_id=loc.id,
            rainfall_mm=normal_rain,
            soil_moisture_pct=normal_moist,
            slope_deg=loc.slope_deg,
            elevation_m=loc.elevation_m,
            temp_c=22.0,
            humidity_pct=65.0,
            weather_condition="Clear / Mild Overcast",
            satellite_index=round(normal_moist / 100.0, 2),
            timestamp=now
        )
        db.add(new_env)

    # Deactivate existing alerts
    db.query(Alert).update({"is_active": False})
    db.commit()

    return {"message": "All sensor telemetry reset back to baseline low-risk environmental conditions."}
