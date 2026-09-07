from datetime import datetime, timedelta
import random
import hashlib
from sqlalchemy.orm import Session
from app.models.models import Location, EnvironmentalData, RiskPrediction, RiskHistory, CitizenReport, Alert, User
from app.ml.risk_model import risk_ai_engine

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

SAMPLE_LOCATIONS = [
    {
        "name": "Shillong - Sohra (Cherrapunji) Highway",
        "district": "East Khasi Hills",
        "state": "Meghalaya",
        "latitude": 25.2744,
        "longitude": 91.7323,
        "elevation_m": 1484,
        "slope_deg": 36.5,
        "rainfall_mm": 125.5,
        "soil_moisture_pct": 88.0,
        "temp_c": 16.5,
        "humidity_pct": 94.0,
        "weather_condition": "Torrential Downpour"
    },
    {
        "name": "Gangtok - Nathula Pass Highway",
        "district": "East Sikkim",
        "state": "Sikkim",
        "latitude": 27.3389,
        "longitude": 88.6065,
        "elevation_m": 2300,
        "slope_deg": 38.0,
        "rainfall_mm": 110.0,
        "soil_moisture_pct": 86.5,
        "temp_c": 12.0,
        "humidity_pct": 91.0,
        "weather_condition": "Extreme Monsoonal Storm"
    },
    {
        "name": "Haflong - Jatinga Valley Pass",
        "district": "Dima Hasao",
        "state": "Assam",
        "latitude": 25.1764,
        "longitude": 93.0159,
        "elevation_m": 960,
        "slope_deg": 32.0,
        "rainfall_mm": 92.0,
        "soil_moisture_pct": 81.5,
        "temp_c": 21.0,
        "humidity_pct": 88.0,
        "weather_condition": "Heavy Monsoonal Rain"
    },
    {
        "name": "Kohima - Pfutseru Ghat Road",
        "district": "Kohima",
        "state": "Nagaland",
        "latitude": 25.6751,
        "longitude": 94.1086,
        "elevation_m": 1444,
        "slope_deg": 28.5,
        "rainfall_mm": 68.0,
        "soil_moisture_pct": 71.0,
        "temp_c": 18.0,
        "humidity_pct": 82.0,
        "weather_condition": "Moderate Continuous Rain"
    },
    {
        "name": "Aizawl - Hunthar Veng Slope",
        "district": "Aizawl",
        "state": "Mizoram",
        "latitude": 23.7307,
        "longitude": 92.7176,
        "elevation_m": 1132,
        "slope_deg": 34.0,
        "rainfall_mm": 82.0,
        "soil_moisture_pct": 77.0,
        "temp_c": 20.0,
        "humidity_pct": 86.0,
        "weather_condition": "Heavy Rain"
    },
    {
        "name": "Noney - Tupul Railway Cutting Zone",
        "district": "Noney",
        "state": "Manipur",
        "latitude": 24.8183,
        "longitude": 93.6324,
        "elevation_m": 780,
        "slope_deg": 29.0,
        "rainfall_mm": 45.0,
        "soil_moisture_pct": 58.0,
        "temp_c": 23.0,
        "humidity_pct": 76.0,
        "weather_condition": "Light Showers"
    },
    {
        "name": "Itanagar - Naharlagun Hill Road",
        "district": "Papum Pare",
        "state": "Arunachal Pradesh",
        "latitude": 27.0844,
        "longitude": 93.6053,
        "elevation_m": 750,
        "slope_deg": 25.0,
        "rainfall_mm": 26.0,
        "soil_moisture_pct": 42.0,
        "temp_c": 24.5,
        "humidity_pct": 70.0,
        "weather_condition": "Partly Cloudy"
    },
    {
        "name": "Tawang - Sela Pass Highway",
        "district": "Tawang",
        "state": "Arunachal Pradesh",
        "latitude": 27.5861,
        "longitude": 91.8594,
        "elevation_m": 3048,
        "slope_deg": 22.0,
        "rainfall_mm": 14.0,
        "soil_moisture_pct": 35.0,
        "temp_c": 8.5,
        "humidity_pct": 64.0,
        "weather_condition": "Clear Sky & Cold Mist"
    }
]

def seed_database(db: Session):
    # Check if locations already exist
    if db.query(Location).first():
        print("Database already contains seed data. Skipping initialization.")
        return

    print("Seeding database with Northeast India landslide monitoring dataset...")

    # 1. Create Default Users (Admin & Citizen)
    admin_user = User(
        username="admin",
        email="admin@landslide-warning.gov.in",
        hashed_password=hash_password("admin123"),
        role="admin"
    )
    citizen_user = User(
        username="citizen_user",
        email="citizen@tn.gov.in",
        hashed_password=hash_password("citizen123"),
        role="citizen"
    )
    db.add_all([admin_user, citizen_user])
    db.commit()
    db.refresh(admin_user)
    db.refresh(citizen_user)

    now = datetime.utcnow()

    # 2. Add Monitored Locations & Environmental Telemetry Records
    for loc_info in SAMPLE_LOCATIONS:
        # Run AI prediction for initial metrics
        pred = risk_ai_engine.predict_risk(
            rainfall_mm=loc_info["rainfall_mm"],
            soil_moisture_pct=loc_info["soil_moisture_pct"],
            slope_deg=loc_info["slope_deg"],
            elevation_m=loc_info["elevation_m"],
            temp_c=loc_info["temp_c"],
            humidity_pct=loc_info["humidity_pct"]
        )

        location = Location(
            name=loc_info["name"],
            district=loc_info["district"],
            state=loc_info["state"],
            latitude=loc_info["latitude"],
            longitude=loc_info["longitude"],
            elevation_m=loc_info["elevation_m"],
            slope_deg=loc_info["slope_deg"],
            risk_level=pred["risk_level"],
            risk_probability=pred["risk_probability"],
            last_updated=now
        )
        db.add(location)
        db.commit()
        db.refresh(location)

        # Current Environmental Data Point
        env_current = EnvironmentalData(
            location_id=location.id,
            rainfall_mm=loc_info["rainfall_mm"],
            soil_moisture_pct=loc_info["soil_moisture_pct"],
            slope_deg=loc_info["slope_deg"],
            elevation_m=loc_info["elevation_m"],
            temp_c=loc_info["temp_c"],
            humidity_pct=loc_info["humidity_pct"],
            weather_condition=loc_info["weather_condition"],
            satellite_index=round(loc_info["soil_moisture_pct"] / 100.0, 2),
            timestamp=now
        )
        db.add(env_current)

        # Store AI Risk Prediction entry
        import json
        prediction_entry = RiskPrediction(
            location_id=location.id,
            risk_probability=pred["risk_probability"],
            risk_level=pred["risk_level"],
            factor_rainfall=pred["factor_rainfall"],
            factor_moisture=pred["factor_moisture"],
            factor_slope=pred["factor_slope"],
            feature_importance_json=json.dumps(pred["feature_importance"]),
            ai_explanation=pred["ai_explanation"],
            recommended_action=pred["recommended_action"],
            created_at=now
        )
        db.add(prediction_entry)

        # Generate 7-day Historical Data (Rainfall, Soil moisture, and Risk probability over time)
        for i in range(14, 0, -1):
            past_time = now - timedelta(hours=i * 12)
            # Simulate historical variation trend leading up to current rain
            rain_val = max(0.0, loc_info["rainfall_mm"] * (1.0 - (i * 0.06) + random.uniform(-0.1, 0.1)))
            moist_val = max(10.0, min(95.0, loc_info["soil_moisture_pct"] * (1.0 - (i * 0.04) + random.uniform(-0.05, 0.05))))
            
            hist_pred = risk_ai_engine.predict_risk(
                rainfall_mm=rain_val,
                soil_moisture_pct=moist_val,
                slope_deg=loc_info["slope_deg"],
                elevation_m=loc_info["elevation_m"],
                temp_c=loc_info["temp_c"] + random.uniform(-2, 2),
                humidity_pct=min(99.0, loc_info["humidity_pct"] + random.uniform(-5, 5))
            )

            env_hist = EnvironmentalData(
                location_id=location.id,
                rainfall_mm=round(rain_val, 1),
                soil_moisture_pct=round(moist_val, 1),
                slope_deg=loc_info["slope_deg"],
                elevation_m=loc_info["elevation_m"],
                temp_c=round(loc_info["temp_c"] + random.uniform(-1, 1), 1),
                humidity_pct=round(loc_info["humidity_pct"] + random.uniform(-3, 3), 1),
                weather_condition="Monsoon Shower" if rain_val > 40 else "Overcast",
                satellite_index=round(moist_val / 100.0, 2),
                timestamp=past_time
            )
            db.add(env_hist)

            risk_h = RiskHistory(
                location_id=location.id,
                risk_probability=hist_pred["risk_probability"],
                risk_level=hist_pred["risk_level"],
                timestamp=past_time
            )
            db.add(risk_h)

        # 3. Create Early Warning Alerts for High / Critical Locations
        if pred["risk_level"] in ["HIGH", "CRITICAL"]:
            alert = Alert(
                location_id=location.id,
                alert_level=pred["risk_level"],
                title=f"⚠️ {pred['risk_level']} LANDSLIDE WARNING - {location.name}",
                description=f"Automated AI sensors detected severe saturation and rain intensity at {location.name}. High risk of soil slip within next 6 to 12 hours.",
                reason=f"Rainfall: {loc_info['rainfall_mm']} mm | Moisture: {loc_info['soil_moisture_pct']}% | Slope: {loc_info['slope_deg']}°",
                recommended_action=pred["recommended_action"],
                is_active=True,
                created_at=now - timedelta(minutes=45)
            )
            db.add(alert)

    # 4. Create Initial Citizen Reports
    reports = [
        CitizenReport(
            user_id=citizen_user.id,
            reporter_name="Tenzing Sangma",
            location_name="Shillong - Sohra Highway KM 22",
            latitude=25.2850,
            longitude=91.7380,
            report_type="ground_cracks",
            description="Noticed deep longitudinal cracks appearing on the asphalt near the road shoulder following continuous rain this morning.",
            photo_url="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80",
            status="Verified",
            created_at=now - timedelta(hours=2)
        ),
        CitizenReport(
            user_id=citizen_user.id,
            reporter_name="Pemba Lepcha",
            location_name="Gangtok - Nathula Highway Bend 7",
            latitude=27.3420,
            longitude=88.6120,
            report_type="rockfall",
            description="Boulders and loose gravel tumbled down the cutting slope blocking half of the northbound lane.",
            photo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            status="Pending",
            created_at=now - timedelta(minutes=50)
        ),
        CitizenReport(
            user_id=citizen_user.id,
            reporter_name="Lalremruata Zofa",
            location_name="Aizawl Hunthar Slope Pass",
            latitude=23.7350,
            longitude=92.7210,
            report_type="water_accumulation",
            description="Water overflowing from clogged hillside culverts is flooding embankment foundations.",
            photo_url="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
            status="Verified",
            created_at=now - timedelta(hours=5)
        )
    ]
    db.add_all(reports)
    db.commit()
    print("Database seeding completed successfully!")
