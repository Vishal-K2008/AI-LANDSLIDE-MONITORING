import React, { useState } from 'react';
import { Camera, Send, CheckCircle2, X } from 'lucide-react';
import { CitizenReportType } from '../types';
import { api } from '../services/api';

interface CitizenReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CitizenReportForm: React.FC<CitizenReportFormProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [reporterName, setReporterName] = useState('');
  const [locationName, setLocationName] = useState('Shillong - Sohra Highway KM 22');
  const [reportType, setReportType] = useState<CitizenReportType>('ground_cracks');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState<number>(25.285);
  const [longitude, setLongitude] = useState<number>(91.738);
  const [photoUrl, setPhotoUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitCitizenReport({
        reporter_name: reporterName || 'Anonymous Citizen',
        location_name: locationName,
        report_type: reportType,
        description: description,
        latitude: latitude,
        longitude: longitude,
        photo_url: photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80'
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-400/30 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-display text-sm sm:text-base">Submit Citizen Hazard Report</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Report ground cracks, rockfalls, or water accumulation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-900 text-base sm:text-lg">Report Submitted Successfully!</h4>
            <p className="text-xs text-slate-500">Your hazard report has been recorded and routed to the admin monitoring dashboard for verification.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4 text-xs overflow-y-auto">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Tenzing Sangma"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location Name / Landmark *</label>
              <input
                type="text"
                required
                placeholder="e.g. Shillong - Sohra Highway KM 22"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hazard Category *</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as CitizenReportType)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                >
                  <option value="ground_cracks">Ground Cracks</option>
                  <option value="rockfall">Rockfall / Falling Boulders</option>
                  <option value="water_accumulation">Water Accumulation / Overflow</option>
                  <option value="soil_movement">Soil Movement / Subsidence</option>
                  <option value="landslide">Active Landslide Slip</option>
                  <option value="other">Other Road Hazard</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coordinates (Lat, Long)</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="0.001"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-1/2 p-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px]"
                  />
                  <input
                    type="number"
                    step="0.001"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="w-1/2 p-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hazard Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe observed cracks, water flow, or slope movement details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Photo Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Hazard Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
