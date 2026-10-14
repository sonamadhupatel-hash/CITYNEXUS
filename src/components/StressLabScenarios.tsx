import React from 'react';
import { 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Droplets, 
  Wind, 
  Cpu, 
  Flame, 
  Sparkles, 
  ArrowRight,
  Eye,
  Activity,
  Layers,
  MapPin,
  Check
} from 'lucide-react';
import { useCitySimulation } from '../context/CitySimulationContext';
import { SHOCK_SCENARIOS } from '../data/cityData';
import { ShockScenario } from '../types/cityos';

export const StressLabScenarios: React.FC = () => {
  const { 
    activeShock, 
    triggerShock, 
    clearShock, 
    inspectScenario 
  } = useCitySimulation();

  return (
    <div className="space-y-6">
      {/* Active Incident Live Telemetry Command Strip (Visible when shock is active) */}
      {activeShock && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 p-5 rounded-2xl border-2 border-rose-600 shadow-2xl space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-800/60 pb-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              </span>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-rose-300 uppercase tracking-wider">
                    ACTIVE INCIDENT RESPONSE IN PROGRESS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-700 font-bold">
                    Scenario 0{activeShock.scenarioNumber}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {activeShock.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={() => inspectScenario(activeShock)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-600/30 border border-cyan-400/40"
              >
                <Eye className="w-4 h-4" />
                <span>Inspect Response Diagnostics</span>
              </button>

              <button
                onClick={clearShock}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>De-escalate Crisis</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Physical Anomaly:</span>
              <span className="text-rose-300 font-semibold text-xs leading-snug block mt-0.5">{activeShock.headline}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Autonomous City Brain Mitigation:</span>
              <span className="text-emerald-300 font-semibold text-xs leading-snug block mt-0.5 line-clamp-2">{activeShock.cityOsMitigation}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Mitigation Status:</span>
                <span className="text-cyan-300 font-mono font-bold text-sm">100% AUTONOMOUS</span>
              </div>
              <button
                onClick={() => inspectScenario(activeShock)}
                className="text-cyan-400 hover:text-cyan-300 font-mono text-xs flex items-center gap-1 transition-colors underline underline-offset-2"
              >
                Open Inspector <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Digital Twin Stress Lab & Disaster Response Lab</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              MATLAB: scenario_shock.m + apply_shock.m
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test the systemic cyber-physical resilience of City Nexus against extreme multi-domain shocks, equipment ruptures, and severe weather.
          </p>
        </div>

        {activeShock && (
          <button
            onClick={clearShock}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>De-escalate & Return to Nominal</span>
          </button>
        )}
      </div>

      {/* Shock Scenarios Grid (The 6 Scenarios from CityOS 2030) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SHOCK_SCENARIOS.map((scenario: ShockScenario) => {
          const isActive = activeShock?.id === scenario.id;

          const subsystemIcon = {
            energy: <Zap className="w-4 h-4 text-cyan-400" />,
            water: <Droplets className="w-4 h-4 text-blue-400" />,
            waste: <Zap className="w-4 h-4 text-emerald-400" />,
            environment: <Wind className="w-4 h-4 text-amber-400" />,
            brain: <Cpu className="w-4 h-4 text-indigo-400" />
          }[scenario.subsystem];

          return (
            <div
              key={scenario.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all space-y-4 shadow-xl ${
                isActive
                  ? 'bg-gradient-to-b from-rose-950/70 to-slate-950 border-rose-500 ring-2 ring-rose-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Scenario Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 flex items-center gap-1.5 font-bold">
                    {subsystemIcon} Scenario 0{scenario.scenarioNumber}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    scenario.severityLevel === 'Catastrophic'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : scenario.severityLevel === 'Severe'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}>
                    {scenario.severityLevel}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {scenario.name}
                </h3>

                <p className="text-xs text-rose-300/90 font-medium leading-relaxed">
                  {scenario.headline}
                </p>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {scenario.description}
                </p>

                {/* KPI Impact Table (Baseline vs CityOS) */}
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800/80 space-y-2 text-xs">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">
                    Comparative Stress Benchmark:
                  </span>
                  {scenario.kpiImpact.slice(0, 3).map((kpi, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] border-b border-slate-800/50 pb-1 last:border-none last:pb-0">
                      <span className="text-slate-400">{kpi.label}:</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-rose-400 line-through text-[10px]">{kpi.baseline}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                        <span className="text-emerald-300 font-bold">{kpi.cityOs}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">({kpi.improvement})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {isActive ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => inspectScenario(scenario)}
                      className="py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Telemetry</span>
                    </button>

                    <button
                      onClick={clearShock}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Neutralize</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-12 gap-2">
                    <button
                      onClick={() => triggerShock(scenario.id)}
                      className="col-span-8 py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Inject Shock</span>
                    </button>

                    <button
                      onClick={() => inspectScenario(scenario)}
                      className="col-span-4 py-2.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-slate-700"
                      title="Inspect Scenario Response Plan"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Inspect</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
