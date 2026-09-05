from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class UserBase(BaseModel):
    username: str
    email: str
    role: str = "citizen"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Location Schemas
class LocationBase(BaseModel):
    name: str
    district: str
    state: str = "Tamil Nadu"
    latitude: float
    longitude: float
    elevation_m: float
    slope_deg: float

class LocationCreate(LocationBase):
    pass

class LocationResponse(LocationBase):
    id: int
    risk_level: str
    risk_probability: float
    last_updated: datetime
    class Config:
        from_attributes = True


# Environmental Data Schemas
class EnvironmentalDataBase(BaseModel):
    rainfall_mm: float
    soil_moisture_pct: float
    slope_deg: float
    elevation_m: float
    temp_c: float = 22.0
    humidity_pct: float = 80.0
    weather_condition: str = "Heavy Rain"
    satellite_index: float = 0.75

class EnvironmentalDataCreate(EnvironmentalDataBase):
    location_id: int

class EnvironmentalDataResponse(EnvironmentalDataBase):
    id: int
    location_id: int
    timestamp: datetime
    class Config:
        from_attributes = True


# AI Risk Prediction & Simulation Input Schemas
class RiskPredictionRequest(BaseModel):
    rainfall_mm: float
    soil_moisture_pct: float
    slope_deg: float
    elevation_m: float
    temp_c: float = 22.0
    humidity_pct: float = 80.0

class RiskPredictionResponse(BaseModel):
    id: Optional[int] = None
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    risk_probability: float
    risk_level: str
    factor_rainfall: float
    factor_moisture: float
    factor_slope: float
    feature_importance: Dict[str, float]
    ai_explanation: str
    recommended_action: str
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# Risk History Schema
class RiskHistoryResponse(BaseModel):
    id: int
    location_id: int
    risk_probability: float
    risk_level: str
    timestamp: datetime
    class Config:
        from_attributes = True


# Citizen Report Schemas
class CitizenReportBase(BaseModel):
    reporter_name: str = "Anonymous Citizen"
    location_name: str
    latitude: float
    longitude: float
    report_type: str
    description: str
    photo_url: Optional[str] = None

class CitizenReportCreate(CitizenReportBase):
    pass

class CitizenReportStatusUpdate(BaseModel):
    status: str # Pending, Verified, Rejected

class CitizenReportResponse(CitizenReportBase):
    id: int
    user_id: Optional[int] = None
    status: str
    created_at: datetime
    class Config:
        from_attributes = True


# Alert Schemas
class AlertBase(BaseModel):
    location_id: int
    alert_level: str
    title: str
    description: str
    reason: str
    recommended_action: str

class AlertCreate(AlertBase):
    pass

class AlertResponse(AlertBase):
    id: int
    is_active: bool
    created_at: datetime
    location_name: Optional[str] = None
    class Config:
        from_attributes = True


# Dashboard Statistics Schema
class DashboardStatisticsResponse(BaseModel):
    total_locations: int
    high_risk_locations: int
    critical_risk_locations: int
    active_alerts: int
    total_citizen_reports: int
    pending_citizen_reports: int
    average_risk_probability: float
    overall_system_status: str
