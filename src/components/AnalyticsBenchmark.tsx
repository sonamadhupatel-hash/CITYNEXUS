import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  ShieldCheck, 
  Download, 
  Calculator,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  FileSpreadsheet,
  PieChart,
  Zap,
  Droplets,
  Trash2,
  Wind,
  Layers,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { BENCHMARK_COMPARISONS } from '../data/cityData';
import { formatCrores, formatINR } from '../utils/formatters';

export const AnalyticsBenchmark: React.FC = () => {
  const [cityPopulation, setCityPopulation] = useState<number>(648000);
  const [activeGraphTab, setActiveGraphTab] = useState<'comparison_bars' | 'savings_trajectory' | 'budget_breakdown'>('savings_trajectory');
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  // Zoom states for benchmark graphs (100% to 250%)
  const [savingsZoom, setSavingsZoom] = useState<number>(1);
  const [barsZoom, setBarsZoom] = useState<number>(1);
  const [budgetZoom, setBudgetZoom] = useState<number>(1);

  const renderZoomToolbar = (zoom: number, setZoom: React.Dispatch<React.SetStateAction<number>>, label: string) => (
    <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 text-xs shrink-0 shadow-sm">
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

  // Scaled calculations based on population scale factor (reference: 648,000)
  const scale = cityPopulation / 648000;
  const scaledMonthlySavingsINR = Math.round(BENCHMARK_COMPARISONS.financials.monthlySavingsINR * scale);
  const scaledAnnualSavingsINR = Math.round(BENCHMARK_COMPARISONS.financials.annualSavingsINR * scale);
  const scaledTenYearSavingsINR = Math.round(BENCHMARK_COMPARISONS.financials.tenYearProjectedINR * scale);
  const scaledCarbonCredits = Math.round(BENCHMARK_COMPARISONS.financials.carbonCreditsTonPerYear * scale);
  // Estimated Article 6 Carbon Credit Value in INR (@ ₹2,500 / ton)
  const carbonCreditValueINR = scaledCarbonCredits * 2500;
  // Estimated Initial CapEx in INR (scales with population)
  const initialCapexINR = Math.round(4350000000 * scale); // ₹435 Crore for 648k population

  // 10-Year Cumulative Savings data points for the trajectory graph
  const years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const trajectoryPoints = years.map(yr => {
    // Annual compounded savings with 3% efficiency gains over time
    const cumulativeSavings = yr === 0 ? 0 : Math.round(scaledAnnualSavingsINR * yr * (1 + 0.015 * (yr - 1)));
    const netReturn = cumulativeSavings - initialCapexINR;
    return {
      year: yr,
      yearLabel: yr === 0 ? 'Start (Y0)' : `Year ${yr}`,
      cumulativeSavingsINR: cumulativeSavings,
      netReturnINR: netReturn,
      cumulativeSavingsCr: (cumulativeSavings / 10000000).toFixed(1),
      netReturnCr: (netReturn / 10000000).toFixed(1),
    };
  });

  const maxTrajectorySavings = trajectoryPoints[10].cumulativeSavingsINR;

  // Breakdown of Annual Savings in INR by Subsystem
  const savingsBreakdown = [
    { domain: 'Power Grid & Peak Shaving', pct: 58, amountINR: scaledAnnualSavingsINR * 0.58, color: '#06b6d4', icon: <Zap className="w-3.5 h-3.5 text-cyan-400" /> },
    { domain: 'Water Distribution & Leak Loss', pct: 23, amountINR: scaledAnnualSavingsINR * 0.23, color: '#3b82f6', icon: <Droplets className="w-3.5 h-3.5 text-blue-400" /> },
    { domain: 'EV Waste Logistics & Fuel', pct: 12, amountINR: scaledAnnualSavingsINR * 0.12, color: '#10b981', icon: <Trash2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { domain: 'Article 6 Carbon Offsets', pct: 7, amountINR: scaledAnnualSavingsINR * 0.07, color: '#8b5cf6', icon: <Leaf className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  // Comparative graphical metrics (Before vs After)
  const visualComparisonMetrics = [
    {
      label: 'Peak Power Demand',
      unit: 'MW',
      baseline: 148.6,
      cityOs: 107.9,
      changePct: -27.4,
      maxScale: 160,
      baselineDisplay: '148.6 MW',
      cityOsDisplay: '107.9 MW',
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      color: 'cyan'
    },
    {
      label: 'Water Loss (Non-Revenue Water)',
      unit: '%',
      baseline: 24.8,
      cityOs: 15.8,
      changePct: -36.3,
      maxScale: 30,
      baselineDisplay: '24.8 %',
      cityOsDisplay: '15.8 %',
      icon: <Droplets className="w-4 h-4 text-blue-400" />,
      color: 'blue'
    },
    {
      label: 'Waste Fleet Mileage',
      unit: 'km/day',
      baseline: 1420,
      cityOs: 997,
      changePct: -29.8,
      maxScale: 1600,
      baselineDisplay: '1,420 km',
      cityOsDisplay: '997 km',
      icon: <Trash2 className="w-4 h-4 text-emerald-400" />,
      color: 'emerald'
    },
    {
      label: 'CO2e Carbon Intensity',
      unit: 'kg/MWh',
      baseline: 382,
      cityOs: 112,
      changePct: -70.7,
      maxScale: 420,
      baselineDisplay: '382 kg/MWh',
      cityOsDisplay: '112 kg/MWh',
      icon: <Leaf className="w-4 h-4 text-purple-400" />,
      color: 'purple'
    },
    {
      label: 'Annual Hazardous AQI (>100) Hours',
      unit: 'hours',
      baseline: 284,
      cityOs: 89,
      changePct: -68.7,
      maxScale: 320,
      baselineDisplay: '284 hrs',
      cityOsDisplay: '89 hrs',
      icon: <Wind className="w-4 h-4 text-amber-400" />,
      color: 'amber'
    },
    {
      label: 'Monthly Municipal OpEx',
      unit: '₹ Cr',
      baseline: 64.3,
      cityOs: 44.1,
      changePct: -31.3,
      maxScale: 75,
      baselineDisplay: '₹64.3 Cr',
      cityOsDisplay: '₹44.1 Cr',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      color: 'emerald'
    }
  ];

  const handleExportCSV = () => {
    const headers = "Metric,Legacy Baseline,City Nexus,Improvement %,Unit\n";
    const rows = BENCHMARK_COMPARISONS.overall.map(r => 
      `"${r.metric}","${r.baseline}","${r.cityOs}",${r.changePct},"${r.unit}"`
    ).join("\n");

    const financialSection = `\n\nFinancial Projections (Indian Rupees - Population: ${cityPopulation.toLocaleString()})\n` +
      `Metric,Amount in INR,Amount in Crores\n` +
      `Monthly OpEx Reduction,${scaledMonthlySavingsINR},${(scaledMonthlySavingsINR / 10000000).toFixed(2)} Cr\n` +
      `Annual Municipal Savings,${scaledAnnualSavingsINR},${(scaledAnnualSavingsINR / 10000000).toFixed(2)} Cr\n` +
      `10-Year Cumulative Value,${scaledTenYearSavingsINR},${(scaledTenYearSavingsINR / 10000000).toFixed(2)} Cr\n` +
      `Annual Carbon Credits (tons),${scaledCarbonCredits},${scaledCarbonCredits} t CO2e\n` +
      `Annual Carbon Value (INR),${carbonCreditValueINR},${(carbonCreditValueINR / 10000000).toFixed(2)} Cr\n` +
      `Estimated Initial CapEx,${initialCapexINR},${(initialCapexINR / 10000000).toFixed(2)} Cr\n` +
      `Payback Period,1.8 Years,1.8 Years\n`;
    
    const blob = new Blob([headers + rows + financialSection], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `City_Nexus_Benchmark_Results_${cityPopulation}_pop_INR.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Simulink Verification & Benchmark Analytics</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
              results_all.csv · improvement_pct.csv
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Comprehensive Verification & Graphical ROI Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Full co-simulation validation comparing Unoptimized Legacy City vs City Nexus across core municipal resilience, 
            environmental health, and economic indicators calculated entirely in <strong>Indian Rupees (₹)</strong>.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors shadow-sm shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Benchmark CSV (INR ₹)</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: INTERACTIVE MUNICIPAL ROI CALCULATOR (INR ₹) */}
      {/* ========================================================= */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Municipal Cost-Benefit & ROI Calculator (cost_benefit.m)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Scale municipal savings projections by adjusting city population. All calculations in <strong>Indian Rupees (₹ Crores)</strong>.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-2 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>CAPITAL PAYBACK: 1.8 YEARS</span>
          </div>
        </div>

        {/* Population Slider Control */}
        <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Metropolitan Inhabitant Population:</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold text-base">
              {cityPopulation.toLocaleString()} citizens
            </span>
          </div>
          <input 
            type="range"
            min="50000"
            max="2500000"
            step="25000"
            value={cityPopulation}
            onChange={(e) => setCityPopulation(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 h-2 bg-slate-800 rounded appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>50,000 (Small Eco-Town)</span>
            <span className="text-cyan-400 font-semibold">648,000 (Neo-Veridia Baseline)</span>
            <span>2,500,000 (Metropolis Megacity)</span>
          </div>
        </div>

        {/* Projected Financial Returns Grid in INDIAN RUPEES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1.5 shadow-md">
            <span className="text-slate-400 text-xs block font-medium">Monthly OpEx Reduction</span>
            <div className="text-2xl font-bold font-mono text-cyan-300 mt-1 tabular-nums">
              {formatCrores(scaledMonthlySavingsINR)} <span className="text-xs font-normal text-slate-400">/ mo</span>
            </div>
            <span className="text-[11px] text-emerald-400 block font-mono">-31.3% operating cost</span>
            <span className="text-[10px] text-slate-500 block pt-1 border-t border-slate-800/80 font-mono">
              ₹{(scaledMonthlySavingsINR / 100000).toFixed(0)} Lakh per month
            </span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1.5 shadow-md">
            <span className="text-slate-400 text-xs block font-medium">Annual Municipal Savings</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              {formatCrores(scaledAnnualSavingsINR)} <span className="text-xs font-normal text-slate-400">/ yr</span>
            </div>
            <span className="text-[11px] text-slate-400 block font-mono">Direct utility & logistics savings</span>
            <span className="text-[10px] text-slate-500 block pt-1 border-t border-slate-800/80 font-mono">
              ₹{(scaledAnnualSavingsINR / 10000000).toFixed(1)} Crore per year
            </span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1.5 shadow-md">
            <span className="text-slate-400 text-xs block font-medium">10-Year Cumulative Value</span>
            <div className="text-2xl font-bold font-mono text-indigo-300 mt-1 tabular-nums">
              {formatCrores(scaledTenYearSavingsINR, 0)}
            </div>
            <span className="text-[11px] text-slate-400 block font-mono">Net Present Value (NPV @ 5%)</span>
            <span className="text-[10px] text-emerald-400 block pt-1 border-t border-slate-800/80 font-mono">
              Net ROI: +{((scaledTenYearSavingsINR - initialCapexINR) / initialCapexINR * 100).toFixed(0)}%
            </span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1.5 shadow-md">
            <span className="text-slate-400 text-xs block font-medium">Annual Carbon Offset Credits</span>
            <div className="text-2xl font-bold font-mono text-emerald-300 mt-1 tabular-nums">
              {scaledCarbonCredits.toLocaleString()} <span className="text-xs font-normal text-slate-400">t CO2e</span>
            </div>
            <span className="text-[11px] text-emerald-400 block font-mono">
              Value: {formatCrores(carbonCreditValueINR)} / yr
            </span>
            <span className="text-[10px] text-slate-500 block pt-1 border-t border-slate-800/80 font-mono">
              Eligible for Article 6 credits
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: GRAPHICAL REPRESENTATION SUITE (TABS) */}
      {/* ========================================================= */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Graphical Output & Visual Analysis</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual comparisons, 10-year cumulative trajectories in Indian Rupees, and municipal budget allocation.
            </p>
          </div>

          {/* Graph Selector Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveGraphTab('savings_trajectory')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeGraphTab === 'savings_trajectory'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📈 10-Year ROI Trajectory (₹ Cr)
            </button>
            <button
              onClick={() => setActiveGraphTab('comparison_bars')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeGraphTab === 'comparison_bars'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Before vs After Bars
            </button>
            <button
              onClick={() => setActiveGraphTab('budget_breakdown')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeGraphTab === 'budget_breakdown'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🥧 Savings Allocation (₹)
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* GRAPH 1: 10-YEAR CUMULATIVE SAVINGS TRAJECTORY (SVG AREA CHART) */}
        {/* ------------------------------------------------------------- */}
        {activeGraphTab === 'savings_trajectory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">
                10-Year Cumulative Municipal Returns vs Initial CapEx Investment in <strong>Indian Rupees (₹ Crores)</strong>
              </span>
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Cumulative Savings (₹ Cr)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-rose-500 inline-block stroke-dash" /> Initial CapEx Baseline ({formatCrores(initialCapexINR)})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Break-Even Point (1.8 Yrs)
                  </span>
                </div>
                {renderZoomToolbar(savingsZoom, setSavingsZoom, '10-Yr Trajectory')}
              </div>
            </div>

            {/* SVG Trajectory Chart Container (Fully Bounded, No Overlap) */}
            <div className="w-full bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-inner">
              {savingsZoom > 1 && (
                <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-md border border-emerald-800/60 mb-2.5 flex items-center justify-between">
                  <span>↔ Scroll horizontally to inspect 10-year cumulative savings numbers at {Math.round(savingsZoom * 100)}% resolution</span>
                  <button onClick={() => setSavingsZoom(1)} className="hover:text-emerald-200 underline">Reset 100%</button>
                </div>
              )}
              <div className="w-full overflow-x-auto pb-1">
                <div style={{ width: `${Math.round(100 * savingsZoom)}%`, minWidth: `${Math.round(850 * savingsZoom)}px`, transition: 'all 0.2s ease-out' }}>
                  <svg viewBox="0 0 900 270" className="w-full h-auto max-h-[340px] block select-none" preserveAspectRatio="none">
                    {/* Horizontal Gridlines & Y-Axis Labels in ₹ Crores */}
                    {[0, 500, 1000, 1500, 2000, 2500, 3000].map((crVal) => {
                      const y = 205 - (crVal / 3000) * 160;
                      return (
                        <g key={crVal}>
                          <line x1="75" y1={y} x2="780" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                          <text x="65" y={y + 3.5} fill="#64748b" fontSize="10.5" textAnchor="end" fontFamily="monospace">
                            ₹{crVal} Cr
                          </text>
                        </g>
                      );
                    })}

                    {/* Initial CapEx Reference Line (Red Dashed) */}
                    {(() => {
                      const capexCr = initialCapexINR / 10000000;
                      const capexY = 205 - (capexCr / 3000) * 160;
                      return (
                        <g>
                          <line x1="75" y1={capexY} x2="780" y2={capexY} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 3" />
                          <rect x="660" y={capexY - 18} width="118" height="15" rx="3" fill="#450a0a" stroke="#b91c1c" strokeWidth="0.8" />
                          <text x="774" y={capexY - 7} fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="monospace">
                            CapEx: ₹{capexCr.toFixed(0)} Cr
                          </text>
                        </g>
                      );
                    })()}

                    {/* Shaded Cumulative Savings Area */}
                    <path
                      d={`M 75 205 ${trajectoryPoints.map((tp, idx) => {
                        const x = 75 + (idx / 10) * 705;
                        const crVal = tp.cumulativeSavingsINR / 10000000;
                        const y = 205 - (crVal / 3000) * 160;
                        return `L ${x} ${y}`;
                      }).join(' ')} L 780 205 Z`}
                      fill="#10b981"
                      fillOpacity="0.16"
                    />

                    {/* Trajectory Solid Curve */}
                    <polyline
                      points={trajectoryPoints.map((tp, idx) => {
                        const x = 75 + (idx / 10) * 705;
                        const crVal = tp.cumulativeSavingsINR / 10000000;
                        const y = 205 - (crVal / 3000) * 160;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                    />

                    {/* Break-Even Marker at Year 1.8 */}
                    {(() => {
                      const beX = 75 + (1.8 / 10) * 705;
                      const capexCr = initialCapexINR / 10000000;
                      const beY = 205 - (capexCr / 3000) * 160;
                      return (
                        <g>
                          <line x1={beX} y1="36" x2={beX} y2="205" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
                          <circle cx={beX} cy={beY} r="5.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                          <rect x={beX - 52} y="16" width="104" height="18" rx="4" fill="#083344" stroke="#0891b2" strokeWidth="1" />
                          <text x={beX} y={28.5} fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            Break-Even: 1.8 Yrs
                          </text>
                        </g>
                      );
                    })()}

                    {/* Year Data Markers & Interactive Hover Rings */}
                    {trajectoryPoints.map((tp, idx) => {
                      const x = 75 + (idx / 10) * 705;
                      const crVal = tp.cumulativeSavingsINR / 10000000;
                      const y = 205 - (crVal / 3000) * 160;
                      const isHovered = hoveredYear === tp.year;
                      const showValue = savingsZoom >= 1.25 || tp.year === 1 || tp.year === 3 || tp.year === 5 || tp.year === 10 || isHovered;

                      return (
                        <g 
                          key={idx}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredYear(tp.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          <circle 
                            cx={x} 
                            cy={y} 
                            r={isHovered ? 6 : 4} 
                            fill={isHovered ? '#38bdf8' : '#10b981'} 
                            stroke="#0f172a" 
                            strokeWidth="2" 
                          />
                          {/* Year X Label */}
                          <text x={x} y="226" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                            Y{tp.year}
                          </text>
                          {/* Show value on key years or on all years when zoomed in */}
                          {showValue && (
                            <text 
                              x={x} 
                              y={y - 10} 
                              fill={isHovered ? '#38bdf8' : '#e2e8f0'} 
                              fontSize={savingsZoom >= 1.25 ? "8.5" : "9.5"} 
                              fontWeight="bold" 
                              textAnchor="middle" 
                              fontFamily="monospace"
                            >
                              ₹{tp.cumulativeSavingsCr}Cr
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* Trajectory Milestone Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Year 1 Cumulative:</span>
                <span className="text-emerald-400 font-bold text-sm">₹{trajectoryPoints[1].cumulativeSavingsCr} Crore</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Year 3 Cumulative:</span>
                <span className="text-emerald-400 font-bold text-sm">₹{trajectoryPoints[3].cumulativeSavingsCr} Crore</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Year 5 Cumulative:</span>
                <span className="text-emerald-400 font-bold text-sm">₹{trajectoryPoints[5].cumulativeSavingsCr} Crore</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Year 10 Cumulative:</span>
                <span className="text-cyan-400 font-bold text-sm">₹{trajectoryPoints[10].cumulativeSavingsCr} Crore</span>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* GRAPH 2: BEFORE VS AFTER COMPARATIVE DUAL-BAR CHARTS */}
        {/* ------------------------------------------------------------- */}
        {activeGraphTab === 'comparison_bars' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">
                Side-by-Side Co-Simulation Benchmark: Unmanaged Baseline vs City Nexus
              </span>
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-rose-500/70 inline-block" /> Legacy Baseline
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-cyan-500 inline-block" /> City Nexus (Optimized)
                  </span>
                </div>
                {renderZoomToolbar(barsZoom, setBarsZoom, 'Benchmark Bars')}
              </div>
            </div>

            {barsZoom > 1 && (
              <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-md border border-cyan-800/60 mb-2 flex items-center justify-between">
                <span>↔ Scroll horizontally to inspect all comparative infrastructure metrics at {Math.round(barsZoom * 100)}% resolution</span>
                <button onClick={() => setBarsZoom(1)} className="hover:text-cyan-200 underline">Reset 100%</button>
              </div>
            )}

            <div className="w-full overflow-x-auto pb-1">
              <div style={{ width: `${Math.round(100 * barsZoom)}%`, minWidth: `${Math.round(750 * barsZoom)}px`, transition: 'all 0.2s ease-out' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visualComparisonMetrics.map((item, idx) => {
                    const basePct = (item.baseline / item.maxScale) * 100;
                    const optPct = (item.cityOs / item.maxScale) * 100;
                    const isSaved = item.changePct < 0;

                    return (
                      <div key={idx} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                            {item.icon} {item.label}
                          </span>
                          <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSaved ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}>
                            {item.changePct}%
                          </span>
                        </div>

                        {/* Dual Horizontal Bar Chart */}
                        <div className="space-y-2 pt-1">
                          {/* Baseline Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                              <span>Legacy Baseline</span>
                              <span className="text-rose-400 font-bold">{item.baselineDisplay}</span>
                            </div>
                            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-rose-600 to-rose-500 rounded-full transition-all duration-700" 
                                style={{ width: `${Math.min(100, basePct)}%` }}
                              />
                            </div>
                          </div>

                          {/* City Nexus Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                              <span>City Nexus</span>
                              <span className="text-cyan-300 font-bold">{item.cityOsDisplay}</span>
                            </div>
                            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" 
                                style={{ width: `${Math.min(100, optPct)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* GRAPH 3: MUNICIPAL SAVINGS BUDGET ALLOCATION IN INDIAN RUPEES */}
        {/* ------------------------------------------------------------- */}
        {activeGraphTab === 'budget_breakdown' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">
                Annual Municipal Savings Breakdown by Infrastructure Subsystem: <strong>{formatCrores(scaledAnnualSavingsINR)} / yr</strong>
              </span>
              <div className="flex items-center gap-4">
                <span className="font-mono text-emerald-400">ALL CALCULATIONS IN RUPEES (₹)</span>
                {renderZoomToolbar(budgetZoom, setBudgetZoom, 'Budget Allocation')}
              </div>
            </div>

            {budgetZoom > 1 && (
              <div className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-3 py-1 rounded-md border border-indigo-800/60 mb-2 flex items-center justify-between">
                <span>↔ Scroll horizontally to inspect subsystem budget allocations at {Math.round(budgetZoom * 100)}% resolution</span>
                <button onClick={() => setBudgetZoom(1)} className="hover:text-indigo-200 underline">Reset 100%</button>
              </div>
            )}

            <div className="w-full overflow-x-auto pb-1">
              <div style={{ width: `${Math.round(100 * budgetZoom)}%`, minWidth: `${Math.round(750 * budgetZoom)}px`, transition: 'all 0.2s ease-out' }}>
                <div className="space-y-6">
                  {/* Segmented Stacked Bar Representation */}
                  <div className="space-y-2">
                    <div className="h-6 w-full bg-slate-800 rounded-xl overflow-hidden flex shadow-inner">
                      {savingsBreakdown.map((sb, idx) => (
                        <div
                          key={idx}
                          style={{ width: `${sb.pct}%`, backgroundColor: sb.color }}
                          className="h-full relative group transition-all"
                          title={`${sb.domain}: ${sb.pct}% (${formatCrores(sb.amountINR)})`}
                        />
                      ))}
                    </div>

                    {/* Stacked Bar Legend */}
                    <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      {savingsBreakdown.map((sb, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: sb.color }} />
                          <span>{sb.domain} ({sb.pct}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subsystem Allocation Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {savingsBreakdown.map((sb, idx) => (
                      <div key={idx} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            {sb.icon} {sb.domain}
                          </span>
                          <span className="font-mono text-xs font-bold text-cyan-400">{sb.pct}%</span>
                        </div>

                        <div className="text-xl font-bold font-mono text-white pt-1">
                          {formatCrores(sb.amountINR)}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          ₹{(sb.amountINR / 100000).toFixed(0)} Lakh / year
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: SYSTEMIC PERFORMANCE DELTA TABLE (VERIFIED RESULTS) */}
      {/* ========================================================= */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Simulink Verification Matrix (results_all.csv)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed breakdown of all 9 validated co-simulation indicators with baseline and City Nexus values.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
            ALL 9 RUNS VERIFIED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">Municipal Indicator</th>
                <th className="py-3 px-4 font-semibold">Legacy Baseline</th>
                <th className="py-3 px-4 font-semibold">City Nexus</th>
                <th className="py-3 px-4 font-semibold text-right">Net Improvement</th>
                <th className="py-3 px-4 font-semibold text-right">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {BENCHMARK_COMPARISONS.overall.map((item, idx) => {
                const isPositiveImprovement = item.changePct !== 0;
                const isSaved = item.changePct < 0;

                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-slate-200">
                      {item.metric}
                    </td>
                    <td className="py-3 px-4 text-slate-400 line-through">
                      {item.baseline}
                    </td>
                    <td className="py-3 px-4 text-white font-bold">
                      {item.cityOs}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        isSaved ? 'text-cyan-400' : 'text-emerald-400'
                      }`}>
                        {isSaved ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        {Math.abs(item.changePct)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {item.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
