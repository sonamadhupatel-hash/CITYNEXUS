import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  X, 
  Zap, 
  Droplets, 
  Trash2, 
  Wind, 
  Thermometer, 
  TrendingDown, 
  TrendingUp, 
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import { District, DistrictTuning } from '../types/cityos';
import { useCitySimulation } from '../context/CitySimulationContext';
import { DISTRICTS_DATA } from '../data/cityData';
import { formatINR } from '../utils/formatters';

interface TuneDistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: District;
}

export const TuneDistrictModal: React.FC<TuneDistrictModalProps> = ({
  isOpen,
  onClose,
  district
}) => {
  const { 
    districts, 
    districtTunings, 
    tuneDistrict, 
    resetDistrictTuning, 
    setSelectedDistrict 
  } = useCitySimulation();

  const [targetDistrictId, setTargetDistrictId] = useState<string>(district.id);
  const currentDistrict = districts.find(d => d.id === targetDistrictId) || district;

  // Local form state for sliders
  const activeTuning = districtTunings[targetDistrictId];
  const [prvPressure, setPrvPressure] = useState<number>(3.8);
  const [bessReserve, setBessReserve] = useState<number>(25);
  const [wasteThreshold, setWasteThreshold] = useState<number>(75);
  const [mistAqiTrigger, setMistAqiTrigger] = useState<number>(65);
  const [hvacShift, setHvacShift] = useState<number>(0.0);

  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployedSuccess, setDeployedSuccess] = useState<boolean>(false);

  // Sync state whenever selected target district or active tuning changes
  useEffect(() => {
    if (activeTuning) {
      setPrvPressure(activeTuning.prvPressureBar);
      setBessReserve(activeTuning.peakShavingReservePct);
      setWasteThreshold(activeTuning.smartWasteThresholdPct);
      setMistAqiTrigger(activeTuning.mistCannonAqiTrigger);
      setHvacShift(activeTuning.hvacPrecoolingDeltaC);
    } else {
      setPrvPressure(currentDistrict.metrics.waterPressureBar || 3.8);
      setBessReserve(25);
      setWasteThreshold(75);
      setMistAqiTrigger(65);
      setHvacShift(0.0);
    }
    setDeployedSuccess(false);
  }, [targetDistrictId, activeTuning]);

  useEffect(() => {
    if (district?.id) {
      setTargetDistrictId(district.id);
    }
  }, [district?.id]);

  // Dynamic Before vs After Projections
  const baselinePressure = 4.2;
  const projectedLeakRisk = prvPressure < 3.8 
    ? Math.max(2, Math.round(currentDistrict.metrics.leakRiskScore * (prvPressure / 3.8) * 0.65))
    : Math.min(95, Math.round(currentDistrict.metrics.leakRiskScore * (prvPressure / 3.8)));

  const projectedPowerShavedMW = parseFloat(((bessReserve - 15) * 0.14).toFixed(1));
  const estimatedMonthlySavingsINR = Math.round(
    (baselinePressure - prvPressure) * 1250000 + 
    (bessReserve * 85000) + 
    ((80 - wasteThreshold) * 45000)
  );

  const handleDeploySetpoints = () => {
    setIsDeploying(true);
    setDeployedSuccess(false);

    // Simulate real SCADA DNP3 / IEC-60870 packet broadcast
    setTimeout(() => {
      tuneDistrict(targetDistrictId, {
        prvPressureBar: prvPressure,
        peakShavingReservePct: bessReserve,
        smartWasteThresholdPct: wasteThreshold,
        mistCannonAqiTrigger: mistAqiTrigger,
        evFleetRouteOptimization: true,
        hvacPrecoolingDeltaC: hvacShift
      });
      setIsDeploying(false);
      setDeployedSuccess(true);
      setSelectedDistrict(currentDistrict);
    }, 700);
  };

  const handleResetDefaults = () => {
    resetDistrictTuning(targetDistrictId);
    setPrvPressure(3.8);
    setBessReserve(25);
    setWasteThreshold(75);
    setMistAqiTrigger(65);
    setHvacShift(0.0);
    setDeployedSuccess(false);
  };

  const handleExportConfig = () => {
    const config = {
      districtId: targetDistrictId,
      districtName: currentDistrict.name,
      deployedAt: new Date().toISOString(),
      setpoints: {
        prvPressureBar: prvPressure,
        peakShavingReservePct: bessReserve,
        smartWasteThresholdPct: wasteThreshold,
        mistCannonAqiTrigger: mistAqiTrigger,
        hvacPrecoolingDeltaC: hvacShift
      },
      projectedSavingsINR: estimatedMonthlySavingsINR
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SCADA_Tuning_${targetDistrictId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* ========================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/90 border border-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-950/50">
              <Sliders className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  District SCADA Actuator & Setpoint Tuning
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  MQTT / DNP3 Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dispatch fine-grained control parameters to district PRVs, BESS inverters, smart waste RTUs, and atmospheric mist cannons.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* DISTRICT TABS SELECTOR */}
        {/* ========================================================= */}
        <div className="bg-slate-950/60 px-5 sm:px-6 py-2.5 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 text-[11px] font-mono uppercase mr-1 shrink-0">
            Target District:
          </span>
          {DISTRICTS_DATA.map((d) => {
            const isSelected = targetDistrictId === d.id;
            const hasTuning = !!districtTunings[d.id];

            return (
              <button
                key={d.id}
                onClick={() => setTargetDistrictId(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{d.name.split(':')[0]}</span>
                {hasTuning && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Custom Tuning Deployed" />
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* MAIN BODY: SLIDERS & LIVE BEFORE/AFTER IMPACT */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Target District Summary Strip */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentDistrict.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {currentDistrict.category}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Population: {currentDistrict.population.toLocaleString()} · Area: {currentDistrict.areaKm2} km² · 2,410 SCADA Nodes
              </div>
            </div>

            {activeTuning ? (
              <div className="flex items-center gap-2 text-xs bg-amber-950/60 border border-amber-800/80 px-3 py-1.5 rounded-xl text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom Setpoints Active (Updated: {activeTuning.lastUpdated || 'Recent'})</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-400 font-mono">
                <span>Nominal Baseline Defaults</span>
              </div>
            )}
          </div>

          {/* 5 Interactive Tuning Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Water PRV Target Pressure */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>Target PRV Pressure Setpoint</span>
                </span>
                <span className="font-mono text-cyan-300 font-bold text-sm bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {prvPressure} bar
                </span>
              </div>

              <input
                type="range"
                min="2.8"
                max="4.8"
                step="0.1"
                value={prvPressure}
                onChange={(e) => setPrvPressure(parseFloat(e.target.value))}
                className="w-full accent-blue-400 h-2 bg-slate-800 rounded appearance-none cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2.8 bar (Low Loss)</span>
                <span className="text-cyan-400 font-bold">3.8 bar (Nominal)</span>
                <span>4.8 bar (High Stress)</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                Trimming pressure to ≤3.4 bar minimizes nighttime pipe rupture risk while maintaining 2.5 bar minimal residential tap pressure.
              </p>
            </div>

            {/* 2. BESS Peak Shaving & Islanding Reserve */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>BESS Peak Shaving Reserve</span>
                </span>
                <span className="font-mono text-cyan-300 font-bold text-sm bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {bessReserve}%
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={bessReserve}
                onChange={(e) => setBessReserve(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded appearance-none cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10% (Aggressive Peak Shaving)</span>
                <span className="text-cyan-400 font-bold">25% (Standard)</span>
                <span>50% (High Resilience)</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                Allocates battery capacity to clip substation 14:00-18:00 high tariff peaks vs preserving black-start emergency capacity.
              </p>
            </div>

            {/* 3. Smart Waste Dynamic Collection Threshold */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Trash2 className="w-4 h-4 text-emerald-400" />
                  <span>Smart Waste Dispatch Threshold</span>
                </span>
                <span className="font-mono text-emerald-300 font-bold text-sm bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {wasteThreshold}% fill
                </span>
              </div>

              <input
                type="range"
                min="50"
                max="85"
                step="5"
                value={wasteThreshold}
                onChange={(e) => setWasteThreshold(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 h-2 bg-slate-800 rounded appearance-none cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50% (Early Route Dispatch)</span>
                <span className="text-emerald-400 font-bold">75% (Nominal)</span>
                <span>85% (Maximum Fleet Efficiency)</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                Triggers autonomous EV compaction collection truck routing once IoT ultrasound sensors detect threshold fill level.
              </p>
            </div>

            {/* 4. Atmospheric Mist-Cannon Trigger AQI */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Wind className="w-4 h-4 text-amber-400" />
                  <span>Mist-Cannon Auto Trigger (AQI)</span>
                </span>
                <span className="font-mono text-amber-300 font-bold text-sm bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  {mistAqiTrigger} AQI
                </span>
              </div>

              <input
                type="range"
                min="40"
                max="90"
                step="5"
                value={mistAqiTrigger}
                onChange={(e) => setMistAqiTrigger(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 h-2 bg-slate-800 rounded appearance-none cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>40 AQI (Clean Air Priority)</span>
                <span className="text-amber-400 font-bold">65 AQI (Balanced)</span>
                <span>90 AQI (Water Conservation)</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                Autonomous boundary atomization cannons engage when local optical particle counters detect PM2.5 exceedance.
              </p>
            </div>

            {/* 5. HVAC Pre-Cooling Shift */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Thermometer className="w-4 h-4 text-rose-400" />
                  <span>HVAC Building Thermal Pre-Cooling Shift (°C)</span>
                </span>
                <span className="font-mono text-rose-300 font-bold text-sm bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                  {hvacShift > 0 ? `+${hvacShift}` : hvacShift}°C
                </span>
              </div>

              <input
                type="range"
                min="-2.0"
                max="2.0"
                step="0.5"
                value={hvacShift}
                onChange={(e) => setHvacShift(parseFloat(e.target.value))}
                className="w-full accent-rose-400 h-2 bg-slate-800 rounded appearance-none cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-2.0°C (Pre-chill building thermal mass before peak)</span>
                <span className="text-rose-400 font-bold">0.0°C (Unadjusted)</span>
                <span>+2.0°C (Demand Curtailment)</span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* LIVE IMPACT PROJECTION & FINANCIAL SAVINGS (INR ₹) */}
          {/* ========================================================= */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 p-5 rounded-2xl border border-emerald-800/60 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Simulated Impact Projection for {currentDistrict.name}</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                ESTIMATED IN INDIAN RUPEES (₹)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Acoustic Pipe Leak Risk</span>
                <div className="text-lg font-bold text-cyan-300 mt-1">
                  {currentDistrict.metrics.leakRiskScore} → {projectedLeakRisk} / 100
                </div>
                <span className="text-[10px] text-emerald-400">
                  {projectedLeakRisk < currentDistrict.metrics.leakRiskScore ? `-${Math.round((1 - projectedLeakRisk / Math.max(1, currentDistrict.metrics.leakRiskScore)) * 100)}% Burst Risk` : 'Nominal'}
                </span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">District Peak Shaved</span>
                <div className="text-lg font-bold text-indigo-300 mt-1">
                  +{projectedPowerShavedMW} MW
                </div>
                <span className="text-[10px] text-slate-400">
                  Substation Feeder Headroom
                </span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Estimated OpEx Saved</span>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  {formatINR(estimatedMonthlySavingsINR)} <span className="text-xs font-normal text-slate-400">/ mo</span>
                </div>
                <span className="text-[10px] text-emerald-400">
                  ₹{(estimatedMonthlySavingsINR / 100000).toFixed(1)} Lakh monthly
                </span>
              </div>
            </div>

            {deployedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Setpoints successfully synchronized across 2,410 IoT SCADA RTUs in <strong>{currentDistrict.name}</strong>.
                </span>
              </div>
            )}
          </div>

        </div>

        {/* ========================================================= */}
        {/* MODAL FOOTER */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-medium border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Nominal Defaults</span>
            </button>

            <button
              onClick={handleExportConfig}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-colors border border-slate-800"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export JSON</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-slate-700"
            >
              Cancel
            </button>

            <button
              onClick={handleDeploySetpoints}
              disabled={isDeploying}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isDeploying ? 'animate-bounce' : ''}`} />
              <span>{isDeploying ? 'Transmitting to RTUs...' : 'Deploy Setpoints to District RTU'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
