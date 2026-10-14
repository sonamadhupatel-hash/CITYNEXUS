import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw, 
  Bell, 
  ShieldAlert, 
  Cpu, 
  Activity,
  Layers,
  Sparkles,
  Zap,
  Droplets,
  Trash2,
  Wind,
  SlidersHorizontal,
  Eye
} from 'lucide-react';
import { useCitySimulation } from '../context/CitySimulationContext';
import { OperatingMode } from '../types/cityos';
import { CityNexusLogo } from './CityNexusLogo';

interface NavigationHeaderProps {
  onOpenAlerts: () => void;
  onOpenOverrides: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({ 
  onOpenAlerts, 
  onOpenOverrides 
}) => {
  const {
    currentHour,
    currentMinute,
    isPlaying,
    simSpeed,
    togglePlay,
    setSimSpeed,
    setCurrentHour,
    activeTab,
    setActiveTab,
    operatingMode,
    setOperatingMode,
    activeShock,
    clearShock,
    inspectScenario,
    alerts,
    energyMetrics,
    waterMetrics,
    environmentMetrics,
  } = useCitySimulation();

  const unacknowledgedAlerts = alerts.filter(a => !a.isAcknowledged).length;

  const modeLabels: Record<OperatingMode, { label: string; color: string; desc: string }> = {
    balanced: { label: 'Balanced Nominal', color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40', desc: 'Equal weighting of OpEx, Green, and Quality' },
    eco_saver: { label: 'Eco-Green Priority', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40', desc: 'Maximized renewables & carbon minimization' },
    resilience_peak: { label: 'Peak Shaving Mode', color: 'text-amber-400 border-amber-800 bg-amber-950/40', desc: 'Active BESS discharge & HVAC load shifting' },
    crisis_response: { label: 'Crisis Emergency Failover', color: 'text-rose-400 border-rose-800 bg-rose-950/40', desc: 'Microgrid islanding & safety critical routing' },
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Active Crisis Banner if Shock is Injected */}
      {activeShock && (
        <div className="bg-gradient-to-r from-rose-950 via-rose-900/90 to-amber-950 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-rose-700/60 shadow-inner">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-ping" />
            <span className="font-semibold tracking-wide uppercase text-rose-300">
              Active Stress Scenario {activeShock.scenarioNumber}:
            </span>
            <span className="font-medium text-slate-100">{activeShock.name}</span>
            <span className="hidden md:inline text-rose-200/80">({activeShock.headline})</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => inspectScenario(activeShock)}
              className="px-2.5 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
              title="Inspect Incident Response Diagnostics & Telemetry"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Response</span>
            </button>
            <button 
              onClick={clearShock}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            >
              Reset Normal
            </button>
          </div>
        </div>
      )}

      {/* Main Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav Links) - Zone 3 (Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Brand Wordmark & Logo (Clickable to Home) */}
        <button 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 shrink-0 text-left hover:opacity-90 transition-opacity focus:outline-none"
          title="Return to City Nexus Home"
        >
          <CityNexusLogo size="sm" showSubtitle={true} />
        </button>

        {/* Zone 2: Navigation Links (Single-line, unboxed) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button 
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'home' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('digital_twin')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'digital_twin' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
            }`}
          >
            Digital Twin Map
          </button>
          <button 
            onClick={() => setActiveTab('subsystems')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'subsystems' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
            }`}
          >
            Subsystems Hub
          </button>
          <button 
            onClick={() => setActiveTab('city_brain')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'city_brain' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
            }`}
          >
            City Brain Optimizer
          </button>
          <button 
            onClick={() => setActiveTab('stress_lab')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'stress_lab' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
            }`}
          >
            Stress Lab Scenarios
          </button>
          <button 
            onClick={() => setActiveTab('input_lab')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'input_lab' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
            }`}
          >
            Input Lab & Solver
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'analytics' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
            }`}
          >
            Benchmark Analytics & ROI
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'docs' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
            }`}
          >
            Model Guide
          </button>
        </nav>

        {/* Zone 3: Controls & Triage Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenOverrides}
            title="Manual Overrides & Actuators"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Actuators</span>
          </button>

          <button
            onClick={onOpenAlerts}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Alerts</span>
            {unacknowledgedAlerts > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold">
                {unacknowledgedAlerts}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Header Simulation Ribbon: Clock, Speed, Mode Selector, Instant Key Metrics */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 sm:px-6 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Time & Playback Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
              <button 
                onClick={togglePlay}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title={isPlaying ? 'Pause Simulation' : 'Run Simulation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
              <button 
                onClick={() => setSimSpeed(simSpeed === 1 ? 5 : simSpeed === 5 ? 15 : 1)}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold hover:bg-slate-800 text-cyan-400 transition-colors"
                title="Cycle Simulation Speed"
              >
                {simSpeed}x
              </button>
            </div>

            <div className="flex items-center gap-2 font-mono text-slate-200">
              <span className="text-cyan-400 font-bold tabular-nums">
                {String(currentHour).padStart(2, '0')}:{String(currentMinute).padStart(2, '0')}
              </span>
              <span className="text-slate-500 text-[10px]">CO-SIM RUNTIME</span>
            </div>

            {/* Quick hour slider */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Hour:</span>
              <input 
                type="range"
                min="0"
                max="23"
                value={currentHour}
                onChange={(e) => setCurrentHour(parseInt(e.target.value, 10))}
                className="w-20 accent-cyan-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Operating Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] hidden md:inline">City Brain Policy:</span>
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              {(['balanced', 'eco_saver', 'resilience_peak', 'crisis_response'] as OperatingMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setOperatingMode(mode)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    operatingMode === mode 
                      ? 'bg-slate-800 text-cyan-300 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'balanced' && 'Balanced'}
                  {mode === 'eco_saver' && 'Eco-Saver'}
                  {mode === 'resilience_peak' && 'Peak Shave'}
                  {mode === 'crisis_response' && 'Crisis'}
                </button>
              ))}
            </div>
          </div>

          {/* Instant Multi-Domain Telemetry Summary Strip */}
          <div className="hidden xl:flex items-center gap-4 text-slate-400 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Grid:</span>
              <span className="font-mono text-slate-200 font-bold tabular-nums">{energyMetrics.totalDemandMW} MW</span>
              <span className="text-slate-500">({energyMetrics.renewableSharePct}% Clean)</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3 h-3 text-blue-400" />
              <span>Water:</span>
              <span className="font-mono text-slate-200 font-bold tabular-nums">{waterMetrics.averagePressureBar} bar</span>
              <span className="text-emerald-400 font-mono">({waterMetrics.waterLossRatePct}% loss)</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3 h-3 text-emerald-400" />
              <span>AQI:</span>
              <span className={`font-mono font-bold tabular-nums ${
                environmentMetrics.cityAqiAvg > 100 ? 'text-rose-400' : environmentMetrics.cityAqiAvg > 50 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {environmentMetrics.cityAqiAvg}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
