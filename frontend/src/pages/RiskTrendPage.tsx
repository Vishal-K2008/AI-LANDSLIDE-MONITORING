import React, { useState } from 'react';
import { Location } from '../types';
import { TrendingUp, Clock, Calendar, ArrowRight, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface RiskTrendPageProps {
  locations: Location[];
}

export const RiskTrendPage: React.FC<RiskTrendPageProps> = ({ locations }) => {
  const [selectedLocId, setSelectedLocId] = useState<number>(locations[0]?.id || 1);
  const selectedLoc = locations.find(l => l.id === selectedLocId) || locations[0];

  // Progression Stepper data (Yesterday -> Today Morning -> Current)
  const progressionSteps = [
    { time: 'Yesterday', level: 'LOW', prob: '18%', desc: 'Background sensor levels', color: 'bg-emerald-500 text-white' },
    { time: 'Today Morning', level: 'MODERATE', prob: '54%', desc: 'Monsoon showers started', color: 'bg-amber-500 text-white' },
    { time: 'Current Status', level: selectedLoc?.risk_level || 'HIGH', prob: `${Math.round((selectedLoc?.risk_probability || 0.87) * 100)}%`, desc: 'Pore-water pressure critical', color: 'bg-rose-600 text-white animate-pulse' }
  ];

  // 7-day trend chart data
  const trendData = [
    { day: 'Mon', risk: 14, rainfall: 10, moisture: 25 },
    { day: 'Tue', risk: 18, rainfall: 15, moisture: 30 },
    { day: 'Wed', risk: 28, rainfall: 32, moisture: 42 },
    { day: 'Thu', risk: 52, rainfall: 65, moisture: 68 },
    { day: 'Fri', risk: 78, rainfall: 88, moisture: 84 },
    { day: 'Sat (Today)', risk: Math.round((selectedLoc?.risk_probability || 0.87) * 100), rainfall: 110, moisture: 91 }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Risk Trend & Timeline Analysis
          </h2>
          <p className="text-xs text-slate-500 font-medium">Tracking risk evolution: LOW → MODERATE → HIGH</p>
        </div>

        <select
          value={selectedLocId}
          onChange={(e) => setSelectedLocId(Number(e.target.value))}
          className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
        >
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      {/* LOW -> MODERATE -> HIGH Progression Stepper Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold font-display text-slate-900 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          Risk Evolution Stepper ({selectedLoc?.name})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {progressionSteps.map((step, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{step.time}</span>
                <span className="font-mono text-slate-700">{step.prob}</span>
              </div>

              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide inline-block ${step.color}`}>
                  {step.level}
                </span>
                <p className="text-xs text-slate-600 mt-2 font-medium">{step.desc}</p>
              </div>

              {idx < progressionSteps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Trend Line Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold font-display text-slate-900 text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          7-Day Historic Risk Probability Comparison Chart
        </h3>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="risk" name="Risk Probability (%)" stroke="#ef4444" strokeWidth={3} />
              <Line type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="moisture" name="Soil Moisture (%)" stroke="#0d9488" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
