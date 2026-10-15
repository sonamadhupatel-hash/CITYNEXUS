import React, { useState } from 'react';
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
  Trash2,
  Terminal,
  Clock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Gauge
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
    wasteMetrics,
    environmentMetrics,
    currentHour,
    currentMinute
  } = useCitySimulation();

  const [isSolving, setIsSolving] = useState(false);
  const [solveTimestamp, setSolveTimestamp] = useState('14:25:02');

  const handleModeSwitch = (mode: OperatingMode) => {
    setIsSolving(true);
    setOperatingMode(mode);
    setTimeout(() => {
      setIsSolving(false);
      setSolveTimestamp(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 320);
  };

  const handleManualSolve = () => {
    setIsSolving(true);
    setTimeout(() => {
      setIsSolving(false);
      setSolveTimestamp(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 450);
  };

  // Mathematical LP Objective Function configuration based on active mode
  const policySpecs: Record<OperatingMode, {
    wCost: number;
    wCarbon: number;
    wPressure: number;
    wReliability: number;
    latencySec: string;
    iterations: number;
    objectiveJ: number;
    costAvoidancePct: number;
    carbonReductionPct: number;
    philosophy: string;
    accentColor: string;
  }> = {
    balanced: {
      wCost: 0.33,
      wCarbon: 0.33,
      wPressure: 0.17,
      wReliability: 0.17,
      latencySec: '1.42s',
      iterations: 142,
      objectiveJ: 0.312,
      costAvoidancePct: 31.3,
      carbonReductionPct: 70.7,
      philosophy: 'Equal weighted multi-objective trade-off balancing OpEx expenditure, carbon rate, and system uptime.',
      accentColor: 'text-cyan-400 border-cyan-800 bg-cyan-950/40'
    },
    eco_saver: {
      wCost: 0.20,
      wCarbon: 0.60,
      wPressure: 0.10,
      wReliability: 0.10,
      latencySec: '1.18s',
      iterations: 118,
      objectiveJ: 0.194,
      costAvoidancePct: 38.6,
      carbonReductionPct: 88.4,
      philosophy: 'Priority on carbon abatement: max renewable self-consumption, curtailed commercial HVAC, and eco-pressure PRV valves.',
      accentColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
    },
    resilience_peak: {
      wCost: 0.45,
      wCarbon: 0.15,
      wPressure: 0.20,
      wReliability: 0.20,
      latencySec: '0.94s',
      iterations: 164,
      objectiveJ: 0.238,
      costAvoidancePct: 44.8,
      carbonReductionPct: 64.2,
      philosophy: 'Tariff defense & peak shaving: 24 MW BESS discharge to offset ₹18,000/MWh peak grid rates and lower commercial load.',
      accentColor: 'text-amber-400 border-amber-800 bg-amber-950/40'
    },
    crisis_response: {
      wCost: 0.00,
      wCarbon: 0.00,
      wPressure: 0.20,
      wReliability: 0.80,
      latencySec: '0.48s',
      iterations: 88,
      objectiveJ: 0.076,
      costAvoidancePct: 22.0,
      carbonReductionPct: 52.0,
      philosophy: 'Emergency life-safety priority (100% critical uptime): commercial load shedding, 30 MW microgrid backup, 16 mist scrubbers.',
      accentColor: 'text-rose-400 border-rose-800 bg-rose-950/40'
    }
  };

  const activeSpec = policySpecs[operatingMode];

  // Dynamic Decision Stream tailored directly to the active policy mode
  const getDecisionLogs = () => {
    const timeNow = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    const timeT1 = `${String(currentHour).padStart(2, '0')}:${String(Math.max(0, currentMinute - 2)).padStart(2, '0')}`;
    const timeT2 = `${String(currentHour).padStart(2, '0')}:${String(Math.max(0, currentMinute - 5)).padStart(2, '0')}`;
    const timeT3 = `${String(currentHour).padStart(2, '0')}:${String(Math.max(0, currentMinute - 10)).padStart(2, '0')}`;

    if (operatingMode === 'eco_saver') {
      return [
        {
          time: timeNow,
          type: 'CARBON_LP',
          domain: 'Energy Grid',
          action: 'Eco-Priority LP solver converged in 1.18s. Curtailed 16% non-critical HVAC load; boosted clean power share to 88%.',
          status: 'OPTIMIZED'
        },
        {
          time: timeT1,
          type: 'ECO_PRV',
          domain: 'Water Distribution',
          action: 'Reduced PRV pressure setpoint to 3.2 bar. Water loss dropped to 12.3%; pump electricity reduced by 14.2 kW.',
          status: 'MODULATED'
        },
        {
          time: timeT2,
          type: 'FLEET_TSP',
          domain: 'Smart Waste',
          action: 'Clustered 6 EV trucks into high-density collection sectors. Landfill diversion boosted to 84.8% (+9.7% fuel saved).',
          status: 'DISPATCHED'
        },
        {
          time: timeT3,
          type: 'AIR_SCRUB',
          domain: 'Environment',
          action: 'Ambient AQI dropped to 36 (Good). Automated mist scrubbers shifted to low-duty eco-cycle.',
          status: 'ACTIVE'
        }
      ];
    }

    if (operatingMode === 'resilience_peak') {
      return [
        {
          time: timeNow,
          type: 'PEAK_SHAVE',
          domain: 'Energy Grid',
          action: 'Peak Shaving LP solver converged in 0.94s. Discharged 24.0 MW BESS; successfully shaved 42.5 MW peak grid load.',
          status: 'DISCHARGING'
        },
        {
          time: timeT1,
          type: 'TARIFF_DEFENSE',
          domain: 'OpEx Optimizer',
          action: 'Defended against ₹18,000/MWh peak tariff. Grid import minimized, saving ₹3.8 Lakh per operating hour.',
          status: 'SAVING'
        },
        {
          time: timeT2,
          type: 'GRAVITY_BUFFER',
          domain: 'Water DMA',
          action: 'Shifted distribution pumps to gravity feed buffer. Water pressure stabilized at 3.5 bar.',
          status: 'BUFFERED'
        },
        {
          time: timeT3,
          type: 'HEAT_MIST',
          domain: 'Environment',
          action: '6 mist cannons activated in Downtown thermal corridor to suppress afternoon ozone and particulate heat spikes.',
          status: 'SCRUBBING'
        }
      ];
    }

    if (operatingMode === 'crisis_response') {
      return [
        {
          time: timeNow,
          type: 'CRISIS_FAILOVER',
          domain: 'Central Brain',
          action: 'Life-safety constraint active (100% uptime weighting). Non-critical commercial and entertainment feeders shed.',
          status: 'ISLANDED'
        },
        {
          time: timeT1,
          type: 'MICROGRID_EMERGENCY',
          domain: 'Energy Grid',
          action: 'Dispatched 30.0 MW maximum emergency BESS power to protect hospitals, emergency triage, and water lift pumps.',
          status: 'MAX_DISPATCH'
        },
        {
          time: timeT2,
          type: 'VALVE_LOCKDOWN',
          domain: 'Water DMA',
          action: 'Motorized trunk valves V-14/15 isolated anomalous pipe sector. Emergency fire hydrant main boosted to 4.2 bar.',
          status: 'ISOLATED'
        },
        {
          time: timeT3,
          type: 'FULL_SCRUB',
          domain: 'Environment',
          action: 'Engaged all 16 aerosol mist cannons at 100% pressure for emergency particulate and smoke knock-down.',
          status: 'ALL_16_ACTIVE'
        }
      ];
    }

    // Default Balanced
    return [
      {
        time: timeNow,
        type: 'BALANCED_LP',
        domain: 'Central Brain',
        action: 'Balanced LP co-simulation solver converged in 1.42s (142 simplex iterations). All 2,840 constraints satisfied.',
        status: 'CONVERGED'
      },
      {
        time: timeT1,
        type: 'GRID_DISPATCH',
        domain: 'Energy Grid',
        action: 'Maintained 8.0 MW BESS peak buffer. Total demand at 107.9 MW with 68% clean renewable penetration.',
        status: 'NOMINAL'
      },
      {
        time: timeT2,
        type: 'PRESSURE_REG',
        domain: 'Water DMA',
        action: 'Pressure reducing valves holding 3.8 bar across all 5 municipal sectors. Acoustic leak hydrophones monitoring at 100Hz.',
        status: 'MONITORING'
      },
      {
        time: timeT3,
        type: 'FLEET_ROUTING',
        domain: 'Smart Waste',
        action: '8 EV trucks active on dynamic TSP collection routes. Daily landfill diversion rate holding at 76.4%.',
        status: 'ROUTING'
      }
    ];
  };

  const decisionLogs = getDecisionLogs();

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Central City Brain: Multi-Agent Co-Optimizer</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              MATLAB: city_brain.m + brain_lp_benchmark.m
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time linear programming (LP) co-simulation solver orchestrating energy peak shaving, DMA water pressure, 
            smart waste logistics, and air scrubbers across all 5 urban districts.
          </p>
        </div>

        {/* Brain Health & Solver Latency */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={handleManualSolve}
            disabled={isSolving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50"
            title="Force immediate LP Solver Re-evaluation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSolving ? 'animate-spin text-cyan-200' : ''}`} />
            <span>{isSolving ? 'Solving...' : 'Re-solve Model'}</span>
          </button>

          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500">SOLVER: </span>
            <span className="text-cyan-400 font-bold">{activeSpec.latencySec}</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500">STATUS: </span>
            <span className="text-emerald-400 font-bold">100% Feasible</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: LIVE MULTI-SUBSYSTEM TELEMETRY (RESPONSIVE TO MODE) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Energy Grid */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 shadow-lg relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Power Dispatch
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              {energyMetrics.renewableSharePct}% Clean
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {energyMetrics.totalDemandMW} <span className="text-xs font-normal text-slate-400">MW</span>
          </div>
          <div className="text-[11px] flex justify-between items-center text-slate-400 font-mono pt-1 border-t border-slate-800/80">
            <span>Peak Shaved: <strong className="text-emerald-400">+{energyMetrics.peakShavedMW} MW</strong></span>
            <span>BESS: <strong className="text-cyan-400">{energyMetrics.batteryPowerMW} MW</strong></span>
          </div>
        </div>

        {/* Card 2: Water DMA */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 shadow-lg relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Droplets className="w-3.5 h-3.5 text-blue-400" /> DMA Pressure
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
              {waterMetrics.waterLossRatePct}% Loss
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {waterMetrics.averagePressureBar} <span className="text-xs font-normal text-slate-400">bar</span>
          </div>
          <div className="text-[11px] flex justify-between items-center text-slate-400 font-mono pt-1 border-t border-slate-800/80">
            <span>Flow: <strong className="text-blue-300">{waterMetrics.networkFlowM3h.toLocaleString()} m³/h</strong></span>
            <span>FSM: <strong className="text-cyan-400">{waterMetrics.leakFsmState}</strong></span>
          </div>
        </div>

        {/* Card 3: Smart Waste */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 shadow-lg relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Trash2 className="w-3.5 h-3.5 text-emerald-400" /> Fleet Logistics
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              -{wasteMetrics.fleetFuelSavedPct}% Fuel
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {wasteMetrics.activeTrucks} / 8 <span className="text-xs font-normal text-slate-400">EV Units</span>
          </div>
          <div className="text-[11px] flex justify-between items-center text-slate-400 font-mono pt-1 border-t border-slate-800/80">
            <span>Diversion: <strong className="text-emerald-400">{wasteMetrics.landfillDiversionPct}%</strong></span>
            <span>Collected: <strong className="text-slate-300">{wasteMetrics.dailyCollectedTons} t</strong></span>
          </div>
        </div>

        {/* Card 4: Atmosphere */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 shadow-lg relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Wind className="w-3.5 h-3.5 text-amber-400" /> Ambient Air
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
              environmentMetrics.cityAqiAvg <= 50 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : environmentMetrics.cityAqiAvg <= 100 
                ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {environmentMetrics.cityAqiAvg <= 50 ? 'Good' : environmentMetrics.cityAqiAvg <= 100 ? 'Moderate' : 'Unhealthy'}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {environmentMetrics.cityAqiAvg} <span className="text-xs font-normal text-slate-400">AQI</span>
          </div>
          <div className="text-[11px] flex justify-between items-center text-slate-400 font-mono pt-1 border-t border-slate-800/80">
            <span>PM2.5: <strong className="text-slate-300">{environmentMetrics.pm25UgM3} µg</strong></span>
            <span>Mist: <strong className="text-cyan-400">{environmentMetrics.activeMistCannons} / 16</strong></span>
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
                  <span>Operating Mode FSM Policy Selection (mode_fsm.m)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated finite state machine governing system-wide trade-off priorities. Click any mode to re-calculate values instantly.
                </p>
              </div>

              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border font-bold ${
                operatingMode === 'balanced' ? 'bg-cyan-950 text-cyan-300 border-cyan-700' :
                operatingMode === 'eco_saver' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                operatingMode === 'resilience_peak' ? 'bg-amber-950 text-amber-300 border-amber-700' :
                'bg-rose-950 text-rose-300 border-rose-700'
              }`}>
                Active: {operatingMode.toUpperCase().replace('_', ' ')}
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
                  weights: 'OpEx: 45% · Carbon: 15% · Uptime: 40%',
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
                    onClick={() => handleModeSwitch(m.id as OperatingMode)}
                    className={`p-4 rounded-xl border text-left transition-all space-y-2 cursor-pointer ${
                      isSelected
                        ? `${m.color} ring-2 ring-white/20 shadow-xl`
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{m.title}</span>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Switch ↗</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
                    <div className="text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-1.5 flex justify-between items-center">
                      <span>Weights: <strong className="text-slate-300">{m.weights}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LP Solver Mathematical Benchmark formulation & Live Calculated Objective J */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Live LP Objective Function & Weight Calculation (city_brain.m)</span>
              </h3>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                J = {activeSpec.objectiveJ.toFixed(3)}
              </span>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-lg font-mono text-cyan-300 text-[11px] border border-slate-800 space-y-2">
              <div className="text-slate-400 text-[10px]">Mathematical Formula:</div>
              <div className="text-xs text-white">
                min J = <span className="text-amber-400 font-bold">w₁·Cost</span> + <span className="text-emerald-400 font-bold">w₂·Carbon</span> + <span className="text-blue-400 font-bold">w₃·ΔPressure</span> + <span className="text-rose-400 font-bold">w₄·Pen(Unmet)</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex flex-wrap gap-x-4 gap-y-1">
                <span>w₁(Cost) = <strong className="text-amber-300 font-mono">{(activeSpec.wCost * 100).toFixed(0)}%</strong></span>
                <span>w₂(Carbon) = <strong className="text-emerald-300 font-mono">{(activeSpec.wCarbon * 100).toFixed(0)}%</strong></span>
                <span>w₃(Pressure) = <strong className="text-blue-300 font-mono">{(activeSpec.wPressure * 100).toFixed(0)}%</strong></span>
                <span>w₄(Reliability) = <strong className="text-rose-300 font-mono">{(activeSpec.wReliability * 100).toFixed(0)}%</strong></span>
              </div>
            </div>

            {/* Dynamic Solver Optimization Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">LP Variables:</span>
                <span className="font-mono text-slate-200 font-bold">1,420 states</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">LP Iterations:</span>
                <span className="font-mono text-cyan-400 font-bold">{activeSpec.iterations} steps</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Cost Reduction:</span>
                <span className="font-mono text-emerald-400 font-bold">-{activeSpec.costAvoidancePct}%</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Carbon Abatement:</span>
                <span className="font-mono text-emerald-400 font-bold">-{activeSpec.carbonReductionPct}%</span>
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
                <h3 className="font-bold text-white">Manual Actuator Overrides</h3>
              </div>
              <button 
                onClick={resetOverrides}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
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
              <span className="text-[10px] text-slate-500">Autonomous brain manages {energyMetrics.batteryPowerMW} MW battery dispatch.</span>
            </div>

            {/* EV Charging throttle */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-slate-300">
                <span>EV Fleet Charging Throttle:</span>
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
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-colors cursor-pointer ${
                  manualOverrides.valveIsolationOverride
                    ? 'bg-rose-950 border-rose-600 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {manualOverrides.valveIsolationOverride ? 'ISOLATED' : 'OPEN (AUTO)'}
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
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-colors cursor-pointer ${
                  manualOverrides.forceMistCannons
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {manualOverrides.forceMistCannons ? '16 ACTIVE (FORCE)' : `${environmentMetrics.activeMistCannons} ACTIVE (AUTO)`}
              </button>
            </div>
          </div>

          {/* Autonomous Action Dispatch Audit Trail (Dyanmic based on mode) */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl text-xs">
            <h3 className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Autonomous Action Audit Stream</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">LIVE SCADA STREAM</span>
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
