# AI-Based Early Warning & Landslide Risk Monitoring System

TerraGuard AI is a full-stack, enterprise-grade disaster management and geospatial landslide risk prediction platform. Designed for vulnerable hill regions (focusing on Northeast India sample data), it combines real-time hydro-meteorological sensor telemetry, geospatial mapping, Scikit-Learn Machine Learning risk inference, natural language AI explainability, citizen hazard reporting, and early warning emergency alerts.

---

## 🌟 Key Features

1. **Main Dashboard**:
   - Live KPI overview (Overall risk probability %, Rainfall mm, Soil Moisture %, Slope angle °, Elevation m, Weather condition).
   - Visually distinct indicators (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
   - Animated glassmorphism cards and real-time alert banners.

2. **Interactive Geospatial Risk Map (Leaflet)**:
   - Fullscreen Leaflet map displaying Northeast India locations (Shillong, Gangtok, Haflong, Kohima, Aizawl, Noney, Itanagar, Tawang).
   - Color-coded risk pins (Green = Low, Yellow = Moderate, Red = High, Maroon = Critical).
   - Dynamic risk buffer zones and citizen report markers.
   - Interactive search bar and popup detail cards with direct link to AI Explainability.

3. **Environmental Hydro-Telemetry**:
   - Live sensor telemetry (Rainfall intensity mm, Soil moisture saturation %, Slope incline °, Elevation m, Temp °C, Humidity %, Satellite NDMI Index).
   - Multi-axis interactive historical trend charts powered by Recharts.

4. **AI / Machine Learning Analysis & Playground**:
   - Random Forest Classifier & Regressor trained on domain-specific geotechnical & meteorological parameters.
   - Interactive ML Simulator with sliders for Rainfall, Soil Moisture, Slope, and Elevation.
   - Tree-based feature importance weight distribution bars.

5. **Natural Language "AI Explanation"**:
   - Converts raw probability values into plain-English explainable summaries.
   - Example: *"This location currently has a HIGH landslide risk because of heavy rainfall (94 mm), high soil moisture (84%), and a steep slope (36.5°). The combination of these factors has increased the predicted failure probability to 87%."*

6. **Risk Evolution & Stepper Timeline**:
   - Progression timeline (`LOW` → `MODERATE` → `HIGH`).
   - 24-hour and 7-day risk probability comparison line charts.

7. **Early Warning Alert System**:
   - Categorized alert levels (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
   - Toast & top banner alerts with recommended preventive actions (evacuation guidelines, road traffic diversions).
   - Admin emergency broadcast modal.

8. **Citizen Hazard Reporting**:
   - Public reporting module for ground cracks, rockfalls, water accumulation, soil movement, or landslides.
   - Photo URL preview, GPS coordinates, and status tracking (`Pending` / `Verified` / `Rejected`).

9. **Admin Command Center**:
   - System stats (Monitored locations count, High risk count, Active alerts, Pending citizen reports, Avg risk probability).
   - Citizen report approval/rejection workflow.
   - Real-time weather storm simulation trigger ("⛈️ Simulate Monsoon Storm") to test automated risk recalculations and alerts live!

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Glassmorphism design system + Lucide Icons
- **Mapping**: Leaflet + React-Leaflet + OpenStreetMap
- **Data Visualization**: Recharts
- **API Client**: Axios with resilient offline fallback mock service

### Backend
- **Framework**: Python FastAPI + Uvicorn
- **Database**: SQLAlchemy ORM (SQLite for zero-config local execution, supporting PostgreSQL via `DATABASE_URL`)
- **Machine Learning**: Scikit-Learn (Random Forest Ensemble Model) + NumPy + Pandas
- **Security**: SHA-256 Hashing + JWT Token Authentication

---

## 📁 Project Structure

```text
/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Sidebar, RiskMap, RiskCard, AIExplanationModal...)
│   │   ├── pages/            # View pages (Dashboard, RiskMap, Environmental, AIAnalysis, RiskTrend, EarlyWarning...)
│   │   ├── services/         # Axios API client with offline fallback
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Application root & modal routing
│   │   ├── main.tsx          # React DOM entrypoint
│   │   └── index.css         # Tailwind & custom CSS styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/              # REST API routers (auth, locations, environmental, risk, citizen_reports, alerts, dashboard, simulation)
│   │   ├── database/         # Database engine & seed data script
│   │   ├── ml/               # Scikit-learn ML model & AI explainer service
│   │   ├── models/           # SQLAlchemy DB models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── main.py           # FastAPI application entry point
│   ├── requirements.txt
│   └── landslide_monitor.db  # SQLite database (auto-seeded on first run)
│
├── .env.example
└── README.md
```

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.9+)

### 1. Run Backend Server
```bash
cd backend
python -m venv venv

# On Windows PowerShell:
.\venv\Scripts\activate

# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- OpenAPI Documentation will be available at: `http://localhost:8000/docs`

### 2. Run Frontend Web App
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Open browser at: `http://localhost:3000`

---

## 🧪 Testing Weather Updates Live

1. Open the application dashboard.
2. Click the **"⛈️ Simulate Monsoon Storm"** button in the top navigation bar or Admin Command Center.
3. Observe how:
   - Environmental rainfall and soil moisture values escalate across sensors.
   - Scikit-Learn AI recalculates landslide probabilities instantaneously.
   - Interactive map pins shift dynamically to High (Red) or Critical (Maroon).
   - Early warning alert banners flash automatically across the screen.

---

## 📝 API Endpoints Summary

- `GET /api/v1/health`: Server status health check
- `GET /api/v1/dashboard/statistics`: Overall system summary stats
- `GET /api/v1/locations`: List monitored locations & filter by risk level
- `GET /api/v1/environmental-data/{location_id}`: Latest sensor metrics
- `GET /api/v1/environmental-data/{location_id}/history`: 24-hour time series
- `GET /api/v1/risk/{location_id}`: AI ML risk prediction & natural language explanation
- `POST /api/v1/risk/predict`: Interactive ML simulator custom input prediction
- `GET /api/v1/citizen-reports`: Get public hazard reports
- `POST /api/v1/citizen-reports`: Submit ground crack or rockfall report
- `PATCH /api/v1/citizen-reports/{id}/status`: Admin report verification (Approve/Reject)
- `GET /api/v1/alerts`: Active early warning emergency alerts
- `POST /api/v1/simulation/trigger-rain`: Simulate monsoon cloudburst rain event
