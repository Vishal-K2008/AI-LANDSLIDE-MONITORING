import React from 'react';
import { LucideIcon } from 'lucide-react';
import { RiskLevel } from '../types';

interface RiskCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  riskLevel?: RiskLevel;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  onClick?: () => void;
  accentColor?: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  riskLevel,
  trend,
  trendValue,
  onClick,
  accentColor
}) => {
  const getBadgeStyle = (level?: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-900 text-white border-rose-950 shadow-sm animate-pulse';
      case 'HIGH':
        return 'bg-rose-500 text-white border-rose-600 shadow-sm';
      case 'MODERATE':
        return 'bg-amber-500 text-white border-amber-600';
      case 'LOW':
        return 'bg-emerald-500 text-white border-emerald-600';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCardBorder = (level?: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'border-rose-300 ring-2 ring-rose-400/30 bg-rose-50/50';
      case 'HIGH':
        return 'border-rose-200 bg-rose-50/20';
      case 'MODERATE':
        return 'border-amber-200 bg-amber-50/20';
      case 'LOW':
        return 'border-emerald-200 bg-emerald-50/20';
      default:
        return 'border-slate-200 hover:border-slate-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white border ${getCardBorder(riskLevel)} shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer transform hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold font-display text-slate-900 flex items-baseline gap-2">
            {value}
            {riskLevel && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getBadgeStyle(riskLevel)}`}>
                {riskLevel}
              </span>
            )}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
        </div>

        <div className={`p-3 rounded-xl ${accentColor || 'bg-teal-50 text-teal-600'} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && trendValue && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold">
          <span className={trend === 'up' ? 'text-rose-600' : trend === 'down' ? 'text-emerald-600' : 'text-slate-500'}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
          <span className="text-slate-400 font-normal">vs previous 24h</span>
        </div>
      )}
    </div>
  );
};
