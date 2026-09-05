import React, { useEffect, useState } from 'react';
import { Location, EnvironmentalData, RiskPrediction, RiskHistoryPoint } from '../types';
import { api } from '../services/api';
import { X, Sparkles, CloudRain, Droplets, Mountain, ShieldAlert, Thermometer, Compass, LineChart as ChartIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LocationDetailModalProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  location,
  isOpen,
  onClose
}) => {
  const [envData, setEnvData] = useState<EnvironmentalData | null>(null);
  const [prediction, setPrediction] = useState<RiskPrediction | null>(null);
  const [history, setHistory] = useState<EnvironmentalData[]>([]);

  useEffect(() => {
    if (location && isOpen) {
      api.getEnvironmentalData(location.id).then(setEnvData);
      api.getRiskPrediction(location.id).then(setPrediction);
      api.getEnvironmentalHistory(location.id).then(setHistory);
    }
  }, [location, isOpen]);

  if (!isOpen || !location) return null;

  const probPct = Math.round(location.risk_probability * 100);

  const getBadgeStyle = (lvl: string) => {
    switch (lvl) {
      case 'CRITICAL': return 'bg-rose-900 text-white';
      case 'HIGH': return 'bg-rose-600 text-white';
      case 'MODERATE': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-600 text-white';
    }
  };

  const chartData = history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    rainfall: h.rainfall_mm,
    moisture: h.soil_moisture_pct,
    temp: h.temp_c
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-400/30 shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs text-slate-400 font-semibold">{location.district}, {location.state}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${getBadgeStyle(location.risk_level)}`}>
                  {location.risk_level} ({probPct}%)
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">{location.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          {/* Top Sensor Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-1.5 sm:gap-2 text-blue-700 text-[11px] sm:text-xs font-bold mb-1">
                <CloudRain className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                Rainfall
              </div>
              <p className="text-xl sm:text-2xl font-bold font-display text-slate-900">{envData ? envData.rainfall_mm : 82} mm</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Precipitation rate</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
              <div className="flex items-center gap-1.5 sm:gap-2 text-teal-700 text-[11px] sm:text-xs font-bold mb-1">
                <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                Soil Moisture
              </div>
              <p className="text-xl sm:text-2xl font-bold font-display text-slate-900">{envData ? envData.soil_moisture_pct : 78}%</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Volumetric saturation</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-1.5 sm:gap-2 text-amber-700 text-[11px] sm:text-xs font-bold mb-1">
                <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                Slope Angle
              </div>
              <p className="text-xl sm:text-2xl font-bold font-display text-slate-900">{location.slope_deg}°</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Elevation: {location.elevation_m}m</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-700 text-[11px] sm:text-xs font-bold mb-1">
                <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                Weather Temp
              </div>
              <p className="text-xl sm:text-2xl font-bold font-display text-slate-900">{envData ? envData.temp_c : 18}°C</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">{envData?.weather_condition || 'Overcast Rain'}</p>
            </div>
          </div>

          {/* AI Explanation Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
            <h4 className="font-bold text-teal-950 text-xs sm:text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              AI Risk Diagnosis ("Why is this location risky?")
            </h4>
            <p className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed">
              {prediction?.ai_explanation || 
                `This location (${location.name}) currently has a ${location.risk_level} landslide risk because of heavy rainfall (${envData?.rainfall_mm || 85} mm), high soil moisture saturation (${envData?.soil_moisture_pct || 78}%) and a steep slope (${location.slope_deg}°). The combination of these factors has increased the predicted probability to ${probPct}%.`
              }
            </p>
          </div>

          {/* Recharts Time Series History */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-teal-600 shrink-0" />
              Environmental Telemetry History (Last 24 Hours)
            </h4>
            <div className="h-48 sm:h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="moisture" name="Soil Moisture (%)" stroke="#0d9488" fill="#14b8a6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Recommended Safety Protocol
            </h4>
            <p className="text-xs text-amber-950 font-medium">
              {prediction?.recommended_action || "Restrict public access to high-slope perimeters, keep hillside culverts clear, and monitor local rainfall gauges continuously."}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800">
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
