import React from 'react';
import { Sparkles, X, AlertTriangle, CheckCircle, BrainCircuit, BarChart3, ShieldAlert } from 'lucide-react';
import { Location, RiskPrediction } from '../types';

interface AIExplanationModalProps {
  location: Location | null;
  prediction: RiskPrediction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AIExplanationModal: React.FC<AIExplanationModalProps> = ({
  location,
  prediction,
  isOpen,
  onClose
}) => {
  if (!isOpen || !location) return null;

  const probPct = prediction ? Math.round(prediction.risk_probability * 100) : Math.round(location.risk_probability * 100);
  const level = prediction ? prediction.risk_level : location.risk_level;

  const getBadgeStyle = (lvl: string) => {
    switch (lvl) {
      case 'CRITICAL': return 'bg-rose-900 text-white';
      case 'HIGH': return 'bg-rose-600 text-white';
      case 'MODERATE': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/20 p-2.5 rounded-2xl border border-teal-400/30 text-teal-300">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                AI Diagnostic Engine
              </span>
              <h3 className="text-lg font-bold font-display text-white">
                "Why is this area risky?"
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Location Summary Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Analyzed Zone</p>
              <h4 className="font-bold text-slate-900 text-base">{location.name}</h4>
              <p className="text-xs text-slate-500">{location.district}, {location.state} • Elevation: {location.elevation_m}m</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Risk Assessment</p>
              <div className="flex items-center gap-2 justify-end mt-0.5">
                <span className="text-2xl font-extrabold text-slate-900 font-display">{probPct}%</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide ${getBadgeStyle(level)}`}>
                  {level}
                </span>
              </div>
            </div>
          </div>

          {/* AI Text Explanation Box */}
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-2">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Natural Language AI Summary
            </div>
            <p className="text-slate-800 text-sm leading-relaxed font-medium">
              {prediction?.ai_explanation || 
                `This location (${location.name}) currently has a ${level} landslide risk because of heavy rainfall, high soil moisture and a steep slope (${location.slope_deg}°). The combination of these factors has increased the predicted probability to ${probPct}%.`
              }
            </p>
          </div>

          {/* Visual Contributing Factor Importance Bars */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              Main Contributing Environmental Factors (Weight %):
            </h5>

            {prediction?.feature_importance ? (
              Object.entries(prediction.feature_importance).map(([factor, weight]) => (
                <div key={factor} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{factor}</span>
                    <span className="text-teal-700 font-mono font-bold">{weight}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(5, weight))}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>1. Heavy Rainfall Intensity</span>
                    <span className="text-rose-600 font-mono font-bold">44.5%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '44.5%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>2. High Soil Moisture Saturation</span>
                    <span className="text-amber-600 font-mono font-bold">36.2%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '36.2%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>3. Steep Slope Gradient ({location.slope_deg}°)</span>
                    <span className="text-teal-600 font-mono font-bold">19.3%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '19.3%' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Preventive Actions */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h5 className="font-bold text-amber-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Recommended Preventive Actions
            </h5>
            <p className="text-xs text-amber-950 font-medium leading-normal">
              {prediction?.recommended_action || 
                "Avoid identified high-risk slope zones, monitor local rainfall continuously, keep hillside drainage clear, and prepare emergency communications for residents."
              }
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
