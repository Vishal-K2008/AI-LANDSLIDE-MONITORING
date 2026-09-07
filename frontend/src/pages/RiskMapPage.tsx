import React, { useState } from 'react';
import { Location, CitizenReport } from '../types';
import { RiskMap } from '../components/RiskMap';
import { MapPin, Search } from 'lucide-react';

interface RiskMapPageProps {
  locations: Location[];
  onSelectLocation: (loc: Location) => void;
  onOpenAIExplanation: (loc: Location) => void;
  citizenReports: CitizenReport[];
}

export const RiskMapPage: React.FC<RiskMapPageProps> = ({
  locations,
  onSelectLocation,
  onOpenAIExplanation,
  citizenReports
}) => {
  const [selectedLocId, setSelectedLocId] = useState<number | undefined>(locations[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCitizenReports, setShowCitizenReports] = useState(true);

  const filteredLocs = locations.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
            Interactive Geospatial Landslide Risk Map
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor Northeast India geospatial risk zones (Green = Low, Yellow = Moderate, Red = High, Maroon = Critical)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <label className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
            <input
              type="checkbox"
              checked={showCitizenReports}
              onChange={(e) => setShowCitizenReports(e.target.checked)}
              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            Show Citizen Reports Pin
          </label>
        </div>
      </div>

      {/* Main Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Map Container (3 Cols) */}
        <div className="lg:col-span-3 h-[380px] sm:h-[500px] lg:h-[600px] w-full">
          <RiskMap
            locations={filteredLocs}
            selectedLocationId={selectedLocId}
            onSelectLocation={(loc) => {
              setSelectedLocId(loc.id);
              onSelectLocation(loc);
            }}
            onOpenAIExplanation={onOpenAIExplanation}
            citizenReports={citizenReports}
            showCitizenReports={showCitizenReports}
          />
        </div>

        {/* Location Selector Sidebar (1 Col) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3 sm:space-y-4 flex flex-col max-h-[300px] lg:max-h-none lg:h-[600px]">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Monitored Locations ({filteredLocs.length})
          </h3>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {filteredLocs.map((loc) => {
              const isSelected = loc.id === selectedLocId;
              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocId(loc.id);
                    onSelectLocation(loc);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 shadow-sm font-semibold'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900">{loc.name}</h4>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white ${
                      loc.risk_level === 'CRITICAL' ? 'bg-rose-900' :
                      loc.risk_level === 'HIGH' ? 'bg-rose-600' :
                      loc.risk_level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}>
                      {loc.risk_level}
                    </span>
                  </div>

                  <p className="text-slate-500 text-[11px]">District: {loc.district}</p>
                  <div className="flex justify-between text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200/60 font-mono">
                    <span>Slope: {loc.slope_deg}°</span>
                    <span>Prob: {Math.round(loc.risk_probability * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
