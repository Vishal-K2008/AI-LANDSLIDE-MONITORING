import React, { useEffect, useState } from 'react';
import { Location, EnvironmentalData } from '../types';
import { api } from '../services/api';
import { CloudRain, Droplets, Mountain, Thermometer, Wind, Satellite, Activity, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface EnvironmentalPageProps {
  locations: Location[];
}

export const EnvironmentalPage: React.FC<EnvironmentalPageProps> = ({ locations }) => {
  const [selectedLocId, setSelectedLocId] = useState<number>(locations[0]?.id || 1);
  const [currentEnv, setCurrentEnv] = useState<EnvironmentalData | null>(null);
  const [history, setHistory] = useState<EnvironmentalData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedLoc = locations.find(l => l.id === selectedLocId) || locations[0];

  useEffect(() => {
    if (selectedLocId) {
      setIsLoading(true);
      Promise.all([
        api.getEnvironmentalData(selectedLocId),
        api.getEnvironmentalHistory(selectedLocId)
      ]).then(([env, hist]) => {
        setCurrentEnv(env);
        setHistory(hist);
      }).finally(() => setIsLoading(false));
    }
  }, [selectedLocId]);

  const chartData = history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    rainfall: h.rainfall_mm,
    soil_moisture: h.soil_moisture_pct,
    temp: h.temp_c,
    humidity: h.humidity_pct
  }));

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-600" />
            Environmental & Hydro-Meteorological Monitoring
          </h2>
          <p className="text-xs text-slate-500 font-medium">Real-time IoT sensor telemetry & satellite vegetation indices</p>
        </div>

        {/* Location Selector */}
        <select
          value={selectedLocId}
          onChange={(e) => setSelectedLocId(Number(e.target.value))}
          className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name} ({loc.district})</option>
          ))}
        </select>
      </div>

      {/* Environmental Live Telemetry Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Rainfall */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold mb-1">
            <CloudRain className="w-4 h-4" />
            Rainfall
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{currentEnv ? currentEnv.rainfall_mm : 82} mm</p>
          <span className="text-[10px] text-blue-600 font-medium">Precipitation rate</span>
        </div>

        {/* Soil Moisture */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold mb-1">
            <Droplets className="w-4 h-4" />
            Soil Moisture
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{currentEnv ? currentEnv.soil_moisture_pct : 78}%</p>
          <span className="text-[10px] text-teal-600 font-medium">Volumetric Content</span>
        </div>

        {/* Slope */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold mb-1">
            <Mountain className="w-4 h-4" />
            Slope Angle
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{selectedLoc ? selectedLoc.slope_deg : 34}°</p>
          <span className="text-[10px] text-amber-600 font-medium">Inclination Gradient</span>
        </div>

        {/* Elevation */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold mb-1">
            <Activity className="w-4 h-4" />
            Elevation
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{selectedLoc ? selectedLoc.elevation_m : 620} m</p>
          <span className="text-[10px] text-slate-500 font-medium">Above Sea Level</span>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold mb-1">
            <Wind className="w-4 h-4" />
            Humidity
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{currentEnv ? currentEnv.humidity_pct : 91}%</p>
          <span className="text-[10px] text-purple-600 font-medium">Relative Air Moisture</span>
        </div>

        {/* Satellite Index */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
            <Satellite className="w-4 h-4" />
            Satellite Index
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{currentEnv ? currentEnv.satellite_index : 0.85}</p>
          <span className="text-[10px] text-emerald-600 font-medium">NDMI Moisture</span>
        </div>
      </div>

      {/* Historical Telemetry Recharts */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold font-display text-slate-900 text-base">Historical Changes Over Time (24h Telemetry)</h3>
            <p className="text-xs text-slate-500">Multi-axis sensor stream tracking rainfall, soil moisture & temperature</p>
          </div>
          {isLoading && <RefreshCw className="w-4 h-4 text-teal-600 animate-spin" />}
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#2563eb" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="soil_moisture" name="Soil Moisture (%)" stroke="#0d9488" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
