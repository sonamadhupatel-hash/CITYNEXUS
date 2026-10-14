import React from 'react';
import { 
  Cpu, 
  Layers, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  Zap,
  Droplets,
  Wind,
  Terminal,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useCitySimulation } from '../context/CitySimulationContext';
import { OperatingMode } from '../types/cityos';

export const CityBrainConsole: React.FC = () => {
  const {
    operatingMode,
    setOperatingMode,
    activeShock,
    manualOverrides,
    setManualOverride,
    resetOverrides,
    energyMetrics,
    waterMetrics,
    environmentMetrics,
    currentHour,
    currentMinute
  } = useCitySimulation();

  const decisionLogs = [
    {
      time: `${String(currentHour).padStart(2, '0')}:${String(Math.max(0, currentMinute - 2)).padStart(2, '0')}`,
      type: 'OPTIMIZATION',
      domain: 'Energy Grid',
      action: 'LP solver converged in 1.4s. Scheduled 18 MW BESS discharge to offset afternoon HVAC ramp.',
      status: 'DISPATCHED'
    },
    {
      time: `${String(currentHour).padStart(2, '0')}:${String(Math.max(0, currentMinute - 6)).padStart(2, '0')}`,
      type: 'ROUTING',
      domain: 'Smart Waste',
      action: 'Cluster 12 bins surpassed 80% threshold. Re-dispatched EV Truck #4 via dynamic TSP waypoint.',
      status: 'ACKNOWLEDGED'
    },
    {
      time: `${String(currentHour).padStart(2, '0')}:${String(Math.max(0, currentMinute - 11)).padStart(2, '0')}`,
      type: 'PRESSURE',
      domain: 'Water DMA',
      action: 'Modulated Booster Pump BP-01 variable frequency drive to 54Hz; stabilized DMA-02 pressure at 3.6 bar.',
      status: 'COMPLETED'
    },
    {
      time: `${String(currentHour).padStart(2, '0')}:${String(Math.max(0, currentMinute - 18)).padStart(2, '0')}`,
      type: 'AIR_SCRUB',
      domain: 'Environment',
      action: 'Port Berth 6 sensor indicated PM2.5 rise. High-pressure mist cannons MC-04 and MC-05 engaged.',
      status: 'ACTIVE'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Central City Brain: Multi-Agent Co-Optimizer</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              MATLAB: city_brain.m + brain_lp_benchmark.m
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time linear programming (LP) co-simulation solver orchestrating energy peak shaving, DMA water pressure, and dynamic logistics.
          </p>
        </div>

        {/* Brain Health & Solver Latency */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500">SOLVER LATENCY: </span>
            <span className="text-cyan-400 font-bold">1.42s</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500">CONSTRAINTS: </span>
            <span className="text-emerald-400 font-bold">100% Satisfied</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Operating Mode FSM Matrix (Left) + Decision Stream & Actuators (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Operating Mode FSM & Objective Weights (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Operating Mode State Machine Cards */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Operating Mode FSM (mode_fsm.m)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated finite state machine governing system-wide trade-off priorities. Click any state to switch policy.
                </p>
              </div>

              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 bg-cyan-950/60 border border-cyan-800 rounded">
                Active: {operatingMode.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'balanced',
                  title: '1. Balanced Nominal',
                  weights: 'OpEx: 33% · Carbon: 33% · Uptime: 34%',
                  desc: 'Standard daytime operation with equal weight on municipal cost minimization and carbon reduction.',
                  color: 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                },
                {
                  id: 'eco_saver',
                  title: '2. Eco-Green Priority',
                  weights: 'OpEx: 20% · Carbon: 60% · Uptime: 20%',
                  desc: 'Aggressive carbon minimization, maximizing solar/wind self-consumption and curtailing non-urgent loads.',
                  color: 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                },
                {
                  id: 'resilience_peak',
                  title: '3. Resilience Peak Shaving',
                  weights: 'OpEx: 40% · Carbon: 20% · Uptime: 40%',
                  desc: 'Active during heatwaves or high grid tariffs. Discharges BESS and lowers HVAC chillers pre-emptively.',
                  color: 'border-amber-500 bg-amber-950/40 text-amber-200'
                },
                {
                  id: 'crisis_response',
                  title: '4. Crisis Emergency Failover',
                  weights: 'OpEx: 0% · Carbon: 0% · Uptime: 100%',
                  desc: 'Triggered during catastrophic pipe bursts or grid blackouts. Prioritizes life safety, hospitals and microgrids.',
                  color: 'border-rose-500 bg-rose-950/40 text-rose-200'
                }
              ].map((m) => {
                const isSelected = operatingMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setOperatingMode(m.id as OperatingMode)}
                    className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                      isSelected
                        ? `${m.color} ring-1 ring-white/20 shadow-lg`
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{m.title}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
                    <div className="text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-1.5">
                      Weights: <span className="text-slate-300">{m.weights}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LP Solver Mathematical Benchmark formulation */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl text-xs">
            <h3 className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Objective Function & Constraints</span>
              <span className="font-mono text-[10px] text-slate-500">LP BENCHMARK</span>
            </h3>

            <div className="bg-slate-900 p-3 rounded-lg font-mono text-cyan-300 text-[11px] overflow-x-auto border border-slate-800">
              min J = w₁ · Cost(Grid, Fuel) + w₂ · Carbon(kg CO₂) + w₃ · PressureDev(DMA) + w₄ · Pen(UnmetDemand)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1">
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Variables:</span>
                <span className="font-mono text-slate-200 font-bold">1,420 states</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Inequalities:</span>
                <span className="font-mono text-slate-200 font-bold">2,840 bounds</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">BESS SOC Bound:</span>
                <span className="font-mono text-emerald-400 font-bold">20% ≤ SOC ≤ 90%</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Pressure Range:</span>
                <span className="font-mono text-blue-400 font-bold">2.5 ≤ P ≤ 4.5 bar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actuator Overrides & Real-time Action Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Manual Actuator Override Matrix */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
            <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white">Manual Actuator Controls</h3>
              </div>
              <button 
                onClick={resetOverrides}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset All
              </button>
            </div>

            {/* Battery force discharge */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Force Battery Discharge:</span>
                <span className="font-mono text-cyan-400 font-bold">{manualOverrides.batteryForceDischargeMW} MW</span>
              </div>
              <input 
                type="range"
                min="0"
                max="30"
                step="5"
                value={manualOverrides.batteryForceDischargeMW}
                onChange={(e) => setManualOverride('batteryForceDischargeMW', parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Manual dispatch overrules autonomous optimizer.</span>
            </div>

            {/* EV Charging throttle */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-slate-300">
                <span>EV Charging Fleet Throttling:</span>
                <span className="font-mono text-amber-400 font-bold">{manualOverrides.evChargingThrottlePct}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="50"
                step="5"
                value={manualOverrides.evChargingThrottlePct}
                onChange={(e) => setManualOverride('evChargingThrottlePct', parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
              />
            </div>

            {/* Water Valve Isolation */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-slate-300 block font-medium">Trunk Valve V-14 Isolation</span>
                <span className="text-[10px] text-slate-500">Emergency leak barrier isolation</span>
              </div>
              <button
                onClick={() => setManualOverride('valveIsolationOverride', !manualOverrides.valveIsolationOverride)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-colors ${
                  manualOverrides.valveIsolationOverride
                    ? 'bg-rose-950 border-rose-600 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {manualOverrides.valveIsolationOverride ? 'ISOLATED' : 'OPEN'}
              </button>
            </div>

            {/* Mist Cannons Toggle */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-slate-300 block font-medium">Aerosol Mist Cannons</span>
                <span className="text-[10px] text-slate-500">16 high-pressure scrubbers</span>
              </div>
              <button
                onClick={() => setManualOverride('forceMistCannons', !manualOverrides.forceMistCannons)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-colors ${
                  manualOverrides.forceMistCannons
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {manualOverrides.forceMistCannons ? '16 ACTIVE' : 'AUTO (NOM)'}
              </button>
            </div>
          </div>

          {/* Autonomous Action Dispatch Audit Trail */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl text-xs">
            <h3 className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Autonomous Action Audit Stream</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">SCADA DISPATCH</span>
            </h3>

            <div className="space-y-2.5">
              {decisionLogs.map((log, index) => (
                <div key={index} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/90 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-cyan-400 font-semibold">{log.time} · {log.domain}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-mono font-bold text-slate-300">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{log.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
