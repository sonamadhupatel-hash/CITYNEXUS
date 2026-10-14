import React from 'react';
import { 
  MapPin, 
  Layers, 
  Zap, 
  Droplets, 
  Trash2, 
  Wind, 
  Cpu, 
  ShieldAlert, 
  Shuffle, 
  BarChart3, 
  BookOpen, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Compass, 
  Sparkles,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { CityNexusLogo } from './CityNexusLogo';
import { useCitySimulation } from '../context/CitySimulationContext';
import { District } from '../types/cityos';
import heroSmartCityImg from '../assets/images/hero_smart_city_digital_twin_1791902313796.jpg';
import controlCenterImg from '../assets/images/smart_grid_control_center_1791902312670.jpg';

interface HomePageProps {
  onNavigate: (tabId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { 
    districts, 
    setSelectedDistrict, 
    energyMetrics, 
    waterMetrics, 
    wasteMetrics, 
    environmentMetrics,
    operatingMode,
    activeShock 
  } = useCitySimulation();

  const handleSelectDistrictOnMap = (district: District) => {
    setSelectedDistrict(district);
    onNavigate('digital_twin');
  };

  const portalPages = [
    {
      id: 'digital_twin',
      title: 'Digital Twin Map',
      tagline: 'Interactive 2D Spatial GIS Explorer',
      description: 'Explore the 5 urban districts of Neo-Veridia with dynamic spatial layer overlays for power lines, water mains, waste fleets, and AQI plumes.',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20',
      badge: 'Interactive GIS',
      metric: '5 Districts · 648k Citizens'
    },
    {
      id: 'subsystems',
      title: 'Subsystems Hub',
      tagline: 'Multi-Domain Engineering Telemetry',
      description: 'Deep-dive into the 4 cyber-physical subsystems: 24h solar/wind curves, acoustic pipe leak FSM, dynamic TSP fleet routing, and high-pressure aerosol scrubbers.',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 hover:border-amber-400 bg-amber-950/20',
      badge: '4 Core Domains',
      metric: `${energyMetrics.renewableSharePct}% Clean Power`
    },
    {
      id: 'city_brain',
      title: 'City Brain Optimizer',
      tagline: 'Autonomous Multi-Agent Linear Programming Solver',
      description: 'Inspect the central coordinator running live LP dispatch (1,420 variables, 2,840 constraints in 1.4s) across 4 operating policies (Balanced, Eco, Peak, Crisis).',
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/20',
      badge: 'city_brain.m',
      metric: '1.42s LP Convergence'
    },
    {
      id: 'stress_lab',
      title: 'Stress Lab Scenarios',
      tagline: 'Systemic Disaster & Shock Testing',
      description: 'Inject 6 extreme shock scenarios (42°C heatwaves, 450 m³/h water main bursts, toxic smog inversions, 100-year storms, and cascading grid blackouts).',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/40 hover:border-rose-400 bg-rose-950/20',
      badge: '6 Stress Cases',
      metric: 'Failure Cascade Mitigation'
    },
    {
      id: 'input_lab',
      title: 'Input Lab & Solver',
      tagline: 'Monte Carlo Randomization & Co-Simulation',
      description: 'Randomize synthetic city input datasets (ambient weather, solar radiation, wind, electrical and water load), execute the mathematical solver, and export results.',
      icon: <Shuffle className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20',
      badge: 'city_inputs.mat',
      metric: 'Custom Inputs & Outputs'
    },
    {
      id: 'analytics',
      title: 'Benchmark Analytics & ROI',
      tagline: 'Verified Results & Population ROI Calculator',
      description: 'Examine verified improvements from results_all.csv (-27.4% peak load, -36.3% water loss). Scale municipal 10-year savings with the population slider.',
      icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20',
      badge: 'results_all.csv',
      metric: '1.8 Year Capital Payback'
    },
    {
      id: 'docs',
      title: 'Model Guide & Docs',
      tagline: '5-Layer Cyber-Physical Architecture & Code',
      description: 'Comprehensive operator manual, mathematical formulations (differential equations, acoustic leak physics), and MATLAB/Simulink source catalog.',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/40 hover:border-purple-400 bg-purple-950/20',
      badge: 'SmartCity_Top.slx',
      metric: '11 Core Functions'
    }
  ];

  return (
    <div className="space-y-12">
      {/* ========================================================= */}
      {/* HERO SECTION WITH WEBSITE NAME, BRAND LOGO, AND RENDER */}
      {/* ========================================================= */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px]">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8 z-10">
            <div className="space-y-6">
              {/* Brand Lockup with Prominent Logo */}
              <div className="space-y-3">
                <CityNexusLogo size="lg" showSubtitle={false} />
                <div className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>AUTONOMOUS SMART CITY OPERATING SYSTEM & DIGITAL TWIN</span>
                </div>
              </div>

              {/* Title & Prose */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  The Self-Healing Nervous System for Tomorrow’s Cities.
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  <strong>City Nexus</strong> continuously harmonizes urban energy dispatch, district water networks, 
                  smart waste routing, and environmental mitigation through a centralized multi-agent linear programming brain.
                </p>
              </div>

              {/* Primary Direct CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('digital_twin')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 group"
                >
                  <span>Launch Digital Twin Map</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('input_lab')}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <Shuffle className="w-4 h-4 text-cyan-400" />
                  <span>Input Randomizer & Solver</span>
                </button>

                <button
                  onClick={() => onNavigate('city_brain')}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>City Brain Console</span>
                </button>
              </div>
            </div>

            {/* Quick System Proof Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Peak Load Shaved</span>
                <span className="text-cyan-400 font-bold text-base sm:text-lg tabular-nums">-27.4%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Pipeline Loss Saved</span>
                <span className="text-blue-400 font-bold text-base sm:text-lg tabular-nums">-36.3%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Monthly OpEx Saved</span>
                <span className="text-emerald-400 font-bold text-base sm:text-lg tabular-nums">₹20.16 Cr / mo</span>
              </div>
            </div>
          </div>

          {/* Hero Right Render Image */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden">
            <img 
              src={heroSmartCityImg} 
              alt="City Nexus Smart City Metropolis"
              className="w-full h-full object-cover object-center lg:absolute lg:inset-0 opacity-85 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 font-mono">
              NEO-VERIDIA · 2030 SPATIAL TWIN
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: LIVE METROPOLITAN TELEMETRY STRIP */}
      {/* ========================================================= */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Power Demand
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {energyMetrics.renewableSharePct}% Clean
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {energyMetrics.totalDemandMW} <span className="text-xs font-normal text-slate-400">MW</span>
          </div>
          <span className="text-[10px] text-slate-500 block font-mono">
            Solar: {energyMetrics.solarGenMW}MW · Wind: {energyMetrics.windGenMW}MW
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Droplets className="w-3.5 h-3.5 text-blue-400" /> Water Storage
            </span>
            <span className="text-[10px] font-mono text-blue-400 font-bold">
              {waterMetrics.reservoirLevelPct}% Full
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {(waterMetrics.reservoirVolumeM3 / 1000000).toFixed(2)} <span className="text-xs font-normal text-slate-400">M m³</span>
          </div>
          <span className="text-[10px] text-slate-500 block font-mono">
            Pressure: {waterMetrics.averagePressureBar} bar · Loss: {waterMetrics.waterLossRatePct}%
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Trash2 className="w-3.5 h-3.5 text-emerald-400" /> Smart Waste
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              -29.8% Mileage
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {wasteMetrics.activeTrucks} / 8 <span className="text-xs font-normal text-slate-400">EV Units</span>
          </div>
          <span className="text-[10px] text-slate-500 block font-mono">
            Avg Fill: {wasteMetrics.avgFillLevelPct}% · Landfill Div: {wasteMetrics.landfillDiversionPct}%
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Wind className="w-3.5 h-3.5 text-amber-400" /> Air Quality
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              {environmentMetrics.activeMistCannons} Mist Scrubbers
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            AQI {environmentMetrics.cityAqiAvg}
          </div>
          <span className="text-[10px] text-slate-500 block font-mono">
            PM2.5: {environmentMetrics.pm25UgM3} µg/m³ · UHI: +{environmentMetrics.urbanHeatIslandDeltaC}°C
          </span>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: MULTI-PAGE PORTAL CARDS (EXPLORE ALL PAGES) */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>City Nexus Operational Sub-Pages</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Access any module directly from here or return to this portal at any time via the top navigation bar.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">7 INTEGRATED MODULES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portalPages.map((page) => (
            <div
              key={page.id}
              onClick={() => onNavigate(page.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl hover:-translate-y-1 hover:shadow-2xl ${page.color}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-md">
                    {page.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-bold">
                    {page.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{page.title}</h3>
                  <span className="text-xs text-cyan-400 font-mono block mt-0.5">{page.tagline}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {page.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{page.metric}</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Enter Page <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: 5 CITY DISTRICTS PREVIEW */}
      {/* ========================================================= */}
      <section className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Neo-Veridia Urban Districts</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any district card to jump directly to its live digital twin telemetry map.
            </p>
          </div>
          <button
            onClick={() => onNavigate('digital_twin')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Spatial Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {districts.map((d) => (
            <div
              key={d.id}
              onClick={() => handleSelectDistrictOnMap(d)}
              className="bg-slate-900/60 hover:bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase">{d.areaKm2} km²</span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              </div>

              <h4 className="font-bold text-white text-xs leading-snug">{d.name}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{d.description}</p>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono">
                <span className="text-cyan-400">{d.metrics.powerDemandMW} MW</span>
                <span className="text-slate-500">AQI {d.metrics.aqi}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: COMMAND CONTROL ROOM CALLOUT */}
      {/* ========================================================= */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 relative h-64 lg:h-full min-h-[240px]">
            <img 
              src={controlCenterImg} 
              alt="City Nexus Operations Command Center"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-slate-950/30 to-slate-950" />
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 space-y-4">
            <span className="text-xs font-mono text-indigo-400 uppercase font-bold tracking-wider">
              OPERATIONS COMMAND INFRASTRUCTURE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Autonomous Intelligence with Human-in-the-Loop Safeguards
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every action dispatched by City Nexus—from motorized water valve isolation to battery frequency support—is 
              audited in real time. Authorized operators can inject manual overrides or trigger disaster response tests at any moment.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <button
                onClick={() => onNavigate('city_brain')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors"
              >
                Launch Brain Console
              </button>
              <button
                onClick={() => onNavigate('stress_lab')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
              >
                Simulate System Failures
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
