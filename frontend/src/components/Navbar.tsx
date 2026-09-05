import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CloudRain, 
  Search, 
  Bell, 
  User, 
  RefreshCw, 
  Activity,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onSearch: (query: string) => void;
  onTriggerSimulation: () => void;
  activeAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onSearch,
  onTriggerSimulation,
  activeAlertCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSimulateClick = async () => {
    setIsSimulating(true);
    await onTriggerSimulation();
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Brand Title & Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-rose-600 to-amber-500 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-display font-bold text-slate-900 text-lg md:text-xl leading-tight tracking-tight flex items-center gap-2">
            TerraGuard AI
            <span className="text-xs bg-slate-100 text-slate-600 font-sans font-semibold px-2 py-0.5 rounded-full border border-slate-200">
              v1.0 Live
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            Early Warning & Landslide Risk Monitoring System
          </p>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search locations (Ooty, Coonoor, Kodaikanal, Valparai...)"
            className="w-full bg-slate-50 text-slate-800 text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Weather Storm Simulation Button */}
        <button
          onClick={handleSimulateClick}
          disabled={isSimulating}
          title="Simulate sudden monsoon cloudburst rain event"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 active:scale-95 transition-all shadow-sm"
        >
          <CloudRain className={`w-4 h-4 text-amber-600 ${isSimulating ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline">Simulate Monsoon Storm</span>
        </button>

        {/* Live Clock Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Activity className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          {currentTime}
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button 
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition-colors"
            title="System Active Alerts"
          >
            <Bell className="w-5 h-5" />
            {activeAlertCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-badge-ping">
                {activeAlertCount}
              </span>
            )}
          </button>
        </div>

        {/* Role Switcher Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onRoleChange('citizen')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentRole === 'citizen'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-teal-600" />
            Citizen
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentRole === 'admin'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};
