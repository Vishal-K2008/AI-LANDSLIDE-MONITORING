import React from 'react';
import { Location, DashboardStats, EarlyWarningAlert, CitizenReport } from '../types';
import { RiskCard } from '../components/RiskCard';
import { AlertBanner } from '../components/AlertBanner';
import { RiskMap } from '../components/RiskMap';
import { ShieldAlert, CloudRain, Droplets, Mountain, AlertTriangle, FileText, Activity, Sparkles, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardPageProps {
  stats: DashboardStats | null;
  locations: Location[];
  alerts: EarlyWarningAlert[];
  reports: CitizenReport[];
  onSelectLocation: (loc: Location) => void;
  onOpenAIExplanation: (loc: Location) => void;
  onOpenReportForm: () => void;
  onNavigateTab: (tab: any) => void;
  onDismissAlert: (id: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  locations,
  alerts,
  reports,
  onSelectLocation,
  onOpenAIExplanation,
  onOpenReportForm,
  onNavigateTab,
  onDismissAlert
}) => {
  const highestRiskLoc = locations.find(l => l.risk_level === 'CRITICAL' || l.risk_level === 'HIGH') || locations[0];
  const activeAlerts = alerts.filter(a => a.is_active);

  // Sample 24h overall risk trend chart data
  const trendChartData = [
    { time: '00:00', risk: 24, rain: 12 },
    { time: '04:00', risk: 32, rain: 24 },
    { time: '08:00', risk: 58, rain: 54 },
    { time: '12:00', risk: 76, rain: 82 },
    { time: '16:00', risk: 87, rain: 94 },
    { time: '20:00', risk: 82, rain: 78 }
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Early Warning Active Alert Banner */}
      {activeAlerts.length > 0 && (
        <AlertBanner
          alerts={activeAlerts}
          onDismiss={onDismissAlert}
          onViewDetails={(locId) => {
            const loc = locations.find(l => l.id === locId);
            if (loc) onSelectLocation(loc);
          }}
        />
      )}

      {/* Main KPI Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RiskCard
          title="Highest Landslide Risk"
          value={`${highestRiskLoc ? Math.round(highestRiskLoc.risk_probability * 100) : 87}%`}
          subtitle={highestRiskLoc?.name || 'Ooty Doddabetta'}
          icon={ShieldAlert}
          riskLevel={highestRiskLoc?.risk_level || 'HIGH'}
          trend="up"
          trendValue="+14%"
          accentColor="bg-rose-50 text-rose-600"
          onClick={() => highestRiskLoc && onSelectLocation(highestRiskLoc)}
        />

        <RiskCard
          title="Average Rainfall"
          value="84.5 mm"
          subtitle="Monsoon Storm Accumulation"
          icon={CloudRain}
          accentColor="bg-blue-50 text-blue-600"
          onClick={() => onNavigateTab('environmental')}
        />

        <RiskCard
          title="Soil Moisture Saturation"
          value="82.0 %"
          subtitle="Elevated pore-water pressure"
          icon={Droplets}
          accentColor="bg-teal-50 text-teal-600"
          onClick={() => onNavigateTab('environmental')}
        />

        <RiskCard
          title="Active System Alerts"
          value={stats ? stats.active_alerts : activeAlerts.length}
          subtitle={`${stats ? stats.high_risk_locations + stats.critical_risk_locations : 3} High Risk Locations`}
          icon={AlertTriangle}
          accentColor="bg-amber-50 text-amber-600"
          onClick={() => onNavigateTab('alerts')}
        />
      </div>

      {/* Main Center Grid: Map & Quick Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Leaflet Map View (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                Live Geospatial Risk Map
              </h3>
              <p className="text-xs text-slate-500 font-medium">Real-time risk zones & citizen hazard reports overlay</p>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
            >
              Fullscreen Map
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[400px] w-full">
            <RiskMap
              locations={locations}
              onSelectLocation={onSelectLocation}
              onOpenAIExplanation={onOpenAIExplanation}
              citizenReports={reports}
            />
          </div>
        </div>

        {/* AI Quick Diagnosis & High Risk Table (1 Col) */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* AI Explanation Callout Box */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/20 px-2.5 py-1 rounded-full border border-teal-500/30">
                AI Diagnostic Summary
              </span>
              <Sparkles className="w-4 h-4 text-teal-400" />
            </div>

            <h4 className="font-bold font-display text-sm text-white">
              Why is the Nilgiris Region currently at HIGH risk?
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              Heavy continuous monsoonal rainfall (88-115mm) has saturated the upper regolith layer to 91% capacity. Steep slopes (&gt;32°) in Doddabetta and Kodaikanal show extreme pore-water pressure, escalating predicted landslide risk to 87%.
            </p>

            <button
              onClick={() => highestRiskLoc && onOpenAIExplanation(highestRiskLoc)}
              className="w-full mt-2 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Open AI Explanation Panel
            </button>
          </div>

          {/* Quick Monitored Sites Overview */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">Vulnerable Locations</h4>
              <button onClick={() => onNavigateTab('locations')} className="text-xs font-semibold text-teal-600 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {locations.slice(0, 4).map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => onSelectLocation(loc)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-200/60 flex items-center justify-between transition-all"
                >
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{loc.name}</h5>
                    <p className="text-[10px] text-slate-500">Slope: {loc.slope_deg}° • Elev: {loc.elevation_m}m</p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white ${
                    loc.risk_level === 'CRITICAL' ? 'bg-rose-900' :
                    loc.risk_level === 'HIGH' ? 'bg-rose-600' :
                    loc.risk_level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}>
                    {loc.risk_level} ({Math.round(loc.risk_probability * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: 24h Risk Trend Chart & Recent Citizen Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 24h Risk Trend Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold font-display text-slate-900 text-sm">24-Hour Landslide Risk & Rainfall Trend</h3>
              <p className="text-xs text-slate-500">Progression from Low → Moderate → High risk during monsoon</p>
            </div>
            <button onClick={() => onNavigateTab('trends')} className="text-xs font-semibold text-teal-600">
              Detailed Trends
            </button>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="risk" name="Risk Probability (%)" stroke="#ef4444" fill="#f87171" fillOpacity={0.25} />
                <Area type="monotone" dataKey="rain" name="Rainfall (mm)" stroke="#2563eb" fill="#60a5fa" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Citizen Reports Box */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold font-display text-slate-900 text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                Recent Citizen Reports
              </h3>
              <button
                onClick={onOpenReportForm}
                className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 hover:bg-purple-100"
              >
                + Submit Report
              </button>
            </div>

            <div className="space-y-2.5">
              {reports.slice(0, 3).map((rep) => (
                <div key={rep.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{rep.location_name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rep.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-slate-600 italic line-clamp-1">"{rep.description}"</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('reports')}
            className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
          >
            View All Reports ({reports.length})
          </button>
        </div>
      </div>
    </div>
  );
};
