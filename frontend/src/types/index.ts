export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface Location {
  id: number;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  slope_deg: number;
  risk_level: RiskLevel;
  risk_probability: number;
  last_updated: string;
}

export interface EnvironmentalData {
  id: number;
  location_id: number;
  rainfall_mm: number;
  soil_moisture_pct: number;
  slope_deg: number;
  elevation_m: number;
  temp_c: number;
  humidity_pct: number;
  weather_condition: string;
  satellite_index: number;
  timestamp: string;
}

export interface RiskPrediction {
  id?: number;
  location_id?: number;
  location_name?: string;
  risk_probability: number;
  risk_level: RiskLevel;
  factor_rainfall: number;
  factor_moisture: number;
  factor_slope: number;
  feature_importance: Record<string, number>;
  ai_explanation: string;
  recommended_action: string;
  created_at?: string;
}

export interface RiskHistoryPoint {
  id: number;
  location_id: number;
  risk_probability: number;
  risk_level: RiskLevel;
  timestamp: string;
}

export type CitizenReportType = 
  | 'ground_cracks'
  | 'rockfall'
  | 'water_accumulation'
  | 'soil_movement'
  | 'landslide'
  | 'other';

export type CitizenReportStatus = 'Pending' | 'Verified' | 'Rejected';

export interface CitizenReport {
  id: number;
  user_id?: number;
  reporter_name: string;
  location_name: string;
  latitude: number;
  longitude: number;
  report_type: CitizenReportType;
  description: string;
  photo_url?: string;
  status: CitizenReportStatus;
  created_at: string;
}

export interface EarlyWarningAlert {
  id: number;
  location_id: number;
  location_name?: string;
  alert_level: RiskLevel;
  title: string;
  description: string;
  reason: string;
  recommended_action: string;
  is_active: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_locations: number;
  high_risk_locations: number;
  critical_risk_locations: number;
  active_alerts: number;
  total_citizen_reports: number;
  pending_citizen_reports: number;
  average_risk_probability: number;
  overall_system_status: string;
}

export type UserRole = 'admin' | 'citizen';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}
