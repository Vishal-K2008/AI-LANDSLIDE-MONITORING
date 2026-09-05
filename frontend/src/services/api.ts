import axios from 'axios';
import { 
  Location, 
  EnvironmentalData, 
  RiskPrediction, 
  RiskHistoryPoint, 
  CitizenReport, 
  EarlyWarningAlert, 
  DashboardStats 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Fallback sample data in case backend API is connecting or starting up
const MOCK_LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'Ooty (Udhagamandalam) - Doddabetta Slope',
    district: 'Nilgiris',
    state: 'Tamil Nadu',
    latitude: 11.4102,
    longitude: 76.7356,
    elevation_m: 2637,
    slope_deg: 36.5,
    risk_level: 'HIGH',
    risk_probability: 0.87,
    last_updated: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Coonoor - Marthoma Nagar Ghat',
    district: 'Nilgiris',
    state: 'Tamil Nadu',
    latitude: 11.3530,
    longitude: 76.7959,
    elevation_m: 1850,
    slope_deg: 32.0,
    risk_level: 'HIGH',
    risk_probability: 0.79,
    last_updated: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Kodaikanal - Pillar Rocks Zone',
    district: 'Dindigul',
    state: 'Tamil Nadu',
    latitude: 10.2185,
    longitude: 77.4720,
    elevation_m: 2133,
    slope_deg: 38.0,
    risk_level: 'CRITICAL',
    risk_probability: 0.93,
    last_updated: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Valparai - Sholayar Catchment',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    latitude: 10.3262,
    longitude: 76.9554,
    elevation_m: 1193,
    slope_deg: 28.5,
    risk_level: 'MODERATE',
    risk_probability: 0.54,
    last_updated: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Kotagiri - Pandiar Hill Slope',
    district: 'Nilgiris',
    state: 'Tamil Nadu',
    latitude: 11.4243,
    longitude: 76.8837,
    elevation_m: 1793,
    slope_deg: 25.0,
    risk_level: 'LOW',
    risk_probability: 0.22,
    last_updated: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Kolli Hills - Semmedu Pass',
    district: 'Namakkal',
    state: 'Tamil Nadu',
    latitude: 11.2662,
    longitude: 78.3375,
    elevation_m: 1300,
    slope_deg: 29.0,
    risk_level: 'MODERATE',
    risk_probability: 0.48,
    last_updated: new Date().toISOString()
  },
  {
    id: 7,
    name: "Yercaud - Lady's Seat Curve",
    district: 'Salem',
    state: 'Tamil Nadu',
    latitude: 11.7753,
    longitude: 78.2093,
    elevation_m: 1515,
    slope_deg: 22.0,
    risk_level: 'LOW',
    risk_probability: 0.14,
    last_updated: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Megamalai - Highwavys Estate',
    district: 'Theni',
    state: 'Tamil Nadu',
    latitude: 9.6892,
    longitude: 77.3934,
    elevation_m: 1500,
    slope_deg: 34.0,
    risk_level: 'HIGH',
    risk_probability: 0.76,
    last_updated: new Date().toISOString()
  }
];

const MOCK_REPORTS: CitizenReport[] = [
  {
    id: 1,
    reporter_name: 'Karthik Subbaraj',
    location_name: 'Ooty - Coonoor Road KM 14',
    latitude: 11.3850,
    longitude: 76.7720,
    report_type: 'ground_cracks',
    description: 'Deep longitudinal cracks appearing on the asphalt near the road shoulder following continuous rain this morning.',
    photo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
    status: 'Verified',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 2,
    reporter_name: 'Priya Raman',
    location_name: 'Kodaikanal Ghat Road Bend 7',
    latitude: 10.2240,
    longitude: 77.4810,
    report_type: 'rockfall',
    description: 'Boulders and loose gravel tumbled down the cutting slope blocking half of the northbound lane.',
    photo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    status: 'Pending',
    created_at: new Date(Date.now() - 3600000 * 0.8).toISOString()
  },
  {
    id: 3,
    reporter_name: 'Muralidharan V.',
    location_name: 'Valparai Estate Pass',
    latitude: 10.3310,
    longitude: 76.9600,
    report_type: 'water_accumulation',
    description: 'Water overflowing from clogged hillside culverts is flooding embankment foundations.',
    photo_url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    status: 'Verified',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const MOCK_ALERTS: EarlyWarningAlert[] = [
  {
    id: 1,
    location_id: 3,
    location_name: 'Kodaikanal - Pillar Rocks Zone',
    alert_level: 'CRITICAL',
    title: '🚨 CRITICAL LANDSLIDE WARNING - Kodaikanal',
    description: 'Automated AI sensors detected severe saturation and storm intensity at Kodaikanal. Extreme risk of soil slip within next 6 hours.',
    reason: 'Rainfall: 115.0 mm | Soil Moisture: 91.0% | Slope: 38.0°',
    recommended_action: '🚨 IMMEDIATE EVACUATION RECOMMENDED: Issue emergency broadcast warnings and divert mountain road traffic.',
    is_active: true,
    created_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 2,
    location_id: 1,
    location_name: 'Ooty (Udhagamandalam) - Doddabetta Slope',
    alert_level: 'HIGH',
    title: '⚠️ HIGH LANDSLIDE RISK - Ooty Doddabetta',
    description: 'Heavy precipitation and elevated pore-water pressure detected. High probability of embankment failure.',
    reason: 'Rainfall: 94.5 mm | Soil Moisture: 84.0% | Slope: 36.5°',
    recommended_action: '⚠️ HIGH RISK ALERT: Restrict public access to vulnerable slope sectors and inspect drainage channels.',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export const api = {
  // Locations API
  async getLocations(riskLevel?: string, search?: string): Promise<Location[]> {
    try {
      const response = await client.get('/locations', { params: { risk_level: riskLevel, search } });
      return response.data;
    } catch {
      let filtered = [...MOCK_LOCATIONS];
      if (riskLevel) {
        filtered = filtered.filter(l => l.risk_level === riskLevel.toUpperCase());
      }
      if (search) {
        filtered = filtered.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.district.toLowerCase().includes(search.toLowerCase()));
      }
      return filtered;
    }
  },

  async getLocationById(id: number): Promise<Location> {
    try {
      const response = await client.get(`/locations/${id}`);
      return response.data;
    } catch {
      const loc = MOCK_LOCATIONS.find(l => l.id === id);
      return loc || MOCK_LOCATIONS[0];
    }
  },

  // Environmental Data API
  async getEnvironmentalData(locationId: number): Promise<EnvironmentalData> {
    try {
      const response = await client.get(`/environmental-data/${locationId}`);
      return response.data;
    } catch {
      const loc = MOCK_LOCATIONS.find(l => l.id === locationId) || MOCK_LOCATIONS[0];
      const isHigh = loc.risk_level === 'HIGH' || loc.risk_level === 'CRITICAL';
      return {
        id: locationId * 100,
        location_id: locationId,
        rainfall_mm: isHigh ? 92.5 : 28.0,
        soil_moisture_pct: isHigh ? 86.0 : 42.0,
        slope_deg: loc.slope_deg,
        elevation_m: loc.elevation_m,
        temp_c: 16.5,
        humidity_pct: 88.0,
        weather_condition: isHigh ? 'Heavy Torrential Downpour' : 'Moderate Overcast',
        satellite_index: isHigh ? 0.88 : 0.42,
        timestamp: new Date().toISOString()
      };
    }
  },

  async getEnvironmentalHistory(locationId: number): Promise<EnvironmentalData[]> {
    try {
      const response = await client.get(`/environmental-data/${locationId}/history`);
      return response.data;
    } catch {
      const loc = MOCK_LOCATIONS.find(l => l.id === locationId) || MOCK_LOCATIONS[0];
      const history: EnvironmentalData[] = [];
      const baseRain = loc.risk_level === 'HIGH' || loc.risk_level === 'CRITICAL' ? 90 : 25;
      
      for (let i = 12; i >= 0; i--) {
        const time = new Date(Date.now() - i * 3600000 * 2).toISOString();
        const rain = Math.max(0, baseRain * (1 - i * 0.05 + (Math.random() * 0.2 - 0.1)));
        history.push({
          id: locationId * 100 + i,
          location_id: locationId,
          rainfall_mm: Math.round(rain * 10) / 10,
          soil_moisture_pct: Math.min(96, Math.max(20, Math.round((rain / 110) * 85 + 15))),
          slope_deg: loc.slope_deg,
          elevation_m: loc.elevation_m,
          temp_c: Math.round((18 + Math.random() * 4) * 10) / 10,
          humidity_pct: Math.round((70 + Math.random() * 20) * 10) / 10,
          weather_condition: rain > 50 ? 'Heavy Rain' : 'Light Showers',
          satellite_index: 0.75,
          timestamp: time
        });
      }
      return history;
    }
  },

  // AI Risk Prediction API
  async getRiskPrediction(locationId: number): Promise<RiskPrediction> {
    try {
      const response = await client.get(`/risk/${locationId}`);
      return response.data;
    } catch {
      const loc = MOCK_LOCATIONS.find(l => l.id === locationId) || MOCK_LOCATIONS[0];
      const prob = loc.risk_probability;
      return {
        location_id: loc.id,
        location_name: loc.name,
        risk_probability: prob,
        risk_level: loc.risk_level,
        factor_rainfall: 44.5,
        factor_moisture: 36.2,
        factor_slope: 19.3,
        feature_importance: {
          'Rainfall Intensity': 44.5,
          'Soil Moisture Saturation': 36.2,
          'Slope Angle': 19.3
        },
        ai_explanation: `This location (${loc.name}) currently has a ${loc.risk_level} landslide risk because of heavy rainfall, high soil moisture saturation, and a steep terrain slope (${loc.slope_deg}°). The combination of these severe environmental factors has increased the predicted probability to ${Math.round(prob * 100)}%.`,
        recommended_action: loc.risk_level === 'CRITICAL' || loc.risk_level === 'HIGH' 
          ? '⚠️ HIGH RISK ALERT: Restrict public access to vulnerable slope sectors, monitor rainfall gauges continuously, and alert nearby residents.'
          : '✅ ROUTINE MONITORING: Continue automated telemetry logging and clear drainage paths.'
      };
    }
  },

  async predictCustomRisk(params: {
    rainfall_mm: number;
    soil_moisture_pct: number;
    slope_deg: number;
    elevation_m: number;
    temp_c?: number;
    humidity_pct?: number;
  }): Promise<RiskPrediction> {
    try {
      const response = await client.post('/risk/predict', params);
      return response.data;
    } catch {
      const { rainfall_mm, soil_moisture_pct, slope_deg, elevation_m } = params;
      const prob = Math.min(0.98, Math.max(0.03, (rainfall_mm / 140) * 0.42 + (soil_moisture_pct / 100) * 0.35 + (slope_deg / 50) * 0.20 + (elevation_m / 2500) * 0.05));
      const level = prob >= 0.85 ? 'CRITICAL' : prob >= 0.65 ? 'HIGH' : prob >= 0.35 ? 'MODERATE' : 'LOW';

      return {
        risk_probability: Math.round(prob * 1000) / 1000,
        risk_level: level,
        factor_rainfall: Math.round((rainfall_mm * 0.45 / 3.0) * 10) / 10,
        factor_moisture: Math.round((soil_moisture_pct * 0.35 / 3.0) * 10) / 10,
        factor_slope: Math.round((slope_deg * 2.0 / 3.0) * 10) / 10,
        feature_importance: {
          'Rainfall Intensity': 42.0,
          'Soil Moisture Saturation': 38.0,
          'Slope Angle': 20.0
        },
        ai_explanation: `This location currently has a ${level} landslide risk because of rainfall (${rainfall_mm} mm), soil moisture (${soil_moisture_pct}%), and slope (${slope_deg}°). The combination of these factors yields a predicted risk probability of ${Math.round(prob * 100)}%.`,
        recommended_action: level === 'CRITICAL' || level === 'HIGH'
          ? '🚨 HIGH RISK ADVISORY: Evacuate steep slope perimeter and alert authorities immediately.'
          : '✅ MODERATE / LOW STATUS: Maintain routine sensor observation.'
      };
    }
  },

  async getRiskHistory(locationId: number): Promise<RiskHistoryPoint[]> {
    try {
      const response = await client.get(`/risk-history/${locationId}`);
      return response.data;
    } catch {
      const loc = MOCK_LOCATIONS.find(l => l.id === locationId) || MOCK_LOCATIONS[0];
      const baseProb = loc.risk_probability;
      const history: RiskHistoryPoint[] = [];

      for (let i = 24; i >= 0; i -= 2) {
        const p = Math.min(0.98, Math.max(0.05, baseProb - (i * 0.02) + (Math.random() * 0.04 - 0.02)));
        const lvl = p >= 0.85 ? 'CRITICAL' : p >= 0.65 ? 'HIGH' : p >= 0.35 ? 'MODERATE' : 'LOW';
        history.push({
          id: i,
          location_id: locationId,
          risk_probability: Math.round(p * 100) / 100,
          risk_level: lvl,
          timestamp: new Date(Date.now() - i * 3600000).toISOString()
        });
      }
      return history;
    }
  },

  // Citizen Reports API
  async getCitizenReports(status?: string): Promise<CitizenReport[]> {
    try {
      const response = await client.get('/citizen-reports', { params: { status } });
      return response.data;
    } catch {
      if (status) {
        return MOCK_REPORTS.filter(r => r.status.toLowerCase() === status.toLowerCase());
      }
      return MOCK_REPORTS;
    }
  },

  async submitCitizenReport(report: Partial<CitizenReport>): Promise<CitizenReport> {
    try {
      const response = await client.post('/citizen-reports', report);
      return response.data;
    } catch {
      const newReport: CitizenReport = {
        id: Date.now(),
        reporter_name: report.reporter_name || 'Anonymous Citizen',
        location_name: report.location_name || 'Nilgiris Pass',
        latitude: report.latitude || 11.41,
        longitude: report.longitude || 76.73,
        report_type: report.report_type || 'ground_cracks',
        description: report.description || 'Reported hazard observation.',
        photo_url: report.photo_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
        status: 'Pending',
        created_at: new Date().toISOString()
      };
      MOCK_REPORTS.unshift(newReport);
      return newReport;
    }
  },

  async updateReportStatus(reportId: number, status: 'Pending' | 'Verified' | 'Rejected'): Promise<CitizenReport> {
    try {
      const response = await client.patch(`/citizen-reports/${reportId}/status`, { status });
      return response.data;
    } catch {
      const r = MOCK_REPORTS.find(item => item.id === reportId);
      if (r) r.status = status;
      return r || MOCK_REPORTS[0];
    }
  },

  // Alerts API
  async getAlerts(isActive: boolean = true): Promise<EarlyWarningAlert[]> {
    try {
      const response = await client.get('/alerts', { params: { is_active: isActive } });
      return response.data;
    } catch {
      return MOCK_ALERTS.filter(a => a.is_active === isActive);
    }
  },

  async dismissAlert(alertId: number): Promise<EarlyWarningAlert> {
    try {
      const response = await client.patch(`/alerts/${alertId}/dismiss`);
      return response.data;
    } catch {
      const alert = MOCK_ALERTS.find(a => a.id === alertId);
      if (alert) alert.is_active = false;
      return alert || MOCK_ALERTS[0];
    }
  },

  async createAlert(alertData: Partial<EarlyWarningAlert>): Promise<EarlyWarningAlert> {
    try {
      const response = await client.post('/alerts', alertData);
      return response.data;
    } catch {
      const newAlert: EarlyWarningAlert = {
        id: Date.now(),
        location_id: alertData.location_id || 1,
        location_name: alertData.location_name || 'Nilgiris Pass',
        alert_level: alertData.alert_level || 'HIGH',
        title: alertData.title || '⚠️ EMERGENCY ADVISORY',
        description: alertData.description || 'Precipitation threshold exceeded.',
        reason: alertData.reason || 'Rainfall and slope saturation.',
        recommended_action: alertData.recommended_action || 'Evacuate vulnerable slopes.',
        is_active: true,
        created_at: new Date().toISOString()
      };
      MOCK_ALERTS.unshift(newAlert);
      return newAlert;
    }
  },

  // Dashboard Stats API
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await client.get('/dashboard/statistics');
      return response.data;
    } catch {
      return {
        total_locations: 8,
        high_risk_locations: 3,
        critical_risk_locations: 1,
        active_alerts: 2,
        total_citizen_reports: MOCK_REPORTS.length,
        pending_citizen_reports: MOCK_REPORTS.filter(r => r.status === 'Pending').length,
        average_risk_probability: 0.61,
        overall_system_status: 'CRITICAL LANDSLIDE WARNING'
      };
    }
  },

  // Simulation API
  async triggerSimulatedStorm(): Promise<{ message: string }> {
    try {
      const response = await client.post('/simulation/trigger-rain');
      return response.data;
    } catch {
      // Simulate rain storm in mock data
      MOCK_LOCATIONS.forEach(l => {
        l.risk_probability = Math.min(0.99, l.risk_probability + 0.25);
        l.risk_level = l.risk_probability >= 0.85 ? 'CRITICAL' : l.risk_probability >= 0.65 ? 'HIGH' : 'MODERATE';
      });
      return { message: 'Heavy storm simulation triggered across all monitoring stations.' };
    }
  },

  async resetSimulation(): Promise<{ message: string }> {
    try {
      const response = await client.post('/simulation/reset');
      return response.data;
    } catch {
      MOCK_LOCATIONS.forEach(l => {
        l.risk_probability = Math.max(0.1, l.risk_probability - 0.3);
        l.risk_level = l.risk_probability < 0.35 ? 'LOW' : 'MODERATE';
      });
      return { message: 'Simulation reset back to baseline levels.' };
    }
  }
};
