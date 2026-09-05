import React, { useState } from 'react';
import { CitizenReport, UserRole } from '../types';
import { FileText, Plus, CheckCircle2, Clock, XCircle, MapPin, Eye } from 'lucide-react';
import { api } from '../services/api';

interface CitizenReportsPageProps {
  reports: CitizenReport[];
  onOpenReportForm: () => void;
  onRefreshReports: () => void;
  currentRole: UserRole;
}

export const CitizenReportsPage: React.FC<CitizenReportsPageProps> = ({
  reports,
  onOpenReportForm,
  onRefreshReports,
  currentRole
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredReports = reports.filter(r => {
    if (filterStatus === 'ALL') return true;
    return r.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleUpdateStatus = async (reportId: number, status: 'Pending' | 'Verified' | 'Rejected') => {
    try {
      await api.updateReportStatus(reportId, status);
      onRefreshReports();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600 shrink-0" />
            Citizen Hazard Reporting Module
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Public crowd-sourced reports of ground cracks, rockfalls, and water pooling</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar max-w-full">
            {['ALL', 'Pending', 'Verified', 'Rejected'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  filterStatus === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenReportForm}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-all w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Submit Hazard Report
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            {/* Image Preview if available */}
            {report.photo_url && (
              <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                <img
                  src={report.photo_url}
                  alt={report.report_type}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {report.report_type.replace('_', ' ')}
                </span>
              </div>
            )}

            <div className="p-5 space-y-3 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Reporter</span>
                  <h4 className="font-bold text-slate-900 text-sm">{report.reporter_name}</h4>
                </div>

                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                  report.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                  report.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {report.status}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                {report.location_name}
              </div>

              <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                "{report.description}"
              </p>

              <div className="text-[10px] text-slate-400 font-mono flex justify-between pt-1">
                <span>Lat: {report.latitude.toFixed(3)}, Long: {report.longitude.toFixed(3)}</span>
                <span>{new Date(report.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Admin Action Buttons if role === 'admin' */}
            {currentRole === 'admin' && (
              <div className="bg-slate-50 p-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleUpdateStatus(report.id, 'Verified')}
                  className="flex-1 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(report.id, 'Rejected')}
                  className="flex-1 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
