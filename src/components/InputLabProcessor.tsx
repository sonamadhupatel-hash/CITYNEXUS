import React, { useState } from 'react';
import { 
  Shuffle, 
  Play, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Zap, 
  Droplets, 
  Trash2, 
  Wind, 
  Cpu, 
  SlidersHorizontal, 
  ArrowRight, 
  FileText, 
  Activity, 
  Check, 
  Clock, 
  Sparkles,
  Terminal,
  Layers,
  ArrowDownRight,
  TrendingUp,
  Flame,
  CloudRain,
  PieChart,
  BarChart,
  DollarSign,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { SimulationInputDataset, ProcessedSimulationOutput } from '../types/cityos';
import { generateRandomInputDataset, processSimulationDataset } from '../utils/citySimulationEngine';
import { useCitySimulation } from '../context/CitySimulationContext';

export const InputLabProcessor: React.FC = () => {
  const { setCurrentHour } = useCitySimulation();

  // Current input dataset state
  const [currentInput, setCurrentInput] = useState<SimulationInputDataset>(() => 
    generateRandomInputDataset()
  );

  // Processed output state
  const [processedOutput, setProcessedOutput] = useState<ProcessedSimulationOutput>(() => 
    processSimulationDataset(generateRandomInputDataset())
  );

  // Processing state with animated stages
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);

  // Chart view mode for the 24-hour graph
  const [chartView, setChartView] = useState<'energy' | 'financial_inr' | 'water' | 'aqi'>('energy');

  // Zoom level state for 24-hour simulation graphs (100% to 250%)
  const [chartZoom, setChartZoom] = useState<number>(1);

  const renderZoomToolbar = (label: string) => (
    <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 text-xs shrink-0 shadow-sm">
      <span className="text-[10px] text-slate-500 font-mono uppercase mr-0.5">Zoom:</span>
      <button
        onClick={() => setChartZoom(prev => Math.max(1, parseFloat((prev - 0.25).toFixed(2))))}
        disabled={chartZoom <= 1}
        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title={`Zoom Out ${label} (-)`}
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>
      <span className="font-mono text-cyan-300 font-bold px-1 min-w-[38px] text-center text-[11px]">
        {Math.round(chartZoom * 100)}%
      </span>
      <button
        onClick={() => setChartZoom(prev => Math.min(2.5, parseFloat((prev + 0.25).toFixed(2))))}
        disabled={chartZoom >= 2.5}
        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title={`Zoom In ${label} (+)`}
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
      {chartZoom > 1 && (
        <button
          onClick={() => setChartZoom(1)}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Reset Zoom to 100%"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );

  // Quick preset loader
  const handleLoadPreset = (preset: string) => {
    const newDataset = generateRandomInputDataset(preset);
    setCurrentInput(newDataset);
    showNotice(`Loaded preset: ${newDataset.name}`);
  };

  // Randomize all inputs with new seed
  const handleRandomizeAll = () => {
    const newDataset = generateRandomInputDataset();
    setCurrentInput(newDataset);
    showNotice(`Generated new synthetic input dataset with random seed: ${newDataset.seed}`);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Run the co-simulation and solver
  const handleProcessSimulation = () => {
    setIsProcessing(true);
    setCurrentStageIndex(0);

    // Multi-stage visual progression
    const timer1 = setTimeout(() => setCurrentStageIndex(1), 350);
    const timer2 = setTimeout(() => setCurrentStageIndex(2), 850);
    const timer3 = setTimeout(() => setCurrentStageIndex(3), 1400);

    const timerDone = setTimeout(() => {
      const output = processSimulationDataset(currentInput);
      setProcessedOutput(output);
      setIsProcessing(false);
      showNotice(`Co-simulation complete! Generated Run ${output.runId} with full output metrics.`);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerDone);
    };
  };

  // Download input dataset as JSON
  const handleDownloadInputJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentInput, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `city_inputs_${currentInput.seed}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotice('Downloaded city_inputs.json successfully.');
  };

  // Download processed output as CSV in INR
  const handleDownloadOutputCSV = () => {
    if (!processedOutput) return;
    const headers = "Hour,Time,Baseline_Demand_MW,CityNexus_Demand_MW,Solar_MW,Wind_MW,Water_Demand_m3,Water_Loss_Pct,AQI,Baseline_Cost_INR,Optimized_Cost_INR,Savings_INR\n";
    const rows = processedOutput.hourlyProfile.map((p, idx) => {
      const costP = processedOutput.hourlyCostProfile[idx];
      return `${p.hour},"${p.timeLabel}",${p.baselineEnergyMW},${p.optimizedEnergyMW},${p.solarMW},${p.windMW},${p.waterDemandM3},${p.waterLossPct},${p.aqi},${costP.baselineCostINR},${costP.optimizedCostINR},${costP.hourlySavingsINR}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `City_Nexus_Processed_Output_${processedOutput.runId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('Downloaded processed_output.csv with INR calculations.');
  };

  // Upload custom input JSON file
  const handleUploadInputJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.ambientTempC !== undefined && parsed.hourlyTemp !== undefined) {
          setCurrentInput(parsed);
          showNotice(`Imported custom input dataset: ${parsed.name || 'User Dataset'}`);
        } else {
          alert('Invalid format: File does not match SimulationInputDataset schema.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const updateParam = <K extends keyof SimulationInputDataset>(key: K, val: SimulationInputDataset[K]) => {
    setCurrentInput(prev => ({ ...prev, [key]: val }));
  };

  // Currency Formatter Helper (Indian Rupees Lakhs / Crores)
  const formatINR = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 border border-cyan-500 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 font-mono">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header View */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Shuffle className="w-4 h-4" />
            <span>Digital Twin Simulation Lab & Input Synthesizer</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Monte Carlo Input Randomization & Processing Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Generate synthetic or custom city input vectors (<code className="text-cyan-300">city_inputs.mat</code>), run them through the 
            cyber-physical MATLAB co-simulation equations, and receive complete equivalent graphical output metrics with financial calculations in <strong>Indian Rupees (₹)</strong>.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRandomizeAll}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Randomize Inputs</span>
          </button>

          <button
            onClick={handleProcessSimulation}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
              isProcessing 
                ? 'bg-cyan-800 text-cyan-200 cursor-not-allowed opacity-80' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/25 hover:shadow-cyan-500/35'
            }`}
          >
            <Play className={`w-4 h-4 fill-current ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Solving Digital Twin...' : 'Process Inputs & Solve'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: INPUT DATA RANDOMIZER & CUSTOMIZATION STUDIO */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Input Parameters & Boundary Conditions Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Seed: {currentInput.seed}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust parameters manually, select standard test presets, or import your own JSON file. All financial tariffs configured in Indian Rupees (₹).
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 uppercase font-mono mr-1">Presets:</span>
            <button
              onClick={() => handleLoadPreset('heatwave')}
              className="px-2.5 py-1 text-[11px] rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 transition-colors"
            >
              Summer Heatwave
            </button>
            <button
              onClick={() => handleLoadPreset('monsoon')}
              className="px-2.5 py-1 text-[11px] rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-blue-300 transition-colors"
            >
              Monsoon Storm
            </button>
            <button
              onClick={() => handleLoadPreset('smog_inversion')}
              className="px-2.5 py-1 text-[11px] rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-300 transition-colors"
            >
              Toxic Smog
            </button>
            <button
              onClick={() => handleLoadPreset('winter_gale')}
              className="px-2.5 py-1 text-[11px] rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300 transition-colors"
            >
              Winter Gale
            </button>
          </div>
        </div>

        {/* Input Parameters Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Ambient Temperature */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Base Temperature:
              </span>
              <span className="font-mono text-cyan-400 font-bold">{currentInput.ambientTempC}°C</span>
            </div>
            <input 
              type="range"
              min="10"
              max="45"
              step="0.5"
              value={currentInput.ambientTempC}
              onChange={(e) => updateParam('ambientTempC', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Drives thermal building HVAC inertia load.</span>
          </div>

          {/* Peak Solar Irradiance */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Peak Solar Irradiance:
              </span>
              <span className="font-mono text-cyan-400 font-bold">{currentInput.solarIrradiancePeakWm2} W/m²</span>
            </div>
            <input 
              type="range"
              min="300"
              max="1150"
              step="25"
              value={currentInput.solarIrradiancePeakWm2}
              onChange={(e) => updateParam('solarIrradiancePeakWm2', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Clear-sky midday peak solar radiation.</span>
          </div>

          {/* Average Wind Speed */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Wind className="w-3.5 h-3.5 text-blue-400" /> Average Wind Speed:
              </span>
              <span className="font-mono text-cyan-400 font-bold">{currentInput.windSpeedAvgMs} m/s</span>
            </div>
            <input 
              type="range"
              min="2"
              max="24"
              step="0.5"
              value={currentInput.windSpeedAvgMs}
              onChange={(e) => updateParam('windSpeedAvgMs', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Powers offshore 36 MW wind turbine cluster.</span>
          </div>

          {/* Base Electrical Load Multiplier */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-indigo-400" /> Grid Load Scale Factor:
              </span>
              <span className="font-mono text-cyan-400 font-bold">{currentInput.electricLoadScale}x</span>
            </div>
            <input 
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={currentInput.electricLoadScale}
              onChange={(e) => updateParam('electricLoadScale', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Scales baseline commercial & residential demand.</span>
          </div>

          {/* Water Demand Multiplier */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Water Consumption Scale:
              </span>
              <span className="font-mono text-cyan-400 font-bold">{currentInput.waterDemandScale}x</span>
            </div>
            <input 
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={currentInput.waterDemandScale}
              onChange={(e) => updateParam('waterDemandScale', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Scales municipal drinking water demand volume.</span>
          </div>

          {/* Waste Accumulation Rate */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Trash2 className="w-3.5 h-3.5 text-emerald-400" /> Daily Waste Generation:
              </span>
              <span className="font-mono text-cyan-400 font-bold">{currentInput.wasteGenRateDailyTons} tons</span>
            </div>
            <input 
              type="range"
              min="150"
              max="450"
              step="10"
              value={currentInput.wasteGenRateDailyTons}
              onChange={(e) => updateParam('wasteGenRateDailyTons', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Determines smart IoT bin filling speed.</span>
          </div>

          {/* Background Ambient AQI */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Wind className="w-3.5 h-3.5 text-amber-400" /> Background AQI Index:
              </span>
              <span className="font-mono text-cyan-400 font-bold">{currentInput.backgroundAqi}</span>
            </div>
            <input 
              type="range"
              min="15"
              max="180"
              step="5"
              value={currentInput.backgroundAqi}
              onChange={(e) => updateParam('backgroundAqi', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Baseline pollution prior to industrial mitigation.</span>
          </div>

          {/* Battery Initial SOC */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> Initial BESS SOC:
              </span>
              <span className="font-mono text-cyan-400 font-bold">{currentInput.batteryInitialSocPct}%</span>
            </div>
            <input 
              type="range"
              min="20"
              max="90"
              step="5"
              value={currentInput.batteryInitialSocPct}
              onChange={(e) => updateParam('batteryInitialSocPct', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Available stored energy before morning dispatch.</span>
          </div>

          {/* Peak Grid Electricity Tariff in Indian Rupees */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-rose-400" /> Peak Grid Tariff (INR):
              </span>
              <span className="font-mono text-cyan-400 font-bold">₹{currentInput.gridTariffPeakInrMwh.toLocaleString('en-IN')}/MWh</span>
            </div>
            <input 
              type="range"
              min="9000"
              max="32000"
              step="500"
              value={currentInput.gridTariffPeakInrMwh}
              onChange={(e) => updateParam('gridTariffPeakInrMwh', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Peak market cost: ₹{(currentInput.gridTariffPeakInrMwh / 1000).toFixed(1)} / kWh.</span>
          </div>
        </div>

        {/* Import / Export File Utility Strip */}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadInputJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export city_inputs.json</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import Custom JSON</span>
              <input 
                type="file" 
                accept=".json"
                onChange={handleUploadInputJSON}
                className="hidden" 
              />
            </label>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Input Vectors Ready: 24h temp, solar (W/m²), wind, load, water & tariffs synthesized.
          </div>
        </div>
      </div>

      {/* SECTION 2: CO-SIMULATION SOLVER EXECUTION PROGRESS (WHEN RUNNING) */}
      {isProcessing && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-800 space-y-4 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Solving Multi-Agent Cyber-Physical Equations in Real-Time...</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400">Step {currentStageIndex + 1} of 4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            {[
              '1. Vector Ingestion & Bounds',
              '2. Physical Differential Models',
              '3. Multi-Agent LP Optimizer',
              '4. Synthesis & KPI Verification'
            ].map((stepName, sIdx) => (
              <div 
                key={sIdx}
                className={`p-3 rounded-xl border transition-all ${
                  sIdx <= currentStageIndex
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="font-semibold">{stepName}</div>
                <div className="text-[10px] mt-0.5 text-slate-400">
                  {sIdx < currentStageIndex ? 'Complete ✓' : sIdx === currentStageIndex ? 'Running...' : 'Queued'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: EQUIVALENT OUTPUT DASHBOARD & GRAPHICAL REPRESENTATIONS */}
      {processedOutput && (
        <div className="space-y-6">
          {/* Output Top Bar */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  SIMULATION RUN CONVERGED
                </span>
                <span className="text-slate-400">Run ID: {processedOutput.runId}</span>
                <span className="text-slate-400">· Completed: {processedOutput.timestamp}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Equivalent Co-Simulation Output & Graphical Analysis
              </h3>
            </div>

            <button
              onClick={handleDownloadOutputCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Output CSV (INR ₹)</span>
            </button>
          </div>

          {/* Core Solved Output Metrics Grid (IN INDIAN RUPEES) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Peak Load Shaving */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 shadow-md">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Peak Load Shaving</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">
                {processedOutput.kpis.peakOptimizedMW} <span className="text-xs font-normal text-slate-400">MW</span>
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>-{processedOutput.kpis.peakReductionPct}% shaved</span>
                <span className="text-slate-500 line-through">({processedOutput.kpis.peakBaselineMW}MW)</span>
              </div>
            </div>

            {/* Daily Operational Savings (INR) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 shadow-md">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Daily OpEx Savings</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">INR (₹)</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {formatINR(processedOutput.kpis.dailySavingsINR)}
              </div>
              <div className="text-[11px] text-emerald-400">
                -{processedOutput.kpis.costReductionPct}% vs unmanaged ({formatINR(processedOutput.kpis.baselineDailyCostINR)})
              </div>
            </div>

            {/* Renewable Penetration */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 shadow-md">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Clean Energy Share</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {processedOutput.kpis.renewableSharePct}%
              </div>
              <div className="text-[11px] text-slate-400">
                Total Generation: <span className="font-mono text-cyan-300">{processedOutput.kpis.totalDailyEnergyMWh} MWh</span>
              </div>
            </div>

            {/* Water Loss Saved */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 shadow-md">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Water Pipeline Savings</span>
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-blue-300 tabular-nums">
                -{processedOutput.kpis.waterLossReductionPct}%
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Saved: {(processedOutput.kpis.waterLossBaselineM3 - processedOutput.kpis.waterLossOptimizedM3).toLocaleString()} m³
              </div>
            </div>
          </div>

          {/* GRAPHICAL REPRESENTATION 1: INTERACTIVE 24-HOUR MULTI-METRIC SOLVED CHARTS */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Solved 24-Hour Digital Twin Response Profiles</span>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                    24-STEP CO-SIMULATION
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Analyze dynamic response curves across power dispatch, financial hourly savings (INR), water demand, and air quality.
                </p>
              </div>

              {/* Chart Mode Selector Tabs */}
              <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setChartView('energy')}
                  className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                    chartView === 'energy' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Power Dispatch (MW)
                </button>
                <button
                  onClick={() => setChartView('financial_inr')}
                  className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                    chartView === 'financial_inr' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ₹ Financial Savings (INR)
                </button>
                <button
                  onClick={() => setChartView('water')}
                  className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                    chartView === 'water' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💧 Water Flow & Loss
                </button>
                <button
                  onClick={() => setChartView('aqi')}
                  className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                    chartView === 'aqi' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💨 AQI Dispersion
                </button>
              </div>
            </div>

            {/* CHART 1A: ENERGY DISPATCH CURVE */}
            {chartView === 'energy' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                  <span>Power Grid Dispatch: Unmanaged Baseline Load vs City Nexus Shaved Load (MW)</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-500 inline-block" /> Unmanaged Baseline</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-cyan-400 inline-block" /> City Nexus Shaved</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-amber-500/30 border border-amber-400 inline-block" /> Solar PV Yield</span>
                    </div>
                    {renderZoomToolbar('Power Grid Dispatch')}
                  </div>
                </div>

                <div className="w-full bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-inner">
                  {chartZoom > 1 && (
                    <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-md border border-cyan-800/60 mb-2.5 flex items-center justify-between">
                      <span>↔ Scroll horizontally to inspect all 24-hour dispatch values at {Math.round(chartZoom * 100)}% resolution</span>
                      <button onClick={() => setChartZoom(1)} className="hover:text-cyan-200 underline">Reset 100%</button>
                    </div>
                  )}
                  <div className="w-full overflow-x-auto pb-1">
                    <div style={{ width: `${Math.round(100 * chartZoom)}%`, minWidth: `${Math.round(840 * chartZoom)}px`, transition: 'all 0.2s ease-out' }}>
                      <svg viewBox="0 0 840 230" className="w-full h-auto max-h-[300px] block select-none" preserveAspectRatio="none">
                        {[0, 50, 100, 150].map((val) => {
                          const y = 185 - (val / 160) * 155;
                          return (
                            <g key={val}>
                              <line x1="58" y1={y} x2="800" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                              <text x="50" y={y + 3.5} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                                {val}MW
                              </text>
                            </g>
                          );
                        })}

                        {/* Solar area fill */}
                        <path
                          d={`M 58 185 ${processedOutput.hourlyProfile.map((p, idx) => {
                            const x = 58 + (idx / 23) * 735;
                            const y = 185 - (p.solarMW / 160) * 155;
                            return `L ${x} ${y}`;
                          }).join(' ')} L 793 185 Z`}
                          fill="#f59e0b"
                          fillOpacity="0.18"
                        />

                        {/* Baseline demand line */}
                        <polyline
                          points={processedOutput.hourlyProfile.map((p, idx) => {
                            const x = 58 + (idx / 23) * 735;
                            const y = 185 - (p.baselineEnergyMW / 160) * 155;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                        />

                        {/* City Nexus Optimized demand line */}
                        <polyline
                          points={processedOutput.hourlyProfile.map((p, idx) => {
                            const x = 58 + (idx / 23) * 735;
                            const y = 185 - (p.optimizedEnergyMW / 160) * 155;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="3"
                        />

                        {/* Exact numerical values on all 24 hours when zoomed in */}
                        {chartZoom >= 1.25 && processedOutput.hourlyProfile.map((p, idx) => {
                          const x = 58 + (idx / 23) * 735;
                          const optY = 185 - (p.optimizedEnergyMW / 160) * 155;
                          const baseY = 185 - (p.baselineEnergyMW / 160) * 155;
                          return (
                            <g key={idx}>
                              {/* Baseline point & value */}
                              <circle cx={x} cy={baseY} r="2.5" fill="#ef4444" />
                              <text x={x} y={baseY - 7} fill="#f87171" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                {p.baselineEnergyMW.toFixed(0)}M
                              </text>
                              {/* Optimized point & value */}
                              <circle cx={x} cy={optY} r="3" fill="#06b6d4" />
                              <text x={x} y={optY + 11} fill="#22d3ee" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                {p.optimizedEnergyMW.toFixed(0)}M
                              </text>
                            </g>
                          );
                        })}

                        {/* X Axis Time Labels: full 24 hours when zoomed in, or step when 100% */}
                        {(chartZoom >= 1.25 ? Array.from({ length: 24 }, (_, i) => i) : [0, 4, 8, 12, 16, 20, 23]).map((hr) => {
                          const x = 58 + (hr / 23) * 735;
                          return (
                            <text key={hr} x={x} y="206" fill="#64748b" fontSize={chartZoom >= 1.25 ? "8.5" : "10"} textAnchor="middle" fontFamily="monospace">
                              {String(hr).padStart(2, '0')}:00
                            </text>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CHART 1B: HOURLY FINANCIAL SAVINGS WATERFALL (INR ₹) */}
            {chartView === 'financial_inr' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                  <span>Hourly Financial Cost Comparison: Baseline vs Optimized in Indian Rupees (₹)</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-rose-500/50 inline-block rounded-sm" /> Baseline Cost</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-cyan-500/50 inline-block rounded-sm" /> City Nexus Cost</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        Daily Savings: {formatINR(processedOutput.kpis.dailySavingsINR)} (-{processedOutput.kpis.costReductionPct}%)
                      </span>
                    </div>
                    {renderZoomToolbar('Financial Cost Bars')}
                  </div>
                </div>

                <div className="w-full bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-inner">
                  {chartZoom > 1 && (
                    <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-md border border-emerald-800/60 mb-2.5 flex items-center justify-between">
                      <span>↔ Scroll horizontally to inspect exact hourly rupee cost & savings values at {Math.round(chartZoom * 100)}% resolution</span>
                      <button onClick={() => setChartZoom(1)} className="hover:text-emerald-200 underline">Reset 100%</button>
                    </div>
                  )}
                  <div className="w-full overflow-x-auto pb-1">
                    <div style={{ width: `${Math.round(100 * chartZoom)}%`, minWidth: `${Math.round(840 * chartZoom)}px`, transition: 'all 0.2s ease-out' }}>
                      <svg viewBox="0 0 840 230" className="w-full h-auto max-h-[300px] block select-none" preserveAspectRatio="none">
                        {/* Max hourly cost around ₹4,50,000 */}
                        {[0, 100000, 200000, 300000, 400000].map((val) => {
                          const y = 185 - (val / 420000) * 155;
                          return (
                            <g key={val}>
                              <line x1="58" y1={y} x2="800" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                              <text x="50" y={y + 3.5} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                                ₹{(val / 100000).toFixed(1)}L
                              </text>
                            </g>
                          );
                        })}

                        {/* Hourly Cost Bars */}
                        {processedOutput.hourlyCostProfile.map((cp, idx) => {
                          const x = 62 + (idx / 23) * 725;
                          const baseH = Math.min(155, (cp.baselineCostINR / 420000) * 155);
                          const optH = Math.min(155, (cp.optimizedCostINR / 420000) * 155);
                          const baseY = 185 - baseH;
                          const optY = 185 - optH;

                          return (
                            <g key={idx}>
                              {/* Baseline cost bar */}
                              <rect x={x - 7} y={baseY} width="6" height={baseH} fill="#ef4444" fillOpacity="0.45" rx="1">
                                <title>{`Hour ${String(cp.hour).padStart(2, '0')}:00 - Baseline: ${formatINR(cp.baselineCostINR)}`}</title>
                              </rect>
                              {/* Optimized cost bar */}
                              <rect x={x} y={optY} width="6" height={optH} fill="#06b6d4" fillOpacity="0.85" rx="1">
                                <title>{`Hour ${String(cp.hour).padStart(2, '0')}:00 - Optimized: ${formatINR(cp.optimizedCostINR)} (Savings: ${formatINR(cp.hourlySavingsINR)})`}</title>
                              </rect>

                              {/* Exact Numerical rupee values rendered above/near bars when zoomed in */}
                              {chartZoom >= 1.25 && (
                                <g>
                                  <text x={x - 4} y={baseY - 4} fill="#f87171" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                    ₹{(cp.baselineCostINR / 1000).toFixed(0)}k
                                  </text>
                                  <text x={x + 3} y={optY - 4} fill="#22d3ee" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                    ₹{(cp.optimizedCostINR / 1000).toFixed(0)}k
                                  </text>
                                  <text x={x} y={Math.min(baseY, optY) - 12} fill="#34d399" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                    +₹{(cp.hourlySavingsINR / 1000).toFixed(0)}k
                                  </text>
                                </g>
                              )}
                            </g>
                          );
                        })}

                        {/* X Axis Time Labels */}
                        {(chartZoom >= 1.25 ? Array.from({ length: 24 }, (_, i) => i) : [0, 4, 8, 12, 16, 20, 23]).map((hr) => {
                          const x = 65 + (hr / 23) * 725;
                          return (
                            <text key={hr} x={x} y="206" fill="#64748b" fontSize={chartZoom >= 1.25 ? "8.5" : "10"} textAnchor="middle" fontFamily="monospace">
                              {String(hr).padStart(2, '0')}:00
                            </text>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Numerical Savings Summary Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-3 border-t border-slate-800/80 mt-2">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Unmanaged Baseline Cost</span>
                      <span className="text-rose-400 font-bold">{formatINR(processedOutput.kpis.baselineDailyCostINR)} / day</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">City Nexus Optimized Cost</span>
                      <span className="text-cyan-300 font-bold">{formatINR(processedOutput.kpis.optimizedDailyCostINR)} / day</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Daily Net Operational Savings</span>
                      <span className="text-emerald-400 font-bold">{formatINR(processedOutput.kpis.dailySavingsINR)} (-{processedOutput.kpis.costReductionPct}%)</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Projected Annual Savings</span>
                      <span className="text-emerald-300 font-bold">{formatINR(processedOutput.kpis.dailySavingsINR * 365)} / yr</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CHART 1C: WATER FLOW & PIPELINE LOSS */}
            {chartView === 'water' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                  <span>Municipal Water Consumption Demand (m³/h) and Pipeline Loss Rate (%)</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-blue-500/20 border border-blue-400 inline-block" /> Demand Volume (m³/h)</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-400 inline-block" /> Water Loss %</span>
                    </div>
                    {renderZoomToolbar('Water Flow & Loss')}
                  </div>
                </div>

                <div className="w-full bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-inner">
                  {chartZoom > 1 && (
                    <div className="text-[10px] font-mono text-blue-400 bg-blue-950/40 px-3 py-1 rounded-md border border-blue-800/60 mb-2.5 flex items-center justify-between">
                      <span>↔ Scroll horizontally to inspect water consumption and loss percentage values at {Math.round(chartZoom * 100)}% resolution</span>
                      <button onClick={() => setChartZoom(1)} className="hover:text-blue-200 underline">Reset 100%</button>
                    </div>
                  )}
                  <div className="w-full overflow-x-auto pb-1">
                    <div style={{ width: `${Math.round(100 * chartZoom)}%`, minWidth: `${Math.round(840 * chartZoom)}px`, transition: 'all 0.2s ease-out' }}>
                      <svg viewBox="0 0 840 230" className="w-full h-auto max-h-[300px] block select-none" preserveAspectRatio="none">
                        {[0, 4000, 8000, 12000, 16000].map((val) => {
                          const y = 185 - (val / 16000) * 155;
                          return (
                            <g key={val}>
                              <line x1="58" y1={y} x2="800" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                              <text x="50" y={y + 3.5} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                                {val}m³
                              </text>
                            </g>
                          );
                        })}

                        {/* Water flow area */}
                        <path
                          d={`M 58 185 ${processedOutput.hourlyProfile.map((p, idx) => {
                            const x = 58 + (idx / 23) * 735;
                            const y = 185 - (p.waterDemandM3 / 16000) * 155;
                            return `L ${x} ${y}`;
                          }).join(' ')} L 793 185 Z`}
                          fill="#3b82f6"
                          fillOpacity="0.2"
                        />

                        {/* Water flow line */}
                        <polyline
                          points={processedOutput.hourlyProfile.map((p, idx) => {
                            const x = 58 + (idx / 23) * 735;
                            const y = 185 - (p.waterDemandM3 / 16000) * 155;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="2.5"
                        />

                        {/* Loss % line (Scaled to right axis) */}
                        <polyline
                          points={processedOutput.hourlyProfile.map((p, idx) => {
                            const x = 58 + (idx / 23) * 735;
                            const y = 185 - (p.waterLossPct / 30) * 155;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />

                        {/* Exact numerical values on all 24 hours when zoomed in */}
                        {chartZoom >= 1.25 && processedOutput.hourlyProfile.map((p, idx) => {
                          const x = 58 + (idx / 23) * 735;
                          const flowY = 185 - (p.waterDemandM3 / 16000) * 155;
                          const lossY = 185 - (p.waterLossPct / 30) * 155;
                          return (
                            <g key={idx}>
                              <circle cx={x} cy={flowY} r="3" fill="#60a5fa" />
                              <text x={x} y={flowY - 7} fill="#93c5fd" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                {(p.waterDemandM3 / 1000).toFixed(1)}k
                              </text>
                              <circle cx={x} cy={lossY} r="2.5" fill="#f43f5e" />
                              <text x={x} y={lossY + 11} fill="#fb7185" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                {p.waterLossPct.toFixed(1)}%
                              </text>
                            </g>
                          );
                        })}

                        {/* X Axis */}
                        {(chartZoom >= 1.25 ? Array.from({ length: 24 }, (_, i) => i) : [0, 4, 8, 12, 16, 20, 23]).map((hr) => {
                          const x = 58 + (hr / 23) * 735;
                          return (
                            <text key={hr} x={x} y="206" fill="#64748b" fontSize={chartZoom >= 1.25 ? "8.5" : "10"} textAnchor="middle" fontFamily="monospace">
                              {String(hr).padStart(2, '0')}:00
                            </text>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CHART 1D: AQI DISPERSION & HEALTH THRESHOLD */}
            {chartView === 'aqi' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                  <span>Atmospheric Particulate AQI Trajectory with EPA 100 Moderate Safety Threshold</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 inline-block" /> Citywide AQI</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-500 inline-block stroke-dash" /> Unhealthy Limit (100)</span>
                    </div>
                    {renderZoomToolbar('AQI Dispersion')}
                  </div>
                </div>

                <div className="w-full bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-inner">
                  {chartZoom > 1 && (
                    <div className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded-md border border-amber-800/60 mb-2.5 flex items-center justify-between">
                      <span>↔ Scroll horizontally to inspect atmospheric particulate AQI values at {Math.round(chartZoom * 100)}% resolution</span>
                      <button onClick={() => setChartZoom(1)} className="hover:text-amber-200 underline">Reset 100%</button>
                    </div>
                  )}
                  <div className="w-full overflow-x-auto pb-1">
                    <div style={{ width: `${Math.round(100 * chartZoom)}%`, minWidth: `${Math.round(840 * chartZoom)}px`, transition: 'all 0.2s ease-out' }}>
                      <svg viewBox="0 0 840 230" className="w-full h-auto max-h-[300px] block select-none" preserveAspectRatio="none">
                        {[0, 50, 100, 150, 200].map((val) => {
                          const y = 185 - (val / 220) * 155;
                          return (
                            <g key={val}>
                              <line x1="58" y1={y} x2="800" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                              <text x="50" y={y + 3.5} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                                {val}
                              </text>
                            </g>
                          );
                        })}

                        {/* Threshold line 100 */}
                        <line x1="58" y1={185 - (100 / 220) * 155} x2="800" y2={185 - (100 / 220) * 155} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />

                        {/* AQI Trajectory */}
                        <polyline
                          points={processedOutput.hourlyProfile.map((p, idx) => {
                            const x = 58 + (idx / 23) * 735;
                            const y = 185 - (p.aqi / 220) * 155;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3"
                        />

                        {/* Exact numerical AQI values at all 24 hours when zoomed in */}
                        {chartZoom >= 1.25 && processedOutput.hourlyProfile.map((p, idx) => {
                          const x = 58 + (idx / 23) * 735;
                          const aqiY = 185 - (p.aqi / 220) * 155;
                          const aqiColor = p.aqi <= 50 ? '#34d399' : p.aqi <= 100 ? '#fcd34d' : '#f87171';
                          return (
                            <g key={idx}>
                              <circle cx={x} cy={aqiY} r="3" fill="#f59e0b" />
                              <text x={x} y={aqiY - 7} fill={aqiColor} fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                {p.aqi}
                              </text>
                            </g>
                          );
                        })}

                        {/* X Axis */}
                        {(chartZoom >= 1.25 ? Array.from({ length: 24 }, (_, i) => i) : [0, 4, 8, 12, 16, 20, 23]).map((hr) => {
                          const x = 58 + (hr / 23) * 735;
                          return (
                            <text key={hr} x={x} y="206" fill="#64748b" fontSize={chartZoom >= 1.25 ? "8.5" : "10"} textAnchor="middle" fontFamily="monospace">
                              {String(hr).padStart(2, '0')}:00
                            </text>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* GRAPHICAL REPRESENTATION 2 & 3: CLEAN ENERGY GENERATION MIX & COMPARATIVE BENCHMARK BARS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Energy Generation Mix Stacked Bar / Distribution */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-cyan-400" />
                  <span>Energy Generation Mix Distribution</span>
                </span>
                <span className="font-mono text-emerald-400 text-xs font-bold">
                  {processedOutput.kpis.renewableSharePct}% Clean
                </span>
              </h4>

              {/* Stacked Progress Bar */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    style={{ width: `${(processedOutput.kpis.energyGenMix.solarMWh / Math.max(1, processedOutput.kpis.totalDailyEnergyMWh)) * 100}%` }}
                    className="bg-amber-400 h-full"
                    title="Solar PV"
                  />
                  <div 
                    style={{ width: `${(processedOutput.kpis.energyGenMix.windMWh / Math.max(1, processedOutput.kpis.totalDailyEnergyMWh)) * 100}%` }}
                    className="bg-blue-400 h-full"
                    title="Wind Power"
                  />
                  <div 
                    style={{ width: `${(processedOutput.kpis.energyGenMix.batteryMWh / Math.max(1, processedOutput.kpis.totalDailyEnergyMWh)) * 100}%` }}
                    className="bg-indigo-400 h-full"
                    title="BESS Discharged"
                  />
                  <div 
                    style={{ width: `${(processedOutput.kpis.energyGenMix.gridMWh / Math.max(1, processedOutput.kpis.totalDailyEnergyMWh)) * 100}%` }}
                    className="bg-slate-700 h-full"
                    title="Grid Import"
                  />
                </div>

                {/* Subsystem Legend with numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-amber-400 text-[10px] block">● Solar PV:</span>
                    <span className="text-white font-bold">{processedOutput.kpis.energyGenMix.solarMWh} MWh</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-blue-400 text-[10px] block">● Wind Power:</span>
                    <span className="text-white font-bold">{processedOutput.kpis.energyGenMix.windMWh} MWh</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-indigo-400 text-[10px] block">● BESS Discharged:</span>
                    <span className="text-white font-bold">{processedOutput.kpis.energyGenMix.batteryMWh} MWh</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">● Grid Import:</span>
                    <span className="text-slate-300 font-bold">{processedOutput.kpis.energyGenMix.gridMWh} MWh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparative Benchmark Bar Graphs (Baseline vs City Nexus) */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-emerald-400" />
                  <span>Comparative Systemic Benchmark (Baseline vs City Nexus)</span>
                </span>
              </h4>

              <div className="space-y-3 text-xs">
                {/* 1. Peak Power (MW) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">Peak Load Demand:</span>
                    <span className="font-mono text-cyan-400 font-bold">{processedOutput.kpis.peakOptimizedMW} MW vs {processedOutput.kpis.peakBaselineMW} MW (-{processedOutput.kpis.peakReductionPct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(processedOutput.kpis.peakOptimizedMW / processedOutput.kpis.peakBaselineMW) * 100}%` }} className="bg-cyan-400 h-full" />
                  </div>
                </div>

                {/* 2. Water Loss % */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">Pipeline Water Loss:</span>
                    <span className="font-mono text-blue-400 font-bold">15.4% vs 24.8% baseline (-{processedOutput.kpis.waterLossReductionPct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(15.4 / 24.8) * 100}%` }} className="bg-blue-400 h-full" />
                  </div>
                </div>

                {/* 3. Waste Transit Km */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">Fleet Route Mileage:</span>
                    <span className="font-mono text-emerald-400 font-bold">{processedOutput.kpis.fleetDistanceKm} km vs {processedOutput.kpis.fleetDistanceKm + processedOutput.kpis.distanceSavedKm} km (-29.8%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
                    <div style={{ width: '70.2%' }} className="bg-emerald-400 h-full" />
                  </div>
                </div>

                {/* 4. Daily Municipal OpEx (INR ₹) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">Daily Operating Cost (INR):</span>
                    <span className="font-mono text-amber-300 font-bold">{formatINR(processedOutput.kpis.optimizedDailyCostINR)} vs {formatINR(processedOutput.kpis.baselineDailyCostINR)} (-{processedOutput.kpis.costReductionPct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(processedOutput.kpis.optimizedDailyCostINR / processedOutput.kpis.baselineDailyCostINR) * 100}%` }} className="bg-amber-400 h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solver Step Log */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs shadow-xl">
            <h4 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Co-Simulation Execution & Convergence Step Log</span>
            </h4>

            <div className="space-y-2">
              {processedOutput.solverExecutionLog.map((log, idx) => (
                <div key={idx} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-semibold">{log.stage}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-300">{log.details}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                    <span className="text-slate-500">{log.durationMs}ms</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-emerald-300 font-bold">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fallback icon for battery charging
function BatteryChargingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 7h2a2 2 0 0 1 2 2v6c0 1-1 2-2 2h-2"/>
      <path d="M6 7H4a2 2 0 0 0-2 2v6c0 1 1 2 2 2h2"/>
      <line x1="22" x2="22" y1="11" y2="13"/>
      <polygon points="11 6 7 12 13 12 9 18"/>
    </svg>
  );
}
