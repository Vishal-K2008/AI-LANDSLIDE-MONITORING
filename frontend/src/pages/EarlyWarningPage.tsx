import React, { useState } from 'react';
import { EarlyWarningAlert, Location, UserRole } from '../types';
import { AlertTriangle, Bell, ShieldAlert, CheckCircle2, Plus, X } from 'lucide-react';
import { api } from '../services/api';

interface EarlyWarningPageProps {
  alerts: EarlyWarningAlert[];
  locations: Location[];
  onDismissAlert: (id: number) => void;
  onRefreshAlerts: () => void;
  currentRole: UserRole;
}

export const EarlyWarningPage: React.FC<EarlyWarningPageProps> = ({
  alerts,
  locations,
  onDismissAlert,
  onRefreshAlerts,
  currentRole
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocId, setSelectedLocId] = useState<number>(locations[0]?.id || 1);
  const [alertLevel, setAlertLevel] = useState<string>('HIGH');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');

  const activeAlerts = alerts.filter(a => a.is_active);
  const dismissedAlerts = alerts.filter(a => !a.is_active);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAlert({
        location_id: selectedLocId,
        alert_level: alertLevel as any,
        title: title || `⚠️ ${alertLevel} LANDSLIDE ADVISORY`,
        description: description || 'Elevated risk parameters detected. Preparedness required.',
        reason: reason || 'Precipitation threshold exceeded.',
        recommended_action: alertLevel === 'CRITICAL' ? 'Evacuate vulnerable downhill perimeters.' : 'Restrict public traffic.'
      });
      setIsModalOpen(false);
      onRefreshAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Early Warning Alert Management System
          </h2>
          <p className="text-xs text-slate-500 font-medium">Categorized Alert Levels: LOW • MODERATE • HIGH • CRITICAL</p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Broadcast Emergency Alert
          </button>
        )}
      </div>

      {/* Active Warning Alerts Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-600" />
          Active Warnings ({activeAlerts.length})
        </h3>

        {activeAlerts.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2 text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-bold text-sm text-slate-800">All Monitoring Channels Clear</p>
            <p className="text-xs">No active high or critical emergency alerts at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 rounded-3xl border shadow-sm space-y-3 ${
                  alert.alert_level === 'CRITICAL'
                    ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-400'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider ${
                    alert.alert_level === 'CRITICAL' ? 'bg-rose-900 text-white animate-pulse' :
                    alert.alert_level === 'HIGH' ? 'bg-rose-600 text-white' :
                    alert.alert_level === 'MODERATE' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {alert.alert_level}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(alert.created_at).toLocaleString()}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">{alert.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                </div>

                <div className="p-3 bg-slate-100 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-slate-700">Reason Detected:</span>
                  <p className="text-slate-600 font-mono text-[11px]">{alert.reason}</p>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl text-xs space-y-1 border border-amber-200">
                  <span className="font-bold text-amber-900">Recommended Action:</span>
                  <p className="text-amber-950 font-medium">{alert.recommended_action}</p>
                </div>

                <button
                  onClick={() => onDismissAlert(alert.id)}
                  className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Dismiss / Mark Resolved
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Modal for Admins */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900">Broadcast Alert</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Location</label>
                <select
                  value={selectedLocId}
                  onChange={(e) => setSelectedLocId(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Severity Level</label>
                <select
                  value={alertLevel}
                  onChange={(e) => setAlertLevel(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Alert Title</label>
                <input
                  type="text"
                  placeholder="e.g. ⚠️ CRITICAL LANDSLIDE WARNING - OOTY"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Reason / Description</label>
                <textarea
                  rows={2}
                  placeholder="Heavy cloudburst exceeded pore-water threshold..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-rose-600 text-white rounded-xl font-bold">
                Broadcast Alert Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
