import sys
import os

# Ensure backend root directory is in PYTHONPATH for Vercel serverless imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base, SessionLocal
from app.database.seed_data import seed_database
from app.api import auth, locations, environmental, risk, citizen_reports, alerts, dashboard, simulation

# Create DB tables
Base.metadata.create_all(bind=engine)

# Populate seed data on first run
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="AI-Based Early Warning & Landslide Risk Monitoring System",
    description="Geospatial landslide hazard evaluation, AI probability analysis, environmental telemetry, citizen hazard reporting, and early warning alert system.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api/v1
app.include_router(auth.router, prefix="/api/v1")
app.include_router(locations.router, prefix="/api/v1")
app.include_router(environmental.router, prefix="/api/v1")
app.include_router(risk.router, prefix="/api/v1")
app.include_router(citizen_reports.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(simulation.router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "system": "AI-Based Early Warning & Landslide Risk Monitoring System",
        "status": "Online & Operational",
        "api_docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy"}
