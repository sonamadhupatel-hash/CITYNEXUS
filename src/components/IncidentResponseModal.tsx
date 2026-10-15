import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Droplets, 
  Wind, 
  Cpu, 
  RotateCcw, 
  SlidersHorizontal, 
  ArrowRight, 
  Activity, 
  Download, 
  Check, 
  AlertTriangle,
  Clock,
  Layers,
  MapPin,
  Flame,
  FileText,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useCitySimulation } from '../context/CitySimulationContext';
import { ShockScenario } from '../types/cityos';
import { SHOCK_SCENARIOS, DISTRICTS_DATA } from '../data/cityData';

interface IncidentResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOverrides: () => void;
}

export const IncidentResponseModal: React.FC<IncidentResponseModalProps> = ({
  isOpen,
  onClose,
  onOpenOverrides
}) => {
  const { 
    activeShock, 
    inspectedScenario, 
    clearShock, 
    triggerShock,
    setActiveTab, 
    setSelectedDistrict,
    currentHour,
    currentMinute
  } = useCitySimulation();

  const [incidentZoom, setIncidentZoom] = useState<number>(1);

  const renderZoomToolbar = () => (
    <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 text-xs shrink-0 shadow-sm">
      <span className="text-[10px] text-slate-500 font-mono uppercase mr-0.5">Zoom:</span>
      <button
        onClick={() => setIncidentZoom(prev => Math.max(1, parseFloat((prev - 0.25).toFixed(2))))}
        disabled={incidentZoom <= 1}
        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Zoom Out Transient Curve (-)"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>
      <span className="font-mono text-cyan-300 font-bold px-1 min-w-[38px] text-center text-[11px]">
        {Math.round(incidentZoom * 100)}%
      </span>
      <button
        onClick={() => setIncidentZoom(prev => Math.min(2.5, parseFloat((prev + 0.25).toFixed(2))))}
        disabled={incidentZoom >= 2.5}
        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Zoom In Transient Curve (+)"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
      {incidentZoom > 1 && (
        <button
          onClick={() => setIncidentZoom(1)}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Reset Zoom to 100%"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );

  // If there's an active shock, inspect that; otherwise inspectedScenario or fallback to scenario 2
  const selectedScenario: ShockScenario = inspectedScenario || activeShock || SHOCK_SCENARIOS[1];
  const isCurrentlyActive = activeShock?.id === selectedScenario.id;

  const [activeTab, setModalTab] = useState<'telemetry' | 'scada_playbook' | 'financial_impact'>('telemetry');

  if (!isOpen) return null;

  // Subsystem icons & metadata
  const subsystemBadge = {
    energy: { icon: <Zap className="w-4 h-4 text-cyan-400" />, label: 'Energy Grid & Substation', color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40' },
    water: { icon: <Droplets className="w-4 h-4 text-blue-400" />, label: 'Hydraulic Water Network', color: 'border-blue-500/40 text-blue-300 bg-blue-950/40' },
    waste: { icon: <Zap className="w-4 h-4 text-emerald-400" />, label: 'Circular Waste Fleet', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40' },
    environment: { icon: <Wind className="w-4 h-4 text-amber-400" />, label: 'Atmospheric Microclimate', color: 'border-amber-500/40 text-amber-300 bg-amber-950/40' },
    brain: { icon: <Cpu className="w-4 h-4 text-indigo-400" />, label: 'Multi-Agent Central Brain', color: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/40' },
  }[selectedScenario.subsystem];

  // SCADA Mitigation Timeline Steps customized per scenario
  const getPlaybookSteps = (scenario: ShockScenario) => {
    switch (scenario.id) {
      case 'scenario_2_pipe_burst':
        return [
          { time: 'T+ 00:04s', step: '1. Hydrophone Acoustic Anomaly Detected', desc: '100Hz high-frequency hiss detected on hydrophone array HA-42 with cross-correlation peak at 0.94.', status: 'COMPLETE' },
          { time: 'T+ 01:18s', step: '2. TDOA Spatial Localization Pinpointed', desc: 'Time Difference of Arrival algorithm localized rupture within ±2.8m of Main Trunk 4B, DMA-3.', status: 'COMPLETE' },
          { time: 'T+ 03:45s', step: '3. Autonomous Gate Valve Isolation', desc: 'SCADA command dispatched to motorized gate valves V-14 and V-15. 100% flow isolation achieved in 120s.', status: 'COMPLETE' },
          { time: 'T+ 05:12s', step: '4. Dynamic Hydraulic Re-Routing', desc: 'Automated pressure reducing valve PRV-04 opened Bypass Line 2A to maintain drinking water to 42k citizens.', status: 'COMPLETE' },
          { time: 'T+ 08:00s', step: '5. DMA-3 Drinking Pressure Stabilized', desc: 'Residential pressure recovered from 1.1 bar failure floor back to 3.2 bar nominal with 0 contamination.', status: 'COMPLETE' },
          { time: 'T+ 14:00s', step: '6. Field Repair Crew GPS Dispatched', desc: 'Work order and exact subterranean excavation coordinates transmitted to mobile maintenance unit #2.', status: 'EN ROUTE' }
        ];
      case 'scenario_1_heatwave':
        return [
          { time: 'T+ 00:00s', step: '1. Thermal Ambient Surge Detected', desc: 'Met station reported 42.4°C ambient peak, triggering HVAC commercial pre-cooling alert.', status: 'COMPLETE' },
          { time: 'T+ 00:45s', step: '2. Central BESS Dispatch Commanded', desc: 'City Brain commanded 28 MW discharge from 110kV grid battery, suppressing peak import tariff.', status: 'COMPLETE' },
          { time: 'T+ 02:15s', step: '3. Smart Thermostat Pre-Cooling', desc: 'Commercial HVAC chillers lowered by 1.2°C across Downtown & Tech Valley, shifting 14 MW load.', status: 'COMPLETE' },
          { time: 'T+ 06:00s', step: '4. Substation Thermal Relief', desc: 'Substation S-2 temperature stabilized at 68.1°C (safe) avoiding emergency brownout.', status: 'COMPLETE' }
        ];
      case 'scenario_3_smog_inversion':
        return [
          { time: 'T+ 00:00s', step: '1. Inversion Boundary Layer Detected', desc: 'Lidar sensors detected thermal inversion lid at 180m height trapping maritime diesel particulates.', status: 'COMPLETE' },
          { time: 'T+ 00:30s', step: '2. 16 High-Pressure Mist Scrubbers Engaged', desc: 'Dispatched automated water atomizers spraying 10-micron mist fog to bind airborne PM2.5.', status: 'COMPLETE' },
          { time: 'T+ 02:00s', step: '3. Harbor Freight Corridor Rerouted', desc: 'Heavy diesel container trucks diverted from residential borders to automated bypass arterial.', status: 'COMPLETE' },
          { time: 'T+ 08:30s', step: '4. PM2.5 Particulate Knock-Down Confirmed', desc: 'Ground PM2.5 concentration plummeted from 194 µg/m³ to 58 µg/m³ in 25 minutes.', status: 'COMPLETE' }
        ];
      default:
        return [
          { time: 'T+ 00:02s', step: '1. Anomaly Ingestion & Classification', desc: 'Telemetry mapped to cyber-physical digital twin equations. Systemic failure cascade threat confirmed.', status: 'COMPLETE' },
          { time: 'T+ 01:24s', step: '2. City Brain LP Multi-Agent Re-Dispatch', desc: 'Co-optimization solver reallocated energy and water flow vectors in 1.4 seconds across 2,840 constraints.', status: 'COMPLETE' },
          { time: 'T+ 04:00s', step: '3. Actuator Control Verification', desc: 'All physical switches, battery inverters, and pumps transitioned to resilience mode with 0 violations.', status: 'COMPLETE' },
          { time: 'T+ 07:30s', step: '4. Systemic Equilibrium Restored', desc: 'Metropolitan vital indicators stabilized within nominal safe operational envelopes.', status: 'COMPLETE' }
        ];
    }
  };

  const playbookSteps = getPlaybookSteps(selectedScenario);

  // Jump to affected district on map
  const handleJumpToMap = () => {
    const districtId = selectedScenario.subsystem === 'water' 
      ? 'd3_residential' 
      : selectedScenario.subsystem === 'energy' 
      ? 'd1_downtown' 
      : 'd4_industrial';
    const targetDistrict = DISTRICTS_DATA.find(d => d.id === districtId) || DISTRICTS_DATA[0];
    setSelectedDistrict(targetDistrict);
    setActiveTab('digital_twin');
    onClose();
  };

  // Download forensic JSON report
  const handleDownloadReport = () => {
    const reportData = {
      incidentId: `INC-${selectedScenario.scenarioNumber}-${Date.now()}`,
      scenario: selectedScenario,
      timestamp: `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`,
      status: isCurrentlyActive ? 'ACTIVE_MITIGATION' : 'SIMULATED_INSPECTION',
      playbookExecution: playbookSteps,
      kpiImpact: selectedScenario.kpiImpact,
      currency: 'Indian Rupees (INR - ₹)',
      cityNexusVersion: '2030.4.2-Simulink'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `City_Nexus_Incident_Report_${selectedScenario.id}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border-t-2 border-t-rose-500">
        {/* ========================================================= */}
        {/* MODAL HEADER WITH SCENARIO METADATA & STATUS */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-300 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                {isCurrentlyActive ? 'ACTIVE INCIDENT IN PROGRESS' : 'CRISIS RESPONSE INSPECTOR'}
              </span>
              <span className={`px-2 py-0.5 rounded-md border font-semibold ${subsystemBadge.color}`}>
                {subsystemBadge.label}
              </span>
              <span className="text-slate-400">Scenario 0{selectedScenario.scenarioNumber}</span>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {selectedScenario.name}
            </h2>
            <p className="text-xs text-rose-300 font-medium">
              {selectedScenario.headline}
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {isCurrentlyActive ? (
              <button
                onClick={clearShock}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-rose-600/25"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Neutralize Crisis</span>
              </button>
            ) : (
              <button
                onClick={() => triggerShock(selectedScenario.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-rose-600/25"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Trigger Crisis Now</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Inspector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-slate-950 border-b border-slate-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setModalTab('telemetry')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'telemetry'
                ? 'bg-cyan-950 border border-cyan-500 text-cyan-200 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Response Waveform & Curves</span>
          </button>

          <button
            onClick={() => setModalTab('scada_playbook')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'scada_playbook'
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-200 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Autonomous SCADA Playbook (6 Steps)</span>
          </button>

          <button
            onClick={() => setModalTab('financial_impact')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'financial_impact'
                ? 'bg-amber-950 border border-amber-500 text-amber-200 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Damage Prevention & INR Savings</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* MODAL BODY CONTENT */}
        {/* ========================================================= */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: LIVE RESPONSE TELEMETRY WAVEFORM */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              {/* Dynamic Physical Behavior Waveform Graph */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Transient Physical Behavior & City Nexus Recovery Waveform</span>
                      <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                        100Hz CO-SIMULATION
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Real-time transient simulation displaying initial shock rupture, detection window, and automated recovery curve.
                    </p>
                  </div>

                  {/* Chart Legend & Zoom Toolbar */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-3 h-0.5 bg-rose-500 inline-block stroke-dash" /> Shock Anomaly Spike
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Automated Restabilization
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Isolation Point (8m)
                    </span>
                    {renderZoomToolbar()}
                  </div>
                </div>

                {/* SVG Visual Transient Response Curve Container (Strictly Bounded) */}
                <div className="w-full bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-inner">
                  {incidentZoom > 1 && (
                    <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-md border border-cyan-800/60 mb-2.5 flex items-center justify-between">
                      <span>↔ Scroll horizontally to inspect the emergency restabilization curve at {Math.round(incidentZoom * 100)}% resolution</span>
                      <button onClick={() => setIncidentZoom(1)} className="hover:text-cyan-200 underline">Reset 100%</button>
                    </div>
                  )}
                  <div className="w-full overflow-x-auto pb-1">
                    <div style={{ width: `${Math.round(100 * incidentZoom)}%`, minWidth: `${Math.round(750 * incidentZoom)}px`, transition: 'all 0.2s ease-out' }}>
                      <svg viewBox="0 0 820 220" className="w-full h-auto max-h-[300px] block select-none" preserveAspectRatio="none">
                        {/* Gridlines */}
                        {[0, 25, 50, 75, 100].map((val) => {
                          const y = 190 - (val / 100) * 160;
                          return (
                            <g key={val}>
                              <line x1="48" y1={y} x2="780" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                              <text x="42" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                                {val}%
                              </text>
                            </g>
                          );
                        })}

                        {/* Unmanaged failure cascade (Red line plunging or surging uncontrolled) */}
                        <path
                          d="M 48 160 L 160 160 L 220 30 L 320 20 L 500 15 L 780 10"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeDasharray="5 3"
                        />
                        <text x="775" y="24" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="monospace">
                          Legacy SCADA: Catastrophic Collapse (10% capacity)
                        </text>

                        {/* City Nexus Autonomous Recovery (Cyan line recovering smoothly) */}
                        <path
                          d="M 48 160 L 160 160 L 220 40 L 280 90 L 340 140 L 440 155 L 780 158"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="3.5"
                        />
                        <text x="775" y="148" fill="#22d3ee" fontSize="9.5" fontWeight="bold" textAnchor="end" fontFamily="monospace">
                          City Nexus: 8-Min Valve Isolation & Restabilization (98.7% nominal)
                        </text>

                        {/* Milestone Markers */}
                        {/* Event Start Marker */}
                        <g transform="translate(160, 0)">
                          <line x1="0" y1="20" x2="0" y2="190" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                          <circle cx="0" cy="160" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                          <rect x="-35" y="14" width="70" height="16" rx="3" fill="#881337" />
                          <text x="0" y="25" fill="#fecdd3" fontSize="8.5" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                            RUPTURE (0m)
                          </text>
                        </g>

                        {/* Isolation Marker at 340 */}
                        <g transform="translate(340, 0)">
                          <line x1="0" y1="20" x2="0" y2="190" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                          <circle cx="0" cy="140" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                          <rect x="-42" y="14" width="84" height="16" rx="3" fill="#064e3b" />
                          <text x="0" y="25" fill="#a7f3d0" fontSize="8.5" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                            ISOLATED (8m)
                          </text>
                        </g>

                        {/* Detailed Transient Checkpoint Numbers when zoomed in */}
                        {incidentZoom >= 1.25 && (
                          <g>
                            {/* Point 1: Rupture impact */}
                            <circle cx="220" cy="40" r="3.5" fill="#f59e0b" />
                            <text x="220" y="55" fill="#fcd34d" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                              Shock Peak (T+3m)
                            </text>
                            {/* Point 2: Throttle mitigation */}
                            <circle cx="280" cy="90" r="3.5" fill="#06b6d4" />
                            <text x="280" y="82" fill="#22d3ee" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                              PRV Throttle 56%
                            </text>
                            {/* Point 3: Post-isolation stabilization */}
                            <circle cx="440" cy="155" r="3.5" fill="#10b981" />
                            <text x="440" y="170" fill="#34d399" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                              92% Pressure Restored (T+15m)
                            </text>
                            {/* Point 4: Nominal steady state */}
                            <circle cx="780" cy="158" r="3.5" fill="#06b6d4" />
                            <text x="750" y="175" fill="#38bdf8" fontSize="7.5" fontWeight="bold" textAnchor="end" fontFamily="monospace">
                              98.7% Steady State (T+60m)
                            </text>
                          </g>
                        )}

                        {/* X Axis Timeline Labels */}
                        {['T-10m', 'T+0m', 'T+5m', 'T+15m', 'T+30m', 'T+60m', 'T+120m'].map((label, idx) => {
                          const x = 40 + (idx / 6) * 740;
                          return (
                            <text key={idx} x={x} y="206" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                              {label}
                            </text>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Quantitative Impact KPI Cards (Indian Rupees Included) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedScenario.kpiImpact.map((kpi, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] text-slate-400 block font-medium">{kpi.label}</span>
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Baseline:</span>
                        <span className="font-mono text-rose-400 line-through text-xs font-semibold">{kpi.baseline}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">City Nexus:</span>
                        <span className="font-mono text-base font-bold text-emerald-400">{kpi.cityOs}</span>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-emerald-400 font-mono font-bold flex items-center justify-between">
                      <span>Improvement:</span>
                      <span>{kpi.improvement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AUTONOMOUS SCADA MITIGATION PLAYBOOK */}
          {activeTab === 'scada_playbook' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-300 font-semibold">
                  Autonomous Multi-Agent Actuation Sequence ({selectedScenario.durationMinutes} min horizon)
                </span>
                <span className="text-emerald-400 font-mono font-bold">100% AUTONOMOUS · ZERO OPERATOR LAG</span>
              </div>

              <div className="space-y-3">
                {playbookSteps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors flex items-start gap-3.5"
                  >
                    <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-800/80 text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-xs">{step.step}</h4>
                        <span className="font-mono text-[11px] text-cyan-400 font-semibold">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 shrink-0">
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIAL IMPACT & INR ANALYSIS */}
          {activeTab === 'financial_impact' && (
            <div className="space-y-5">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Catastrophic Risk Mitigation & Economic Balance in Indian Rupees (₹)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/70 p-4 rounded-xl border border-rose-900/40 space-y-2">
                    <span className="font-bold text-rose-300 text-xs block">Legacy Unmanaged Infrastructure Impact</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {selectedScenario.baselineImpact}
                    </p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-rose-400">
                      Estimated Damage: <span className="font-bold">₹4.20 Crore – ₹12.50 Crore</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/70 p-4 rounded-xl border border-emerald-900/40 space-y-2">
                    <span className="font-bold text-emerald-300 text-xs block">City Nexus Autonomous Neural Mitigation</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {selectedScenario.cityOsMitigation}
                    </p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                      Net Loss Averted: <span className="font-bold">96.8% Economic Damage Saved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* MODAL FOOTER WITH OPERATOR INTERVENTIONS */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleJumpToMap}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-medium border border-slate-700"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspect on Digital Twin Map</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenOverrides();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-medium border border-slate-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Manual Actuator Overrides</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors font-medium border border-slate-800"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Incident Log (JSON)</span>
            </button>

            {isCurrentlyActive ? (
              <button
                onClick={() => {
                  clearShock();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/25"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Neutralize Crisis & Return to Nominal</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  triggerShock(selectedScenario.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-rose-600/25"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Simulate Scenario in Real Time</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
