import React, { useState } from 'react';
import { Location } from '../types';
import { AIPredictorTool } from '../components/AIPredictorTool';
import { AIExplanationModal } from '../components/AIExplanationModal';
import { BrainCircuit, Sparkles, Sliders, ShieldAlert, Cpu } from 'lucide-react';

interface AIAnalysisPageProps {
  locations: Location[];
}

export const AIAnalysisPage: React.FC<AIAnalysisPageProps> = ({ locations }) => {
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(locations[0] || null);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              Scikit-Learn ML Core
            </span>
            <span className="text-xs text-slate-400">Random Forest Ensemble Classifier</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-teal-400 animate-pulse" />
            AI Landslide Risk Analysis & Machine Learning Center
          </h2>
          <p className="text-xs text-slate-300 font-medium max-w-2xl">
            Combining current environmental telemetry, historical landslide records, rainfall patterns, pore-water pressure, slope incline, and microclimate indicators.
          </p>
        </div>

        <button
          onClick={() => setIsExplanationOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg hover:brightness-110 transition-all self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4" />
          "Why is this area risky?" Explainer
        </button>
      </div>

      {/* Interactive AI ML Playground Tool */}
      <AIPredictorTool />

      {/* AI Explanation Modal */}
      <AIExplanationModal
        location={selectedLoc}
        prediction={null}
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
      />
    </div>
  );
};
