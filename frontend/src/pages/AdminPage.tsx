import React from 'react';
import { Location, DashboardStats, CitizenReport, EarlyWarningAlert } from '../types';
import { ShieldCheck, CloudRain, RefreshCw, FileText } from 'lucide-react';
import { api } from '../services/api';

interface AdminPageProps {
  stats: DashboardStats | null;
  locations: Location[];
  reports: CitizenReport[];
  alerts: EarlyWarningAlert[];
  onTriggerSimulation: () => void;
  onRefreshData: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  stats,
  locations,
  reports,
  alerts,
  onTriggerSimulation,
  onRefreshData
}) => {
  const handleResetSimulation = async () => {
    await api.resetSimulation();
    onRefreshData();
  };

  const handleUpdateReport = async (id: number, status: 'Pending' | 'Verified' | 'Rejected') => {
    await api.updateReportStatus(id, status);
    onRefreshData();
  };

  return (
    <div className="p-3 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30">
            Admin Command Center
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2 mt-1">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 shrink-0" />
            System Administration & Emergency Operations
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">
            Real-time control over sensor simulation triggers, citizen report approvals, and early warning broadcasts
          </p>
        </div>

        {/* Simulation Triggers */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={onTriggerSimulation}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition-all"
          >
            <CloudRain className="w-4 h-4" />
            Trigger Monsoon Downpour
          </button>
          <button
            onClick={handleResetSimulation}
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Baseline
          </button>
        </div>
      </div>

      {/* Admin Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Monitored Locations</p>
          <p className="text-xl sm:text-2xl font-bold font-display text-slate-900">{stats?.total_locations || locations.length}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">High Risk Sites</p>
          <p className="text-xl sm:text-2xl font-bold font-display text-rose-600">{stats?.high_risk_locations || 3}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Active Alerts</p>
          <p className="text-xl sm:text-2xl font-bold font-display text-amber-600">{stats?.active_alerts || alerts.length}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Pending Reports</p>
          <p className="text-xl sm:text-2xl font-bold font-display text-purple-600">{stats?.pending_citizen_reports || 1}</p>
        </div>
      </div>

      {/* Citizen Reports Management Table */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold font-display text-slate-900 text-sm sm:text-base flex items-center gap-2">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0" />
          Pending Citizen Hazard Verification Workflow
        </h3>

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-2">Reporter</th>
                <th className="pb-3 px-2">Location</th>
                <th className="pb-3 px-2">Hazard Type</th>
                <th className="pb-3 px-2">Description</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50">
                  <td className="py-3 px-2 font-bold text-slate-900">{rep.reporter_name}</td>
                  <td className="py-3 px-2 text-slate-700">{rep.location_name}</td>
                  <td className="py-3 px-2 font-semibold text-purple-700 capitalize">{rep.report_type.replace('_', ' ')}</td>
                  <td className="py-3 px-2 text-slate-600 max-w-xs truncate">"{rep.description}"</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      rep.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                      rep.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right space-x-1">
                    <button
                      onClick={() => handleUpdateReport(rep.id, 'Verified')}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateReport(rep.id, 'Rejected')}
                      className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-bold hover:bg-rose-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
