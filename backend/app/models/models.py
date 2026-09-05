from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="citizen") # "admin" or "citizen"
    created_at = Column(DateTime, default=datetime.utcnow)

    reports = relationship("CitizenReport", back_populates="reporter")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=False)
    state = Column(String, default="Tamil Nadu")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, nullable=False)
    slope_deg = Column(Float, nullable=False)
    risk_level = Column(String, default="LOW") # LOW, MODERATE, HIGH, CRITICAL
    risk_probability = Column(Float, default=0.1) # 0.0 to 1.0
    last_updated = Column(DateTime, default=datetime.utcnow)

    environmental_records = relationship("EnvironmentalData", back_populates="location", cascade="all, delete-orphan")
    risk_predictions = relationship("RiskPrediction", back_populates="location", cascade="all, delete-orphan")
    risk_history = relationship("RiskHistory", back_populates="location", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="location", cascade="all, delete-orphan")


class EnvironmentalData(Base):
    __tablename__ = "environmental_data"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    soil_moisture_pct = Column(Float, nullable=False)
    slope_deg = Column(Float, nullable=False)
    elevation_m = Column(Float, nullable=False)
    temp_c = Column(Float, default=22.0)
    humidity_pct = Column(Float, default=80.0)
    weather_condition = Column(String, default="Heavy Rain")
    satellite_index = Column(Float, default=0.75) # Normalized Difference Vegetation / Moisture Index
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    location = relationship("Location", back_populates="environmental_records")


class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    risk_probability = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    factor_rainfall = Column(Float, nullable=False)
    factor_moisture = Column(Float, nullable=False)
    factor_slope = Column(Float, nullable=False)
    feature_importance_json = Column(Text, nullable=True) # JSON string of feature weights
    ai_explanation = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    location = relationship("Location", back_populates="risk_predictions")


class RiskHistory(Base):
    __tablename__ = "risk_history"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    risk_probability = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    location = relationship("Location", back_populates="risk_history")


class CitizenReport(Base):
    __tablename__ = "citizen_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reporter_name = Column(String, nullable=False, default="Anonymous Citizen")
    location_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    report_type = Column(String, nullable=False) # ground_cracks, rockfall, water_accumulation, soil_movement, landslide, other
    description = Column(Text, nullable=False)
    photo_url = Column(String, nullable=True)
    status = Column(String, default="Pending") # Pending, Verified, Rejected
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter = relationship("User", back_populates="reports")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    alert_level = Column(String, nullable=False) # LOW, MODERATE, HIGH, CRITICAL
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    location = relationship("Location", back_populates="alerts")
