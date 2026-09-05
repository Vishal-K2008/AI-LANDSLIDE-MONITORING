import React, { useState } from 'react';
import { Location } from '../types';
import { Compass, Search, Eye, Sparkles } from 'lucide-react';

interface LocationsPageProps {
  locations: Location[];
  onSelectLocation: (loc: Location) => void;
  onOpenAIExplanation: (loc: Location) => void;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({
  locations,
  onSelectLocation,
  onOpenAIExplanation
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filtered = locations.filter(l => {
    const matchesRisk = filterRisk === 'ALL' || l.risk_level === filterRisk;
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.district.toLowerCase().includes(search.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  return (
    <div className="p-3 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-600 shrink-0" />
            Monitored Geotechnical Stations & Slope Locations
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Tamil Nadu vulnerability zones (Ooty, Coonoor, Kodaikanal, Valparai...)</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search station..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar max-w-full">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterRisk(lvl)}
                className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                  filterRisk === lvl ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Locations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((loc) => {
          const probPct = Math.round(loc.risk_probability * 100);

          return (
            <div key={loc.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{loc.district}, {loc.state}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white ${
                    loc.risk_level === 'CRITICAL' ? 'bg-rose-900' :
                    loc.risk_level === 'HIGH' ? 'bg-rose-600' :
                    loc.risk_level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}>
                    {loc.risk_level} ({probPct}%)
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base font-display">{loc.name}</h3>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Slope Angle</span>
                    <span className="font-bold text-slate-900">{loc.slope_deg}°</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Elevation</span>
                    <span className="font-bold text-slate-900">{loc.elevation_m} m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Latitude</span>
                    <span className="font-mono text-[11px]">{loc.latitude.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Longitude</span>
                    <span className="font-mono text-[11px]">{loc.longitude.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onOpenAIExplanation(loc)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-teal-50 text-teal-700 rounded-xl text-xs font-bold hover:bg-teal-100 border border-teal-200"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Explainer
                </button>
                <button
                  onClick={() => onSelectLocation(loc)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Telemetry
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
