import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  Zap, 
  Droplets, 
  Trash2, 
  Wind, 
  Layers, 
  Terminal, 
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Play,
  SlidersHorizontal,
  Bell,
  BarChart3,
  Flame,
  HelpCircle,
  Compass,
  ArrowRight
} from 'lucide-react';

export const SystemDocsGuide: React.FC = () => {
  const [docView, setDocView] = useState<'manual' | 'architecture'>('manual');

  const modelFiles = [
    { name: 'SmartCity_Top.slx', category: 'Simulink Top Model', desc: 'Top-level continuous co-simulation model connecting the 4 physical cyber-physical subsystems.' },
    { name: 'city_brain.m', category: 'Multi-Agent Optimizer', desc: 'Central coordinator solving the linear programming (LP) co-optimization dispatch problem.' },
    { name: 'energy_dispatch.m', category: 'Energy Subsystem', desc: 'Computes solar PV, wind turbine, BESS battery charging/discharging, and peak load shaving.' },
    { name: 'energy_battery.m', category: 'Energy Subsystem', desc: 'Dynamic state-of-charge (SOC), degradation cycle counting, and depth-of-discharge constraints.' },
    { name: 'water_core.m', category: 'Water Subsystem', desc: 'Reservoir mass balance, pressure-dependent flow, and booster pump VFD head curve calculations.' },
    { name: 'leak_fsm.m', category: 'Water Subsystem', desc: 'Acoustic hydrophone cross-correlation FSM: Monitoring -> Anomaly -> Localized -> Isolated.' },
    { name: 'waste_core.m', category: 'Smart Waste', desc: 'IoT ultrasonic bin fill accumulation rates and recycling/landfill mass balance.' },
    { name: 'truck_fsm.m & waste_route.m', category: 'Smart Waste', desc: 'Dynamic Travelling Salesperson Problem (TSP) genetic algorithm for automated fleet dispatch.' },
    { name: 'env_core.m & env_pm_model.m', category: 'Environment', desc: 'Gaussian plume dispersion model for particulate matter PM2.5 / PM10 across 5 districts.' },
    { name: 'scenario_shock.m', category: 'Stress Lab', desc: 'Applies sudden systemic shocks (heatwave, pipe burst, toxic smog, storm flood, blackout).' },
    { name: 'cost_benefit.m', category: 'Financial Analytics', desc: 'Quantifies municipal OpEx savings, carbon offset credits, and capital payback periods.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & View Switcher */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>City Nexus Operator's Manual & Architecture Guide</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {docView === 'manual' ? 'User Manual & Interactive Operator Guide' : 'Simulink Cyber-Physical Architecture'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {docView === 'manual' 
                ? 'Step-by-step instructions for operating City Nexus, running simulations, testing crises, and managing actuators.' 
                : 'Mathematical models, differential equations, and 5-layer cyber-physical stack documentation.'}
            </p>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setDocView('manual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                docView === 'manual' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Operator's Manual
            </button>
            <button
              onClick={() => setDocView('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                docView === 'architecture' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Technical Specs & Math
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW A: INTERACTIVE OPERATOR'S USER MANUAL */}
      {/* ========================================================= */}
      {docView === 'manual' && (
        <div className="space-y-6">
          {/* Section 1: Quickstart Workflow */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Quick Start: 5 Core Operator Workflows</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-300 text-xs">1. Exploring the Spatial Digital Twin</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Open the <strong className="text-white">Digital Twin Map</strong> tab. Use the layer buttons at the top to toggle individual utility overlays (Power Grid, Water DMAs, Waste Fleet, AQI Heatmap). Click any of the 5 city districts on the map to inspect its real-time telemetry drawer.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-blue-300 text-xs">2. Controlling Time & Co-Simulation Clock</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  The simulation ribbon below the top bar shows current simulation time (e.g., <code className="text-cyan-400">14:25</code>). Use the Play/Pause button, speed toggle (1x, 5x, 15x), or the Hour Slider to jump directly to any hour (00:00 - 23:00) to see how night/day affects solar and load.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-300 text-xs">3. Changing City Brain Optimization Policies</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Click the <strong className="text-white">City Brain Optimizer</strong> tab or the policy buttons in the ribbon to switch between 4 Operating Modes: <em>Balanced Nominal</em>, <em>Eco-Green Saver</em>, <em>Peak Shave</em>, and <em>Crisis Response</em>. Notice how objective weights dynamically alter battery dispatch and demand.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 text-xs">4. Testing Crisis Shocks in the Stress Lab</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Navigate to <strong className="text-white">Stress Lab Scenarios</strong> and click <strong className="text-rose-400">Inject Shock Scenario</strong> on any of the 6 scenarios (Heatwave, Pipe Burst, Smog, Flash Flood, EV Surge, or Cascade). Watch the city auto-escalate policies and contain the incident. Click "Neutralize" to reset.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: UI Controls Glossary */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>Control Panel & Button Glossary</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 shrink-0 mt-0.5">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">"Actuators" Button (Header)</span>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Opens the Manual Actuator Overrides modal. Allows an operator to manually override battery discharge (0-30 MW), throttle EV fast-charging stations, isolate Motorized Gate Valves V-14/15, or engage all 16 Aerosol Mist Cannons.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded bg-amber-950 border border-amber-800 text-amber-400 shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">"Alerts" Badge & Triage Inbox</span>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Displays active anomalies categorized as Critical, Warning, or Info. Shows the exact autonomous action dispatched by City Nexus and provides an "Acknowledge" button for operators.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Benchmark Analytics & Population ROI Calculator</span>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Compare verified baseline vs City Nexus results. Use the population slider (50k to 2.5M citizens) to scale 10-year municipal savings, payback period (1.8 years), and export verified simulation data to CSV.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW B: CYBER-PHYSICAL MODEL REFERENCE & MATH */}
      {/* ========================================================= */}
      {docView === 'architecture' && (
        <div className="space-y-6">
          {/* 5-Layer Cyber-Physical Architecture */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>5-Layer Cyber-Physical Architecture Stack</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-cyan-400 font-bold block text-xs">LAYER 1: Physical Infrastructure Assets</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Solar PV arrays (134 MW), wind turbines (36 MW), central BESS (32 MWh), distribution water conduits, smart waste bins, mist cannons.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0">
                  Field Hardware
                </span>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-blue-400 font-bold block text-xs">LAYER 2: IoT Telemetry & SCADA Bus</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Phasor measurement units (PMUs), acoustic hydrophone sensors, ultrasonic bin depth gauges, optical PM2.5/PM10 particle meters at 100Hz.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0">
                  Low-Latency Bus
                </span>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-indigo-400 font-bold block text-xs">LAYER 3: MATLAB / Simulink Digital Twin Engine</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Dynamic differential equations solving reservoir levels, thermal HVAC inertia, battery electrochemical degradation, and dispersion plumes.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0">
                  SmartCity_Top.slx
                </span>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-emerald-400 font-bold block text-xs">LAYER 4: City Brain Multi-Agent Optimization Engine</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Linear programming (LP) co-optimizer, finite state machines (mode_fsm, leak_fsm, truck_fsm), and real-time incident triage catalog.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0">
                  city_brain.m
                </span>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-amber-400 font-bold block text-xs">LAYER 5: Autonomous Dispatch & Actuation</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Motorized isolation gate valves, inverter active/reactive setpoints, dynamic vehicle route turns, high-pressure mist aerosol cannons.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0">
                  Closed Loop
                </span>
              </div>
            </div>
          </div>

          {/* Mathematical Formulations */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Core Mathematical Formulations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-300">1. Battery Storage Dynamics (energy_battery.m)</span>
                <div className="p-2.5 bg-slate-950 rounded font-mono text-[11px] text-cyan-300 border border-slate-800">
                  SOC(t+Δt) = SOC(t) - (P_bat(t) · η_c/d · Δt) / E_capacity
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Subject to bounds 20% ≤ SOC ≤ 90% to avoid accelerated lithium dendrite degradation and thermal runaway.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-blue-300">2. Pressure-Dependent Leak Discharge (water_core.m)</span>
                <div className="p-2.5 bg-slate-950 rounded font-mono text-[11px] text-blue-300 border border-slate-800">
                  Q_leak(t) = C_leak · [ P_node(t) ]^α  (with α ≈ 0.85)
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Demonstrates why reducing nighttime DMA pressure from 4.8 to 3.2 bar achieves a disproportionate 36.3% reduction in pipeline loss.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-300">3. Dynamic Vehicle Routing TSP (waste_route.m)</span>
                <div className="p-2.5 bg-slate-950 rounded font-mono text-[11px] text-emerald-300 border border-slate-800">
                  min Σ c_ij · x_ij  s.t. Σ q_i ≤ Q_truck, fill_i ≥ 0.75
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Constrained clustering only dispatches EV collection units when bin fill thresholds exceed 75%, pruning 423 km of daily redundant transit.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-300">4. Gaussian Dispersion Mitigation (env_pm_model.m)</span>
                <div className="p-2.5 bg-slate-950 rounded font-mono text-[11px] text-amber-300 border border-slate-800">
                  C(x,y,z) = [Q / (2π u σ_y σ_z)] · exp(-y²/2σ_y²) · (1 - η_mist)
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Aerosol mist scrubbers introduce knock-down coefficient η_mist = 0.64, binding particulate matter to water droplets during atmospheric inversion.
                </p>
              </div>
            </div>
          </div>

          {/* MATLAB / Simulink Function Catalog */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>MATLAB / Simulink Source Function Index</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">11 Core Modules</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {modelFiles.map((file, idx) => (
                <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-300 font-bold">{file.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-medium">
                      {file.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{file.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
