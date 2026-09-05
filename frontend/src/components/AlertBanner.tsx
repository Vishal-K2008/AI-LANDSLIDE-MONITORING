import React from 'react';
import { ShieldAlert, AlertTriangle, X, ChevronRight, BellRing } from 'lucide-react';
import { EarlyWarningAlert } from '../types';

interface AlertBannerProps {
  alerts: EarlyWarningAlert[];
  onDismiss: (alertId: number) => void;
  onViewDetails: (locationId: number) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  alerts,
  onDismiss,
  onViewDetails
}) => {
  if (!alerts || alerts.length === 0) return null;

  const activeAlert = alerts[0]; // Display top priority active alert

  const getStyle = (lvl: string) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white border-rose-800';
      case 'HIGH':
        return 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-rose-500';
      case 'MODERATE':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-400';
      default:
        return 'bg-slate-800 text-white border-slate-700';
    }
  };

  return (
    <div className={`p-4 rounded-2xl border ${getStyle(activeAlert.alert_level)} shadow-xl animate-fade-in flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6`}>
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white shrink-0 mt-0.5 md:mt-0">
          <BellRing className="w-5 h-5 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-white/20 rounded-md">
              {activeAlert.alert_level} EARLY WARNING
            </span>
            <span className="text-xs text-white/80 font-mono">
              {new Date(activeAlert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h4 className="font-bold text-white text-base mt-1">{activeAlert.title}</h4>
          <p className="text-xs text-white/90 font-medium mt-0.5 max-w-3xl">
            {activeAlert.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
        <button
          onClick={() => onViewDetails(activeAlert.location_id)}
          className="flex items-center gap-1 px-3.5 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-xl shadow-md hover:bg-slate-100 transition-all active:scale-95"
        >
          View Zone Details
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDismiss(activeAlert.id)}
          className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Dismiss Alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
