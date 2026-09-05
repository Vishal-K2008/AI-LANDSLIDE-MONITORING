import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  CloudRain, 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  ShieldCheck,
  Compass,
  Radio,
  X
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab = 
  | 'dashboard'
  | 'map'
  | 'locations'
  | 'environmental'
  | 'ai-analysis'
  | 'trends'
  | 'alerts'
  | 'reports'
  | 'admin';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentRole: UserRole;
  activeAlertsCount: number;
  pendingReportsCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  activeAlertsCount,
  pendingReportsCount,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Interactive Risk Map', shortLabel: 'Risk Map', icon: MapPin },
    { id: 'locations', label: 'Monitored Locations', shortLabel: 'Locations', icon: Compass },
    { id: 'environmental', label: 'Environmental Telemetry', shortLabel: 'Telemetry', icon: CloudRain },
    { id: 'ai-analysis', label: 'AI Risk Analysis', shortLabel: 'AI Analysis', icon: BrainCircuit },
    { id: 'trends', label: 'Risk Trends', shortLabel: 'Trends', icon: TrendingUp },
    { 
      id: 'alerts', 
      label: 'Early Warnings & Alerts',
      shortLabel: 'Alerts',
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { 
      id: 'reports', 
      label: 'Citizen Hazard Reports', 
      shortLabel: 'Reports',
      icon: FileText,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    ...(currentRole === 'admin' ? [
      { id: 'admin', label: 'Admin Command Center', shortLabel: 'Admin', icon: ShieldCheck }
    ] : [])
  ];

  const handleTabClick = (tabId: NavTab) => {
    onTabChange(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Mobile Drawer Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200">
        <span className="font-display font-bold text-slate-900 text-base">Navigation</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id as NavTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Risk Legend Summary Box */}
      <div className="p-4 m-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs shrink-0">
        <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
          <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          Risk Threshold Index
        </div>
        <div className="space-y-1.5 font-medium text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              LOW (0 - 34%)
            </span>
            <span className="text-[10px] text-slate-400">Stable</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              MODERATE (35 - 64%)
            </span>
            <span className="text-[10px] text-slate-400">Advisory</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              HIGH (65 - 84%)
            </span>
            <span className="text-[10px] text-rose-500 font-bold">Warning</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-900 animate-pulse"></span>
              CRITICAL (85 - 100%)
            </span>
            <span className="text-[10px] text-rose-900 font-bold">Evacuate</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0 min-h-[calc(100vh-61px)]">
        {navContent}
      </aside>

      {/* Mobile Off-Canvas Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col animate-fade-in">
            {navContent}
          </div>
        </div>
      )}

      {/* Quick Mobile Horizontal Pill Navigation Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id as NavTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.shortLabel}</span>
              {item.badge !== undefined && (
                <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

