import React, { useState } from 'react';
import { 
  Layers, 
  Zap, 
  Droplets, 
  Trash2, 
  Wind, 
  MapPin, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  Maximize2,
  Info,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useCitySimulation } from '../context/CitySimulationContext';
import { District, SubsystemType } from '../types/cityos';
import { DeepScanModal } from './DeepScanModal';
import { TuneDistrictModal } from './TuneDistrictModal';

export const CityMapDigitalTwin: React.FC = () => {
  const { 
    districts, 
    selectedDistrict, 
    setSelectedDistrict, 
    energyMetrics, 
    waterMetrics, 
    wasteMetrics, 
    environmentMetrics,
    operatingMode,
    activeShock,
    currentHour,
    districtTunings,
    latestScanReports
  } = useCitySimulation();

  const [isDeepScanOpen, setIsDeepScanOpen] = useState<boolean>(false);
  const [isTuneDistrictOpen, setIsTuneDistrictOpen] = useState<boolean>(false);

  // Spatial layer toggles
  const [layers, setLayers] = useState({
    energy: true,
    water: true,
    waste: true,
    environment: true,
    districtLabels: true,
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev [layer] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & KPI Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Spatial Digital Twin: Neo-Veridia 2030</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              5 Districts · 648,000 Inhabitants
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time co-simulation telemetry overlaying Energy, Water DMAs, Smart Waste, and Atmospheric AQI layers. Click any district to inspect.
          </p>
        </div>

        {/* Spatial Layer Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1 font-medium">
            <Layers className="w-3.5 h-3.5 text-slate-400" /> Layers:
          </span>
          <button
            onClick={() => toggleLayer('energy')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
              layers.energy 
                ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300 font-medium' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Power Grid</span>
          </button>

          <button
            onClick={() => toggleLayer('water')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
              layers.water 
                ? 'bg-blue-950/80 border-blue-700 text-blue-300 font-medium' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Droplets className="w-3 h-3 text-blue-400" />
            <span>Water DMAs</span>
          </button>

          <button
            onClick={() => toggleLayer('waste')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
              layers.waste 
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-medium' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Trash2 className="w-3 h-3 text-emerald-400" />
            <span>Waste Fleet</span>
          </button>

          <button
            onClick={() => toggleLayer('environment')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
              layers.environment 
                ? 'bg-amber-950/80 border-amber-700 text-amber-300 font-medium' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Wind className="w-3 h-3 text-amber-400" />
            <span>AQI Heatmap</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map SVG (2/3 width) + District Inspector Panel (1/3 width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

          {/* Interactive SVG Map */}
          <div className="relative aspect-[16/10] w-full">
            <svg 
              viewBox="0 0 1000 620" 
              className="w-full h-full select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradients for districts */}
                <linearGradient id="grad_greenbelt" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14532d" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#166534" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="grad_downtown" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#083344" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0e7490" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad_tech" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#312e81" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad_residential" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#064e3b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="grad_industrial" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#451a03" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0.2" />
                </linearGradient>

                {/* River water gradient */}
                <linearGradient id="river_grad" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.7" />
                </linearGradient>

                {/* AQI Smog filter if active */}
                <radialGradient id="smog_harbor" cx="75%" cy="75%" r="35%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={activeShock?.id === 'scenario_3_smog_inversion' ? "0.6" : "0.2"} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Waterway / Central River Channel */}
              <path 
                d="M 120 0 Q 280 180 420 280 T 640 400 Q 760 480 1000 520 L 1000 620 L 700 620 Q 560 520 400 400 T 180 200 L 0 80 L 0 0 Z" 
                fill="url(#river_grad)"
                className="opacity-70"
              />

              {/* DISTRICT 5: Alpine Greenbelt & Reservoir Basin */}
              <g 
                onClick={() => setSelectedDistrict(districts[4])}
                className="cursor-pointer transition-all duration-200"
              >
                <polygon 
                  points="30,30 320,20 380,180 240,260 40,240 10,120"
                  fill="url(#grad_greenbelt)"
                  stroke={selectedDistrict?.id === 'd5_greenbelt' ? '#84cc16' : '#22c55e'}
                  strokeWidth={selectedDistrict?.id === 'd5_greenbelt' ? '3' : '1.5'}
                  strokeDasharray="4 2"
                  className="hover:stroke-lime-400 transition-colors"
                />
                <text x="120" y="90" fill="#a3e635" fontSize="13" fontWeight="bold">D5: Green Reserve Basin</text>
                <text x="120" y="110" fill="#86efac" fontSize="10">Alpine Watershed · 42 MW Solar</text>
              </g>

              {/* DISTRICT 1: Downtown Financial Core */}
              <g 
                onClick={() => setSelectedDistrict(districts[0])}
                className="cursor-pointer transition-all duration-200"
              >
                <polygon 
                  points="360,190 620,160 640,360 440,370 340,280"
                  fill="url(#grad_downtown)"
                  stroke={selectedDistrict?.id === 'd1_downtown' ? '#06b6d4' : '#0284c7'}
                  strokeWidth={selectedDistrict?.id === 'd1_downtown' ? '3' : '1.5'}
                  className="hover:stroke-cyan-300 transition-colors"
                />
                <text x="440" y="240" fill="#67e8f9" fontSize="13" fontWeight="bold">D1: Downtown Core</text>
                <text x="440" y="260" fill="#bae6fd" fontSize="10">Civic Center · HVAC Peak: 48 MW</text>
              </g>

              {/* DISTRICT 2: Tech Innovation Valley */}
              <g 
                onClick={() => setSelectedDistrict(districts[1])}
                className="cursor-pointer transition-all duration-200"
              >
                <polygon 
                  points="650,50 960,30 980,280 660,260 640,140"
                  fill="url(#grad_tech)"
                  stroke={selectedDistrict?.id === 'd2_tech' ? '#818cf8' : '#4f46e5'}
                  strokeWidth={selectedDistrict?.id === 'd2_tech' ? '3' : '1.5'}
                  className="hover:stroke-indigo-300 transition-colors"
                />
                <text x="730" y="120" fill="#a5b4fc" fontSize="13" fontWeight="bold">D2: Tech Valley</text>
                <text x="730" y="140" fill="#c7d2fe" fontSize="10">Supercomputing · Edge Microgrids</text>
              </g>

              {/* DISTRICT 3: Residential Eco-Heights */}
              <g 
                onClick={() => setSelectedDistrict(districts[2])}
                className="cursor-pointer transition-all duration-200"
              >
                <polygon 
                  points="40,290 320,300 420,440 380,580 40,580"
                  fill="url(#grad_residential)"
                  stroke={selectedDistrict?.id === 'd3_residential' ? '#10b981' : '#059669'}
                  strokeWidth={selectedDistrict?.id === 'd3_residential' ? '3' : '1.5'}
                  className="hover:stroke-emerald-300 transition-colors"
                />
                <text x="120" y="440" fill="#6ee7b7" fontSize="13" fontWeight="bold">D3: Residential Eco-Heights</text>
                <text x="120" y="460" fill="#a7f3d0" fontSize="10">310k Citizens · 38 MW Rooftop PV</text>
              </g>

              {/* DISTRICT 4: Maritime Port & Logistics */}
              <g 
                onClick={() => setSelectedDistrict(districts[3])}
                className="cursor-pointer transition-all duration-200"
              >
                <polygon 
                  points="500,420 740,360 980,330 980,590 540,590 460,480"
                  fill="url(#grad_industrial)"
                  stroke={selectedDistrict?.id === 'd4_industrial' ? '#f59e0b' : '#d97706'}
                  strokeWidth={selectedDistrict?.id === 'd4_industrial' ? '3' : '1.5'}
                  className="hover:stroke-amber-300 transition-colors"
                />
                <text x="640" y="480" fill="#fcd34d" fontSize="13" fontWeight="bold">D4: Maritime Port & Logistics</text>
                <text x="640" y="500" fill="#fef3c7" fontSize="10">Container Berths · Wind Hub Landing</text>
              </g>

              {/* LAYER: Atmospheric AQI Dispersion Heatmap */}
              {layers.environment && (
                <g className="pointer-events-none">
                  {/* Harbor Smog Oval */}
                  <ellipse 
                    cx="760" 
                    cy="480" 
                    rx="180" 
                    ry="90" 
                    fill="url(#smog_harbor)"
                  />
                  {/* Mist Cannon Locations */}
                  <circle cx="680" cy="440" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="790" cy="460" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="860" cy="490" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="695" y="435" fill="#38bdf8" fontSize="9" fontWeight="bold">Mist Scrubber MC-04</text>
                </g>
              )}

              {/* LAYER: Power Grid & Renewable Assets */}
              {layers.energy && (
                <g className="pointer-events-none">
                  {/* HV Lines */}
                  <line x1="200" y1="120" x2="480" y2="240" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 3" />
                  <line x1="480" y1="240" x2="760" y2="180" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 3" />
                  <line x1="480" y1="240" x2="260" y2="420" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 3" />
                  <line x1="480" y1="240" x2="720" y2="470" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 3" />

                  {/* Central Substation */}
                  <rect x="468" y="228" width="24" height="24" rx="4" fill="#0891b2" stroke="#ffffff" strokeWidth="2" />
                  <text x="473" y="245" fill="#ffffff" fontSize="10" fontWeight="bold">SS1</text>

                  {/* Alpine Solar Farm */}
                  <g transform="translate(180, 80)">
                    <rect x="0" y="0" width="28" height="18" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                    <line x1="7" y1="0" x2="7" y2="18" stroke="#38bdf8" strokeWidth="0.5" />
                    <line x1="14" y1="0" x2="14" y2="18" stroke="#38bdf8" strokeWidth="0.5" />
                    <line x1="21" y1="0" x2="21" y2="18" stroke="#38bdf8" strokeWidth="0.5" />
                  </g>

                  {/* Offshore Wind Turbines */}
                  <g transform="translate(900, 420)">
                    <line x1="0" y1="0" x2="0" y2="24" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="#38bdf8" />
                    <line x1="-12" y1="-6" x2="12" y2="6" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                  <g transform="translate(940, 470)">
                    <line x1="0" y1="0" x2="0" y2="24" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="#38bdf8" />
                    <line x1="-12" y1="-6" x2="12" y2="6" stroke="#ffffff" strokeWidth="1.5" />
                  </g>

                  {/* BESS Battery Storage Icon in Tech Valley */}
                  <g transform="translate(780, 180)">
                    <rect x="0" y="0" width="34" height="18" rx="3" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                    <text x="4" y="13" fill="#a5b4fc" fontSize="9" fontWeight="bold">BESS 32M</text>
                  </g>
                </g>
              )}

              {/* LAYER: Water Pipelines & Leak Detection */}
              {layers.water && (
                <g className="pointer-events-none">
                  {/* Main Water Aqueduct Conduit */}
                  <path 
                    d="M 160 140 Q 300 240 450 310 T 700 390" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />
                  {/* Booster Pump Stations */}
                  <circle cx="310" cy="240" r="7" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="322" y="244" fill="#93c5fd" fontSize="9" fontWeight="bold">Pump P-01</text>

                  {/* Pipe Burst Simulation Marker if active */}
                  {activeShock?.id === 'scenario_2_pipe_burst' && (
                    <g transform="translate(450, 310)">
                      <circle cx="0" cy="0" r="14" fill="#dc2626" opacity="0.4" className="animate-ping" />
                      <circle cx="0" cy="0" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                      <text x="10" y="4" fill="#fca5a5" fontSize="10" fontWeight="bold">RUPTURE 450 m³/h</text>
                    </g>
                  )}
                </g>
              )}

              {/* LAYER: Smart Waste Smart Bins & Fleet Trucks */}
              {layers.waste && (
                <g className="pointer-events-none">
                  {/* Moving EV Collection Trucks */}
                  <g transform="translate(360, 480)">
                    <rect x="0" y="0" width="20" height="11" rx="2" fill="#047857" stroke="#34d399" strokeWidth="1" />
                    <circle cx="4" cy="11" r="2.5" fill="#0f172a" />
                    <circle cx="16" cy="11" r="2.5" fill="#0f172a" />
                    <text x="24" y="9" fill="#6ee7b7" fontSize="8" fontWeight="bold">EV Truck #2</text>
                  </g>

                  <g transform="translate(720, 520)">
                    <rect x="0" y="0" width="20" height="11" rx="2" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
                    <circle cx="4" cy="11" r="2.5" fill="#0f172a" />
                    <circle cx="16" cy="11" r="2.5" fill="#0f172a" />
                    <text x="24" y="9" fill="#fcd34d" fontSize="8" fontWeight="bold">EV Truck #4</text>
                  </g>

                  {/* Smart Bin Cluster Nodes */}
                  <circle cx="410" cy="270" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="520" cy="220" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="790" cy="510" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Map Footer Status Legend */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> Power Substation / BESS
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> High-Pressure DMA Conduit
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Dynamic EV Fleet
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Mist Aerosol Scrubber
              </span>
            </div>
            <div className="text-slate-500 font-mono">
              CO-ORDINATES: EPSG:3857 · GRID 1000x620
            </div>
          </div>
        </div>

        {/* District Inspector Panel */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5 shadow-xl">
          {selectedDistrict ? (
            <>
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-cyan-400 font-mono font-semibold uppercase tracking-wider">
                    {selectedDistrict.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {selectedDistrict.areaKm2} km²
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedDistrict.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedDistrict.description}
                </p>
              </div>

              {/* District KPI Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" /> Power
                    </span>
                    <span className="text-[10px] text-slate-500">Peak</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1 tabular-nums">
                    {selectedDistrict.metrics.powerDemandMW} <span className="text-xs font-normal text-slate-400">MW</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    +{selectedDistrict.metrics.solarCapMW} MW Local Solar
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-400" /> Water
                    </span>
                    <span className="text-[10px] text-slate-500">Flow</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1 tabular-nums">
                    {selectedDistrict.metrics.waterDemandMLD} <span className="text-xs font-normal text-slate-400">MLD</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {selectedDistrict.metrics.waterPressureBar} bar pressure
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-amber-400" /> Air Quality
                    </span>
                    <span className="text-[10px] text-slate-500">AQI</span>
                  </div>
                  <div className="text-lg font-bold font-mono mt-1 tabular-nums text-white">
                    {selectedDistrict.metrics.aqi}
                    <span className="text-xs font-normal text-slate-400 ml-1">
                      ({selectedDistrict.metrics.pm25} µg/m³)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Temp: {selectedDistrict.metrics.temperatureC}°C
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Trash2 className="w-3 h-3 text-emerald-400" /> Bins
                    </span>
                    <span className="text-[10px] text-slate-500">Avg Fill</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1 tabular-nums">
                    {selectedDistrict.metrics.wasteBinFillPct}%
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    TSP EV Route Active
                  </div>
                </div>
              </div>

              {/* District Infrastructure Status */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-slate-200 flex items-center justify-between">
                  <span>Subsystem Health & Isolation</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Nominal
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-400 text-[11px]">
                  <div className="flex justify-between">
                    <span>Acoustic Leak Risk Score:</span>
                    <span className="font-mono text-slate-200">{selectedDistrict.metrics.leakRiskScore} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Population Density:</span>
                    <span className="font-mono text-slate-200">
                      {Math.round(selectedDistrict.population / selectedDistrict.areaKm2).toLocaleString()} / km²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Telemetry Sensors:</span>
                    <span className="font-mono text-cyan-400">2,410 nodes</span>
                  </div>
                </div>
              </div>

                {/* Active Tuning & Latest Scan Indicators */}
                {districtTunings[selectedDistrict.id] && (
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/70 text-[11px] text-amber-300 flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" /> Custom SCADA Tuned
                    </span>
                    <span className="font-mono text-[10px]">
                      {districtTunings[selectedDistrict.id].prvPressureBar} bar · {districtTunings[selectedDistrict.id].mistCannonAqiTrigger} AQI
                    </span>
                  </div>
                )}

                {latestScanReports[selectedDistrict.id] && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/70 text-[11px] text-emerald-300 flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Deep Audit Grade
                    </span>
                    <span className="font-mono text-[10px] font-bold">
                      {latestScanReports[selectedDistrict.id].overallHealthScore}% ({latestScanReports[selectedDistrict.id].integrityGrade})
                    </span>
                  </div>
                )}

              {/* Quick Action Buttons for selected district */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setIsDeepScanOpen(true)}
                  className="flex-1 py-2.5 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-950 flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Run Deep Scan</span>
                </button>
                <button
                  onClick={() => setIsTuneDistrictOpen(true)}
                  className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tune District</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select any district on the map to inspect live metrics.
            </div>
          )}
        </div>
      </div>

      {/* Deep SCADA Diagnostic Scan Modal */}
      {selectedDistrict && (
        <DeepScanModal
          isOpen={isDeepScanOpen}
          onClose={() => setIsDeepScanOpen(false)}
          district={selectedDistrict}
          onOpenTuneDistrict={() => {
            setIsDeepScanOpen(false);
            setIsTuneDistrictOpen(true);
          }}
        />
      )}

      {/* Actuator & Setpoint Tuning Modal */}
      {selectedDistrict && (
        <TuneDistrictModal
          isOpen={isTuneDistrictOpen}
          onClose={() => setIsTuneDistrictOpen(false)}
          district={selectedDistrict}
        />
      )}
    </div>
  );
};
