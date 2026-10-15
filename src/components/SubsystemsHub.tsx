import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Trash2, 
  Wind, 
  BatteryCharging, 
  ArrowUpRight, 
  ArrowDownRight, 
  Gauge, 
  Truck, 
  Compass, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  Play,
  CheckCircle,
  Thermometer,
  Volume2,
  TreeDeciduous,
  Clock,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useCitySimulation } from '../context/CitySimulationContext';
import { SubsystemType } from '../types/cityos';

export const SubsystemsHub: React.FC = () => {
  const { 
    energyMetrics, 
    waterMetrics, 
    wasteMetrics, 
    environmentMetrics,
    hourlyProfiles,
    currentHour,
    manualOverrides,
    setManualOverride
  } = useCitySimulation();

  const [activeSubsystem, setActiveSubsystem] = useState<SubsystemType>('energy');
  const [energyZoom, setEnergyZoom] = useState<number>(1);
  const [waterZoom, setWaterZoom] = useState<number>(1);
  const [envZoom, setEnvZoom] = useState<number>(1);
  const [wasteZoom, setWasteZoom] = useState<number>(1);

  const renderZoomToolbar = (zoom: number, setZoom: React.Dispatch<React.SetStateAction<number>>, label: string) => (
    <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 text-xs">
      <span className="text-[10px] text-slate-500 font-mono uppercase mr-0.5">Zoom:</span>
      <button
        onClick={() => setZoom(prev => Math.max(1, parseFloat((prev - 0.25).toFixed(2))))}
        disabled={zoom <= 1}
        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title={`Zoom Out ${label} (-)`}
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>
      <span className="font-mono text-cyan-300 font-bold px-1 min-w-[38px] text-center text-[11px]">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={() => setZoom(prev => Math.min(2.5, parseFloat((prev + 0.25).toFixed(2))))}
        disabled={zoom >= 2.5}
        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title={`Zoom In ${label} (+)`}
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
      {zoom > 1 && (
        <button
          onClick={() => setZoom(1)}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Reset Zoom to 100%"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Subsystem Selector Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        <button
          onClick={() => setActiveSubsystem('energy')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
            activeSubsystem === 'energy'
              ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Energy Grid & Storage</span>
          <span className="font-mono text-[10px] text-cyan-400">({energyMetrics.totalDemandMW} MW)</span>
        </button>

        <button
          onClick={() => setActiveSubsystem('water')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
            activeSubsystem === 'water'
              ? 'bg-blue-950 border-blue-500 text-blue-300 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Droplets className="w-4 h-4 text-blue-400" />
          <span>Water & Leak FSM</span>
          <span className="font-mono text-[10px] text-blue-400">({waterMetrics.averagePressureBar} bar)</span>
        </button>

        <button
          onClick={() => setActiveSubsystem('waste')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
            activeSubsystem === 'waste'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trash2 className="w-4 h-4 text-emerald-400" />
          <span>Smart Waste & Logistics</span>
          <span className="font-mono text-[10px] text-emerald-400">({wasteMetrics.activeTrucks} Trucks)</span>
        </button>

        <button
          onClick={() => setActiveSubsystem('environment')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
            activeSubsystem === 'environment'
              ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wind className="w-4 h-4 text-amber-400" />
          <span>AQI & Urban Microclimate</span>
          <span className="font-mono text-[10px] text-amber-400">(AQI {environmentMetrics.cityAqiAvg})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. ENERGY SUBSYSTEM VIEW */}
      {/* ========================================================= */}
      {activeSubsystem === 'energy' && (
        <div className="space-y-6">
          {/* Energy Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Total Demand (Optimized)</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
                {energyMetrics.totalDemandMW} <span className="text-xs font-normal text-slate-400">MW</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <span>Shaved Peak:</span>
                <span className="font-mono font-bold">-{energyMetrics.peakShavedMW} MW</span>
                <span className="text-slate-500 font-normal">vs unmanaged</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Renewable Generation</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  {energyMetrics.renewableSharePct}% of Grid
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1.5 tabular-nums">
                {(energyMetrics.solarGenMW + energyMetrics.windGenMW).toFixed(1)} <span className="text-xs font-normal text-slate-400">MW</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Solar: <span className="font-mono text-cyan-300">{energyMetrics.solarGenMW}MW</span> · Wind: <span className="font-mono text-blue-300">{energyMetrics.windGenMW}MW</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Central BESS Battery Storage</span>
                <BatteryCharging className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-indigo-300 mt-1.5 tabular-nums">
                {energyMetrics.batterySocPct}% <span className="text-xs font-normal text-slate-400">SOC</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Active Dispatch: <span className="font-mono text-amber-300 font-bold">{energyMetrics.batteryPowerMW > 0 ? `+${energyMetrics.batteryPowerMW} MW (Discharging)` : 'Standby / Float'}</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Grid Emissions Intensity</span>
                <Activity className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
                {energyMetrics.carbonRateKgPerMWh} <span className="text-xs font-normal text-slate-400">kg CO2/MWh</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                -70.7% reduction vs coal baseline (382 kg)
              </div>
            </div>
          </div>

          {/* 24-Hour Peak Shaving & Renewable Dispatch Curves */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>24-Hour Power Dispatch & Peak Shaving Performance</span>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                    MATLAB: energy_dispatch.m + energy_battery.m
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparison of Unoptimized Baseline Demand (red line) vs City Nexus Autonomous Dispatch (cyan line).
                </p>
              </div>

              {/* Chart Legend & Zoom Controls */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-0.5 bg-rose-500 inline-block" /> Baseline Demand
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> City Nexus Shaved
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-2 bg-amber-500/30 border border-amber-400 inline-block" /> Solar PV
                  </span>
                </div>
                {renderZoomToolbar(energyZoom, setEnergyZoom, 'Power Dispatch')}
              </div>
            </div>

            {/* SVG Visual Dispatch Chart */}
            <div className="w-full bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-inner">
              {energyZoom > 1 && (
                <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-md border border-cyan-800/60 mb-2.5 flex items-center justify-between">
                  <span>↔ Scroll horizontally to inspect all 24-hour dispatch values at {Math.round(energyZoom * 100)}% resolution</span>
                  <button onClick={() => setEnergyZoom(1)} className="hover:text-cyan-200 underline">Reset 100%</button>
                </div>
              )}
              <div className="w-full overflow-x-auto pb-1">
                <div style={{ width: `${Math.round(100 * energyZoom)}%`, minWidth: `${Math.round(750 * energyZoom)}px`, transition: 'all 0.2s ease-out' }}>
                  <svg viewBox="0 0 820 230" className="w-full h-auto max-h-[300px] block select-none" preserveAspectRatio="none">
                  {/* Horizontal gridlines */}
                  {[0, 50, 100, 150].map((val) => {
                    const y = 200 - (val / 160) * 175;
                    return (
                      <g key={val}>
                        <line x1="55" y1={y} x2="790" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="48" y={y + 3.5} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                          {val}MW
                        </text>
                      </g>
                    );
                  })}

                {/* Solar area fill */}
                <path
                  d={`M 40 220 ${hourlyProfiles.map((p, idx) => {
                    const x = 40 + (idx / 23) * 740;
                    const y = 220 - (p.solarMW / 160) * 200;
                    return `L ${x} ${y}`;
                  }).join(' ')} L 780 220 Z`}
                  fill="#f59e0b"
                  fillOpacity="0.15"
                />

                {/* Baseline demand line (Red) */}
                <polyline
                  points={hourlyProfiles.map((p, idx) => {
                    const x = 40 + (idx / 23) * 740;
                    const y = 220 - (p.baselineEnergyMW / 160) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />

                {/* CityOS Optimized demand line (Cyan) */}
                <polyline
                  points={hourlyProfiles.map((p, idx) => {
                    const x = 40 + (idx / 23) * 740;
                    const y = 220 - (p.optimizedEnergyMW / 160) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                />

                {/* Current Hour Indicator Marker */}
                <g transform={`translate(${40 + (currentHour / 23) * 740}, 0)`}>
                  <line x1="0" y1="20" x2="0" y2="220" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="0" cy="220 - (energyMetrics.totalDemandMW / 160) * 200" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                  <rect x="-24" y="2" width="48" height="16" rx="3" fill="#0369a1" />
                  <text x="0" y="14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {String(currentHour).padStart(2, '0')}:00
                  </text>
                </g>

                {/* Show exact numerical values on all points when zoomed in */}
                {energyZoom >= 1.25 && hourlyProfiles.map((p, idx) => {
                  const x = 40 + (idx / 23) * 740;
                  const optY = 220 - (p.optimizedEnergyMW / 160) * 200;
                  const baseY = 220 - (p.baselineEnergyMW / 160) * 200;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={baseY} r="2.5" fill="#ef4444" />
                      <text x={x} y={baseY - 7} fill="#f87171" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {p.baselineEnergyMW.toFixed(0)}M
                      </text>
                      <circle cx={x} cy={optY} r="3" fill="#06b6d4" />
                      <text x={x} y={optY + 11} fill="#22d3ee" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {p.optimizedEnergyMW.toFixed(0)}M
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

            {/* Quick Interactive Actuator for Energy */}
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-300 font-medium">BESS Override Dispatch:</span>
                <button
                  onClick={() => setManualOverride('batteryForceDischargeMW', manualOverrides.batteryForceDischargeMW === 0 ? 15 : 0)}
                  className={`px-3 py-1.5 rounded-lg border font-mono transition-colors ${
                    manualOverrides.batteryForceDischargeMW > 0
                      ? 'bg-amber-950 border-amber-600 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {manualOverrides.batteryForceDischargeMW > 0 ? 'Discharging 15MW (Active)' : 'Auto Dispatch (Nominal)'}
                </button>
              </div>

              <div className="text-slate-400 text-[11px]">
                Peak tariff saving: <span className="font-mono text-cyan-400 font-bold">₹1.53 Lakh / hr</span> during 14:00 peak hours.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. WATER SUBSYSTEM VIEW */}
      {/* ========================================================= */}
      {activeSubsystem === 'water' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Alpine Reservoir Level</span>
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
                {waterMetrics.reservoirLevelPct}% <span className="text-xs font-normal text-slate-400">Full</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                Storage: {(waterMetrics.reservoirVolumeM3 / 1000000).toFixed(2)} Million m³
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Distribution Flow Rate</span>
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
                {waterMetrics.networkFlowM3h.toLocaleString()} <span className="text-xs font-normal text-slate-400">m³/h</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Avg Pressure: <span className="font-mono text-blue-300 font-bold">{waterMetrics.averagePressureBar} bar</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Non-Revenue Water Loss</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">-36.3%</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1.5 tabular-nums">
                {waterMetrics.waterLossRatePct}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Legacy baseline: <span className="font-mono text-rose-400">24.8%</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Acoustic Leak Detection FSM</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-bold font-mono text-cyan-300 mt-1.5 truncate">
                {waterMetrics.leakFsmState}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Active alerts: <span className="font-mono text-slate-200">{waterMetrics.activeLeaksDetected} localized</span>
              </div>
            </div>
          </div>

          {/* FSM State Machine Diagram: leak_fsm.m */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Automated Acoustic Leak Detection Finite State Machine (leak_fsm.m)</span>
                <span className="text-[10px] font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                  MATLAB Twin FSM
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulates real-time pipe acoustic hydrophone correlators detecting pressure drop and micro-frequency hiss waveforms.
              </p>
            </div>

            {/* Visual State Sequence */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { state: 'MONITORING', title: '1. Monitoring', desc: 'Hydrophones sampling at 100Hz' },
                { state: 'ACOUSTIC_ANOMALY', title: '2. Anomaly Waveform', desc: 'Cross-correlation peak detected' },
                { state: 'LOCALIZED', title: '3. Localized', desc: 'TDOA coordinates within ±3m' },
                { state: 'VALVE_ISOLATED', title: '4. Motor Valve Isolation', desc: 'Gate valves V-14/15 closed' },
                { state: 'REPAIR_SCHEDULED', title: '5. Repair Dispatched', desc: 'Work order sent to field crew' },
              ].map((step, idx) => {
                const isActive = waterMetrics.leakFsmState === step.state;
                return (
                  <div 
                    key={step.state}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                      isActive 
                        ? 'bg-blue-950/80 border-blue-500 text-blue-200 shadow-lg shadow-blue-500/10' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>{step.title}</span>
                      {isActive && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Pipe Burst Simulation Controls */}
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-300 font-medium">Motor Valve Emergency Override:</span>
                <button
                  onClick={() => setManualOverride('valveIsolationOverride', !manualOverrides.valveIsolationOverride)}
                  className={`px-3 py-1.5 rounded-lg border font-mono transition-colors ${
                    manualOverrides.valveIsolationOverride
                      ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {manualOverrides.valveIsolationOverride ? 'Valves V-14/15 ISOLATED' : 'Valves Open (Nominal)'}
                </button>
              </div>

              <div className="text-slate-400 text-[11px]">
                Pressure stabilization: <span className="font-mono text-blue-400 font-bold">3.8 bar maintained</span> across residential nodes.
              </div>
            </div>
          </div>

          {/* 24-Hour Municipal Water Demand & Pressure Modulation Graphical Chart */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>24-Hour Water Demand & Pressure Management Curve</span>
                  <span className="text-[10px] font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                    MATLAB: water_flow.m + prv_control.m
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated Pressure Reducing Valves (PRVs) lower nocturnal pipe pressure from 4.8 bar to 3.4 bar, preventing pipe fatigue and saving 36.3% water loss.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-2 bg-blue-500/20 border border-blue-400 inline-block rounded-xs" /> Water Demand (m³/h)
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Regulated Pressure (bar)
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-0.5 bg-rose-500 inline-block stroke-dash" /> Unmanaged Pressure (bar)
                  </span>
                </div>
                {renderZoomToolbar(waterZoom, setWaterZoom, 'Water Demand')}
              </div>
            </div>

            <div className="w-full bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-inner">
              {waterZoom > 1 && (
                <div className="text-[10px] font-mono text-blue-400 bg-blue-950/40 px-3 py-1 rounded-md border border-blue-800/60 mb-2.5 flex items-center justify-between">
                  <span>↔ Scroll horizontally to inspect water demand and pressure values at {Math.round(waterZoom * 100)}% resolution</span>
                  <button onClick={() => setWaterZoom(1)} className="hover:text-blue-200 underline">Reset 100%</button>
                </div>
              )}
              <div className="w-full overflow-x-auto pb-1">
                <div style={{ width: `${Math.round(100 * waterZoom)}%`, minWidth: `${Math.round(750 * waterZoom)}px`, transition: 'all 0.2s ease-out' }}>
                  <svg viewBox="0 0 820 220" className="w-full h-auto max-h-[300px] block select-none" preserveAspectRatio="none">
                  {/* Horizontal gridlines */}
                  {[0, 4000, 8000, 12000, 16000].map((val) => {
                    const y = 180 - (val / 16000) * 150;
                    return (
                      <g key={val}>
                        <line x1="55" y1={y} x2="790" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="48" y={y + 3.5} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                          {val}m³
                        </text>
                      </g>
                    );
                  })}

                {/* Shaded water demand area */}
                <path
                  d={`M 40 190 ${hourlyProfiles.map((p, idx) => {
                    const x = 40 + (idx / 23) * 740;
                    const y = 190 - (p.waterDemandM3 / 16000) * 160;
                    return `L ${x} ${y}`;
                  }).join(' ')} L 780 190 Z`}
                  fill="#3b82f6"
                  fillOpacity="0.18"
                />

                {/* Water demand curve */}
                <polyline
                  points={hourlyProfiles.map((p, idx) => {
                    const x = 40 + (idx / 23) * 740;
                    const y = 190 - (p.waterDemandM3 / 16000) * 160;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2.5"
                />

                {/* Unmanaged static high pressure line (Red dashed around 4.8 bar) */}
                <line x1="40" y1="46" x2="780" y2="46" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="784" y="50" fill="#ef4444" fontSize="9" fontFamily="monospace">
                  Legacy: 4.8 bar
                </text>

                {/* City Nexus Dynamic modulated pressure line (Cyan) */}
                <polyline
                  points={hourlyProfiles.map((p, idx) => {
                    const x = 40 + (idx / 23) * 740;
                    // Pressure modulated between 3.4 bar (night) and 4.2 bar (peak day)
                    const bar = idx >= 7 && idx <= 20 ? 4.1 : 3.4;
                    const y = 190 - (bar / 6) * 160;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3"
                />
                <text x="784" y="96" fill="#22d3ee" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  City Nexus: 3.4-4.1 bar
                </text>

                {/* Current Hour Indicator Marker */}
                <g transform={`translate(${40 + (currentHour / 23) * 740}, 0)`}>
                  <line x1="0" y1="20" x2="0" y2="190" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <rect x="-24" y="2" width="48" height="16" rx="3" fill="#0369a1" />
                  <text x="0" y="14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {String(currentHour).padStart(2, '0')}:00
                  </text>
                </g>

                {/* Numerical Values displayed when zoomed in */}
                {waterZoom >= 1.25 && hourlyProfiles.map((p, idx) => {
                  const x = 40 + (idx / 23) * 740;
                  const y = 190 - (p.waterDemandM3 / 16000) * 160;
                  const bar = idx >= 7 && idx <= 20 ? 4.1 : 3.4;
                  const barY = 190 - (bar / 6) * 160;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="3" fill="#60a5fa" />
                      <text x={x} y={y - 7} fill="#93c5fd" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {(p.waterDemandM3 / 1000).toFixed(1)}k
                      </text>
                      <circle cx={x} cy={barY} r="2.5" fill="#22d3ee" />
                      <text x={x} y={barY + 11} fill="#67e8f9" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {bar}b
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* ========================================================= */}
      {/* 3. WASTE MANAGEMENT VIEW */}
      {/* ========================================================= */}
      {activeSubsystem === 'waste' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Smart Bins Average Fill</span>
                <Trash2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
                {wasteMetrics.avgFillLevelPct}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Threshold Alerts: <span className="font-mono text-amber-400 font-bold">{wasteMetrics.binsAboveThreshold} bins &gt; 80%</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Active EV Truck Fleet</span>
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
                {wasteMetrics.activeTrucks} / 8 <span className="text-xs font-normal text-slate-400">Units</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Daily Route: <span className="font-mono text-emerald-300 font-bold">{wasteMetrics.routeCompletionPct}% Done</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Landfill Diversion Rate</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">+28.4%</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1.5 tabular-nums">
                {wasteMetrics.landfillDiversionPct}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Automated optical robotic sorting active
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Fleet Fuel & Mileage Saved</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">TSP Engine</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
                -{wasteMetrics.fleetFuelSavedPct}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Daily collected: <span className="font-mono text-slate-200">{wasteMetrics.dailyCollectedTons} tons</span>
              </div>
            </div>
          </div>

          {/* Dynamic Route Optimizer & TSP Benchmark */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Dynamic Vehicle Routing (waste_route.m + truck_fsm.m)</span>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  Genetic Algorithm + TSP Optimization
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Legacy static schedules drive fixed 1,420 km daily regardless of bin fullness. City Nexus computes dynamic TSP clusters only picking bins above 75% fill.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-rose-300">Legacy Static Route Protocol</div>
                <ul className="space-y-1.5 text-slate-400 text-[11px]">
                  <li>• Fixed calendar collection (Mon/Wed/Fri 06:00).</li>
                  <li>• Empties 48% empty or half-full bins redundantly.</li>
                  <li>• Total daily distance: <span className="font-mono text-rose-400 font-bold">1,420 km</span>.</li>
                  <li>• Overflow incidents: ~38 per month during peak events.</li>
                </ul>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-emerald-800/60 space-y-2">
                <div className="font-bold text-emerald-300">City Nexus IoT Dynamic TSP Engine</div>
                <ul className="space-y-1.5 text-slate-400 text-[11px]">
                  <li>• Ultrasound IoT fill telemetry polled every 15 minutes.</li>
                  <li>• Autonomous dynamic route generation via Travelling Salesperson solver.</li>
                  <li>• Total daily distance: <span className="font-mono text-emerald-400 font-bold">997 km (-29.8% saved)</span>.</li>
                  <li>• Overflow incidents: <span className="font-mono text-emerald-400 font-bold">0 per month</span>.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Graphical Fleet Distance & District Bin Fill Distribution */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Smart Waste Logistics & District Fill Level Distribution</span>
                  <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    GRAPHICAL ANALYSIS
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual comparison of daily mileage savings and live ultrasonic bin fill levels across the 5 districts.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                  -423 KM SAVED DAILY (-29.8%)
                </div>
                {renderZoomToolbar(wasteZoom, setWasteZoom, 'Waste Logistics')}
              </div>
            </div>

            {wasteZoom > 1 && (
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-md border border-emerald-800/60 mb-2 flex items-center justify-between">
                <span>↔ Scroll horizontally to inspect fleet mileage and district bin fill levels at {Math.round(wasteZoom * 100)}% resolution</span>
                <button onClick={() => setWasteZoom(1)} className="hover:text-emerald-200 underline">Reset 100%</button>
              </div>
            )}

            <div className="w-full overflow-x-auto pb-1">
              <div style={{ width: `${Math.round(100 * wasteZoom)}%`, minWidth: `${Math.round(750 * wasteZoom)}px`, transition: 'all 0.2s ease-out' }}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Daily Mileage Comparison Bars (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Fleet Travel Distance Comparison</span>
                
                {/* Legacy Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Legacy Static Route:</span>
                    <span className="text-rose-400 font-bold">1,420 km</span>
                  </div>
                  <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-600 to-rose-500 rounded-full w-full" />
                  </div>
                </div>

                {/* City Nexus Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>City Nexus Dynamic TSP:</span>
                    <span className="text-emerald-400 font-bold">997 km (-29.8%)</span>
                  </div>
                  <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full w-[70.2%]" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>EV Fuel Economy: 0.85 kWh/km</span>
                  <span className="text-emerald-400 font-bold">₹35,950 saved/day</span>
                </div>
              </div>

              {/* 5-District Bin Fill Level Histogram (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">District Ultrasonic Fill Levels & Dispatch Priority</span>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {[
                    { district: 'D1: Downtown', fill: 68, color: 'from-amber-500 to-amber-600' },
                    { district: 'D2: Tech', fill: 42, color: 'from-emerald-500 to-emerald-600' },
                    { district: 'D3: Resid.', fill: 58, color: 'from-blue-500 to-blue-600' },
                    { district: 'D4: Port', fill: 84, color: 'from-rose-500 to-rose-600' },
                    { district: 'D5: Nature', fill: 22, color: 'from-emerald-400 to-teal-500' },
                  ].map((d, dIdx) => (
                    <div key={dIdx} className="space-y-1.5 flex flex-col items-center">
                      <div className="h-24 w-full bg-slate-800/80 rounded-lg flex flex-col justify-end p-1 overflow-hidden">
                        <div 
                          className={`w-full rounded bg-gradient-to-t ${d.color} transition-all duration-700`}
                          style={{ height: `${d.fill}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-white tabular-nums">{d.fill}%</span>
                      <span className="text-[10px] text-slate-400 truncate w-full">{d.district}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* ========================================================= */}
      {/* 4. ENVIRONMENT & AQI VIEW */}
      {/* ========================================================= */}
      {activeSubsystem === 'environment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Citywide Average AQI</span>
                <Wind className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
                {environmentMetrics.cityAqiAvg}
                <span className="text-xs font-normal text-slate-400 ml-1">
                  {environmentMetrics.cityAqiAvg <= 50 ? '(Good)' : environmentMetrics.cityAqiAvg <= 100 ? '(Moderate)' : '(Unhealthy)'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                PM2.5: {environmentMetrics.pm25UgM3} µg/m³ · PM10: {environmentMetrics.pm10UgM3} µg/m³
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Urban Heat Island (UHI) Δ</span>
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
                +{environmentMetrics.urbanHeatIslandDeltaC}°C
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                Mitigated by permeable pavements & sky canopies
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Active Aerosol Mist Cannons</span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">Auto-Scrub</span>
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-1.5 tabular-nums">
                {environmentMetrics.activeMistCannons} / 16
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Particulate knock-down rate: ~64%
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Green Canopy Carbon Sinks</span>
                <TreeDeciduous className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-1.5 tabular-nums">
                {environmentMetrics.greenCanopyAbsorptionTons} <span className="text-xs font-normal text-slate-400">t/mo</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Alpine reserve + vertical forest facades
              </div>
            </div>
          </div>

          {/* Interactive Mist Cannon Actuator */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Gaussian Dispersion & Atmospheric Mitigation (env_pm_model.m)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated high-pressure mist cannons generate 10-micron water fog to bind airborne particulate matter and reduce ground PM2.5 within 25 minutes.
                </p>
              </div>

              <button
                onClick={() => setManualOverride('forceMistCannons', !manualOverrides.forceMistCannons)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                  manualOverrides.forceMistCannons
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {manualOverrides.forceMistCannons ? '16 Mist Cannons FORCED ON' : 'Trigger All Mist Cannons'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">EPA AQI Range 0-50</span>
                <span className="font-bold text-emerald-400">Good / Clean Baseline</span>
                <p className="text-[11px] text-slate-500 mt-1">Air pollution poses little or no risk to all citizens.</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">EPA AQI Range 51-100</span>
                <span className="font-bold text-amber-400">Moderate / Monitored</span>
                <p className="text-[11px] text-slate-500 mt-1">Acceptable quality; sensitive individuals may take slight precaution.</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">EPA AQI Range &gt; 150</span>
                <span className="font-bold text-rose-400">Unhealthy / Automated Mitigation</span>
                <p className="text-[11px] text-slate-500 mt-1">City Brain automatically activates water scrubbers & diverts freight.</p>
              </div>
            </div>
          </div>

          {/* 24-Hour Particulate PM2.5 & Urban Heat Island Graphical Chart */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>24-Hour Air Quality & Atmospheric Particulate Trajectory</span>
                  <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                    MATLAB: env_pm_model.m
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  PM2.5 particulate concentration trajectory across day/night cycles, showing aerosol mist cannon scrub zones and WHO safe air thresholds.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-0.5 bg-amber-400 inline-block" /> Ambient AQI
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-0.5 bg-rose-500 inline-block stroke-dash" /> Unhealthy Limit (100)
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-2 bg-cyan-500/20 border border-cyan-400 inline-block rounded-xs" /> Mist Scrubbing Active
                  </span>
                </div>
                {renderZoomToolbar(envZoom, setEnvZoom, 'Air Quality')}
              </div>
            </div>

            <div className="w-full bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-inner">
              {envZoom > 1 && (
                <div className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded-md border border-amber-800/60 mb-2.5 flex items-center justify-between">
                  <span>↔ Scroll horizontally to inspect atmospheric particulate AQI at {Math.round(envZoom * 100)}% resolution</span>
                  <button onClick={() => setEnvZoom(1)} className="hover:text-amber-200 underline">Reset 100%</button>
                </div>
              )}
              <div className="w-full overflow-x-auto pb-1">
                <div style={{ width: `${Math.round(100 * envZoom)}%`, minWidth: `${Math.round(750 * envZoom)}px`, transition: 'all 0.2s ease-out' }}>
                  <svg viewBox="0 0 820 220" className="w-full h-auto max-h-[300px] block select-none" preserveAspectRatio="none">
                  {/* Horizontal gridlines */}
                  {[0, 50, 100, 150].map((val) => {
                    const y = 180 - (val / 160) * 150;
                    return (
                      <g key={val}>
                        <line x1="55" y1={y} x2="790" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="48" y={y + 3.5} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                          {val}
                        </text>
                      </g>
                    );
                  })}

                {/* WHO Good threshold zone (0-50 AQI) */}
                <rect x="40" y="140" width="740" height="50" fill="#10b981" fillOpacity="0.05" />

                {/* EPA 100 Unhealthy Limit Line */}
                <line x1="40" y1="90" x2="780" y2="90" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="6 3" />
                <text x="784" y="94" fill="#f43f5e" fontSize="9" fontFamily="monospace">
                  Moderate Threshold: 100
                </text>

                {/* Mist scrubbing active zone in afternoon (13:00 to 18:00) */}
                <rect x={40 + (13 / 23) * 740} y="30" width={(5 / 23) * 740} height="160" fill="#06b6d4" fillOpacity="0.12" rx="4" />
                <text x={40 + (15.5 / 23) * 740} y="44" fill="#22d3ee" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  Aerosol Mist Scrubbing Active (16 Cannons)
                </text>

                {/* AQI Trajectory Line */}
                <polyline
                  points={hourlyProfiles.map((p, idx) => {
                    const x = 40 + (idx / 23) * 740;
                    const y = 190 - (p.aqi / 160) * 160;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                />

                {/* Current Hour Indicator Marker */}
                <g transform={`translate(${40 + (currentHour / 23) * 740}, 0)`}>
                  <line x1="0" y1="20" x2="0" y2="190" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <rect x="-24" y="2" width="48" height="16" rx="3" fill="#0369a1" />
                  <text x="0" y="14" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {String(currentHour).padStart(2, '0')}:00
                  </text>
                </g>

                {/* Numerical AQI Values when zoomed in */}
                {envZoom >= 1.25 && hourlyProfiles.map((p, idx) => {
                  const x = 40 + (idx / 23) * 740;
                  const y = 190 - (p.aqi / 160) * 160;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="3" fill="#f59e0b" />
                      <text x={x} y={y - 7} fill="#fcd34d" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {p.aqi}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
};
