import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Location, CitizenReport, RiskLevel } from '../types';
import { ShieldAlert, CloudRain, Droplets, Mountain, Eye, Sparkles, Navigation, Layers } from 'lucide-react';

interface RiskMapProps {
  locations: Location[];
  selectedLocationId?: number;
  onSelectLocation: (location: Location) => void;
  onOpenAIExplanation?: (location: Location) => void;
  citizenReports?: CitizenReport[];
  showCitizenReports?: boolean;
}

// Custom Leaflet icon builder using SVG markers for crisp rendering
const createRiskIcon = (riskLevel: RiskLevel, isSelected: boolean) => {
  let color = '#10B981'; // Green (Low)
  if (riskLevel === 'MODERATE') color = '#F59E0B'; // Yellow/Amber
  if (riskLevel === 'HIGH') color = '#EF4444'; // Red
  if (riskLevel === 'CRITICAL') color = '#881337'; // Maroon

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="${isSelected ? 36 : 28}" height="${isSelected ? 48 : 38}">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#FFFFFF" stroke-width="${isSelected ? 2.5 : 1.5}"/>
      <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: isSelected ? [36, 48] : [28, 38],
    iconAnchor: isSelected ? [18, 48] : [14, 38],
    popupAnchor: [0, -36]
  });
};

// Component to programmatically re-center map when location is chosen
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 11 }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

export const RiskMap: React.FC<RiskMapProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  onOpenAIExplanation,
  citizenReports = [],
  showCitizenReports = true
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [showZones, setShowZones] = useState<boolean>(true);

  // Center over Tamil Nadu / Western Ghats hill ranges (Ooty/Kodaikanal area)
  const defaultCenter: [number, number] = [11.0, 77.2];
  
  const selectedLoc = locations.find(l => l.id === selectedLocationId);
  const mapCenter: [number, number] = selectedLoc 
    ? [selectedLoc.latitude, selectedLoc.longitude] 
    : defaultCenter;

  const filteredLocations = locations.filter(loc => {
    if (filterLevel === 'ALL') return true;
    return loc.risk_level === filterLevel;
  });

  return (
    <div className="relative w-full h-full min-h-[350px] sm:min-h-[440px] rounded-2xl overflow-hidden border border-slate-200 shadow-md flex flex-col bg-slate-100">
      {/* Top Map Filter Bar */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-[1000] bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-1.5 flex-wrap text-[11px] sm:text-xs max-w-[calc(100%-16px)] sm:max-w-none">
        <span className="font-bold text-slate-700 px-1 sm:px-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-teal-600 hidden xs:inline" />
          Filter:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-semibold transition-all shrink-0 ${
                filterLevel === lvl
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="hidden sm:block h-4 w-px bg-slate-200 my-auto mx-1" />

        <label className="flex items-center gap-1 font-medium text-slate-700 cursor-pointer select-none px-1 text-[10px] sm:text-xs">
          <input
            type="checkbox"
            checked={showZones}
            onChange={(e) => setShowZones(e.target.checked)}
            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Risk Buffer Zones
        </label>
      </div>

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={mapCenter}
        zoom={9}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={mapCenter} zoom={selectedLoc ? 12 : 9} />

        {/* Location Markers & Buffer Circles */}
        {filteredLocations.map((loc) => {
          const isSelected = loc.id === selectedLocationId;
          const probPct = Math.round(loc.risk_probability * 100);

          let circleColor = '#10B981';
          if (loc.risk_level === 'MODERATE') circleColor = '#F59E0B';
          if (loc.risk_level === 'HIGH') circleColor = '#EF4444';
          if (loc.risk_level === 'CRITICAL') circleColor = '#881337';

          return (
            <React.Fragment key={loc.id}>
              {/* Risk Radius Buffer Visualization */}
              {showZones && (
                <CircleMarker
                  center={[loc.latitude, loc.longitude]}
                  radius={loc.risk_level === 'CRITICAL' ? 35 : loc.risk_level === 'HIGH' ? 28 : 18}
                  pathOptions={{
                    color: circleColor,
                    fillColor: circleColor,
                    fillOpacity: loc.risk_level === 'CRITICAL' ? 0.35 : 0.2,
                    weight: isSelected ? 3 : 1
                  }}
                />
              )}

              {/* Pin Marker */}
              <Marker
                position={[loc.latitude, loc.longitude]}
                icon={createRiskIcon(loc.risk_level, isSelected)}
                eventHandlers={{
                  click: () => onSelectLocation(loc)
                }}
              >
                <Popup>
                  <div className="p-3 text-slate-800">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                      <h4 className="font-bold text-slate-900 text-sm">{loc.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white ${
                        loc.risk_level === 'CRITICAL' ? 'bg-rose-900' :
                        loc.risk_level === 'HIGH' ? 'bg-rose-600' :
                        loc.risk_level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}>
                        {loc.risk_level} ({probPct}%)
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">District:</span>
                        <span className="font-semibold">{loc.district}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Slope:</span>
                        <span className="font-semibold">{loc.slope_deg}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Elevation:</span>
                        <span className="font-semibold">{loc.elevation_m} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Coordinates:</span>
                        <span className="font-mono text-[11px]">{loc.latitude.toFixed(3)}, {loc.longitude.toFixed(3)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {onOpenAIExplanation && (
                        <button
                          onClick={() => onOpenAIExplanation(loc)}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:brightness-110 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Why is this area risky?
                        </button>
                      )}
                      <button
                        onClick={() => onSelectLocation(loc)}
                        className="w-full flex items-center justify-center gap-1 py-1 px-3 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Full Details
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Citizen Hazard Report Markers */}
        {showCitizenReports && citizenReports.map((report) => (
          <Marker
            key={`report-${report.id}`}
            position={[report.latitude, report.longitude]}
            icon={L.divIcon({
              className: 'custom-report-marker',
              html: `<div style="background-color: #7C3AED; color: white; border: 2px solid white; border-radius: 9999px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);">📢</div>`,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            })}
          >
            <Popup>
              <div className="p-2 text-xs">
                <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md inline-block mb-1">
                  Citizen Report: {report.report_type.replace('_', ' ').toUpperCase()}
                </span>
                <p className="font-semibold text-slate-900">{report.location_name}</p>
                <p className="text-slate-600 mt-1 italic">"{report.description}"</p>
                <p className="text-[10px] text-slate-400 mt-1">Status: {report.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
