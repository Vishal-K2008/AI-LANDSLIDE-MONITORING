import React, { useState } from 'react';
import { BrainCircuit, Sliders, Play, RefreshCw, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { RiskPrediction, RiskLevel } from '../types';

export const AIPredictorTool: React.FC = () => {
  const [rainfall, setRainfall] = useState<number>(85);
  const [moisture, setMoisture] = useState<number>(78);
  const [slope, setSlope] = useState<number>(34);
  const [elevation, setElevation] = useState<number>(1850);
  const [temp, setTemp] = useState<number>(18);
  const [humidity, setHumidity] = useState<number>(88);

  const [prediction, setPrediction] = useState<RiskPrediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRunPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await api.predictCustomRisk({
        rainfall_mm: rainfall,
        soil_moisture_pct: moisture,
        slope_deg: slope,
        elevation_m: elevation,
        temp_c: temp,
        humidity_pct: humidity
      });
      setPrediction(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    handleRunPrediction();
  }, []);

  const getBadgeStyle = (lvl?: RiskLevel) => {
    switch (lvl) {
      case 'CRITICAL': return 'bg-rose-900 text-white animate-pulse';
      case 'HIGH': return 'bg-rose-600 text-white';
      case 'MODERATE': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-600 text-white';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900">
              Interactive AI / ML Risk Simulator
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Adjust environmental inputs to test the trained Scikit-Learn Random Forest prediction model
            </p>
          </div>
        </div>

        <button
          onClick={handleRunPrediction}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          Run AI Inference
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Input Sliders */}
        <div className="space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-teal-600" />
              Parameter Sliders
            </span>
            <span className="text-slate-400">Live Feedback</span>
          </div>

          {/* 1. Rainfall Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Rainfall Intensity (mm)</span>
              <span className="text-teal-700 font-mono font-bold">{rainfall} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={rainfall}
              onChange={(e) => setRainfall(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* 2. Soil Moisture Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Soil Moisture Saturation (%)</span>
              <span className="text-teal-700 font-mono font-bold">{moisture} %</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={moisture}
              onChange={(e) => setMoisture(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* 3. Slope Angle Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Terrain Slope Angle (°)</span>
              <span className="text-teal-700 font-mono font-bold">{slope} °</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={slope}
              onChange={(e) => setSlope(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* 4. Elevation Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Elevation (m)</span>
              <span className="text-teal-700 font-mono font-bold">{elevation} m</span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="50"
              value={elevation}
              onChange={(e) => setElevation(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Temp & Humidity Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-600">Temp (°C)</span>
              <input
                type="number"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-600">Humidity (%)</span>
              <input
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Right Model Prediction Output */}
        <div className="space-y-5 flex flex-col justify-between">
          {prediction ? (
            <>
              {/* Risk Badge Header */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Calculated Risk Output</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold font-display">
                      {Math.round(prediction.risk_probability * 100)}%
                    </span>
                    <span className="text-xs text-slate-400">Probability</span>
                  </div>
                </div>

                <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider ${getBadgeStyle(prediction.risk_level)}`}>
                  {prediction.risk_level}
                </span>
              </div>

              {/* Natural AI Explanation Text */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  AI Natural Language Diagnosis:
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {prediction.ai_explanation}
                </p>
              </div>

              {/* Feature Weights */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Feature Importance Distribution:</p>
                {Object.entries(prediction.feature_importance).map(([key, val]) => (
                  <div key={key} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{key}</span>
                      <span className="font-mono">{val}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Recommendation */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950">
                <strong>Action: </strong>{prediction.recommended_action}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
              Adjust sliders and click "Run AI Inference"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
