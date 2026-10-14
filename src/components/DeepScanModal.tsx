import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  Download, 
  X, 
  RefreshCw, 
  Zap, 
  Droplets, 
  Trash2, 
  Wind, 
  Cpu, 
  Radio, 
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { District, DeepScanReport } from '../types/cityos';
import { useCitySimulation } from '../context/CitySimulationContext';
import { formatINR } from '../utils/formatters';

interface DeepScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: District;
  onOpenTuneDistrict?: (districtId: string) => void;
}

const AUDIT_STAGES = [
  {
    title: 'DMA Acoustic Hydrophone Cross-Correlation',
    subsystem: 'water',
    description: 'Scanning 24 piezoelectric transducers for high-frequency micro-leak acoustic acoustic spikes & pressure transients.',
    sensorCount: 480
  },
  {
    title: '13.8kV Feeder Harmonics & Thermal Imaging',
    subsystem: 'energy',
    description: 'Inspecting Total Harmonic Distortion (THD), phase balance, and transformer thermal hotspot margins.',
    sensorCount: 820
  },
  {
    title: 'Smart Waste Ultrasound RTU Mesh & Fleet GPS',
    subsystem: 'waste',
    description: 'Polling LoRaWAN bin transceivers for compacted volume calibration and EV routing telemetry.',
    sensorCount: 640
  },
  {
    title: 'Laser Spectrometer & Mist-Cannon Head Check',
    subsystem: 'environment',
    description: 'Calibrating dual-wavelength optical particle counters (PM2.5 / PM10) and high-pressure atomization pumps.',
    sensorCount: 470
  }
];

export const DeepScanModal: React.FC<DeepScanModalProps> = ({
  isOpen,
  onClose,
  district,
  onOpenTuneDistrict
}) => {
  const { latestScanReports, saveScanReport, tuneDistrict } = useCitySimulation();

  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanReport, setScanReport] = useState<DeepScanReport | null>(null);

  // Load existing report or initialize when opening modal
  useEffect(() => {
    if (!isOpen) return;

    const existing = latestScanReports[district.id];
    if (existing) {
      setScanReport(existing);
      setScanState('complete');
      setProgress(100);
      setActiveStageIdx(3);
    } else {
      startDiagnosticScan();
    }
  }, [isOpen, district.id]);

  const startDiagnosticScan = () => {
    setScanState('scanning');
    setProgress(0);
    setActiveStageIdx(0);
    setScanLogs([`[0.00s] Initializing SCADA deep diagnostic scan for ${district.name}...`]);

    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += 12;

      if (currentProg <= 25) {
        setActiveStageIdx(0);
        setScanLogs(prev => [
          `[${(currentProg * 0.04).toFixed(2)}s] DMA hydrophone cross-correlation verified across 480 nodes. Leak risk: ${district.metrics.leakRiskScore}/100.`,
          ...prev.slice(0, 7)
        ]);
      } else if (currentProg <= 50) {
        setActiveStageIdx(1);
        setScanLogs(prev => [
          `[${(currentProg * 0.04).toFixed(2)}s] Substation 13.8kV busbar thermal signature: 41.2°C (nominal). THD: 1.8%.`,
          ...prev.slice(0, 7)
        ]);
      } else if (currentProg <= 75) {
        setActiveStageIdx(2);
        setScanLogs(prev => [
          `[${(currentProg * 0.04).toFixed(2)}s] LoRaWAN bin transceivers synchronized. Average fill: ${district.metrics.wasteBinFillPct}%.`,
          ...prev.slice(0, 7)
        ]);
      } else if (currentProg < 100) {
        setActiveStageIdx(3);
        setScanLogs(prev => [
          `[${(currentProg * 0.04).toFixed(2)}s] Laser spectrometers online. District AQI: ${district.metrics.aqi} (${district.metrics.pm25} µg/m³).`,
          ...prev.slice(0, 7)
        ]);
      } else {
        clearInterval(interval);
        setProgress(100);
        setScanState('complete');

        // Formulate comprehensive scan report
        const healthScore = Math.max(88, Math.round(99.5 - (district.metrics.leakRiskScore * 0.12) - (district.metrics.aqi * 0.05)));
        const grade: DeepScanReport['integrityGrade'] = 
          healthScore >= 95 ? 'A+' : healthScore >= 90 ? 'A' : healthScore >= 85 ? 'B+' : 'B';

        const newReport: DeepScanReport = {
          districtId: district.id,
          districtName: district.name,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          overallHealthScore: healthScore,
          integrityGrade: grade,
          sensorsAudited: 2410,
          subsystemAudits: [
            {
              name: 'Water DMA Infrastructure',
              status: district.metrics.leakRiskScore > 40 ? 'Advisory' : 'Optimal',
              score: Math.max(82, 100 - district.metrics.leakRiskScore),
              details: `Dynamic PRV stabilized at ${district.metrics.waterPressureBar} bar. Acoustic noise floor: -62dB. Micro-leak probability: ${(district.metrics.leakRiskScore * 0.15).toFixed(1)}%.`,
              anomaliesFound: district.metrics.leakRiskScore > 40 ? 1 : 0,
              metrics: [
                { label: 'Line Pressure', value: `${district.metrics.waterPressureBar} bar` },
                { label: 'Acoustic Risk', value: `${district.metrics.leakRiskScore}/100` },
                { label: 'Cavitation Margin', value: '98.2%' },
              ]
            },
            {
              name: 'Power Grid & Feeder SCADA',
              status: 'Optimal',
              score: 99,
              details: `Active power draw: ${district.metrics.powerDemandMW} MW. Solar PV injection: ${district.metrics.solarCapMW} MW. Transformer oil headroom: +22°C.`,
              anomaliesFound: 0,
              metrics: [
                { label: 'Active Demand', value: `${district.metrics.powerDemandMW} MW` },
                { label: 'Grid THD', value: '1.8%' },
                { label: 'Power Factor', value: '0.99' },
              ]
            },
            {
              name: 'Smart Waste IoT Network',
              status: district.metrics.wasteBinFillPct > 80 ? 'Advisory' : 'Nominal',
              score: Math.max(85, 100 - (district.metrics.wasteBinFillPct > 75 ? 12 : 0)),
              details: `Bin transceivers reporting 100% heartbeat. Average fill: ${district.metrics.wasteBinFillPct}%. TSP route completion: nominal.`,
              anomaliesFound: district.metrics.wasteBinFillPct > 80 ? 2 : 0,
              metrics: [
                { label: 'Avg Bin Fill', value: `${district.metrics.wasteBinFillPct}%` },
                { label: 'RTU Battery', value: '3.62 V' },
                { label: 'Mesh Latency', value: '28 ms' },
              ]
            },
            {
              name: 'Atmospheric Micro-Sensors',
              status: district.metrics.aqi > 100 ? 'Advisory' : 'Optimal',
              score: Math.max(80, Math.round(100 - (district.metrics.aqi * 0.2))),
              details: `Dual-channel OPC calibration valid. Ambient AQI: ${district.metrics.aqi}. PM2.5: ${district.metrics.pm25} µg/m³. Mist nozzles: 100% unobstructed.`,
              anomaliesFound: district.metrics.aqi > 100 ? 1 : 0,
              metrics: [
                { label: 'AQI Index', value: `${district.metrics.aqi}` },
                { label: 'PM2.5 Mass', value: `${district.metrics.pm25} µg/m³` },
                { label: 'Ambient Temp', value: `${district.metrics.temperatureC}°C` },
              ]
            }
          ],
          recommendations: [
            district.metrics.waterPressureBar > 3.8 
              ? `Trim target PRV pressure setpoint from ${district.metrics.waterPressureBar} bar to 3.4 bar to cut acoustic pipe stress by 32%.`
              : `PRV modulation is optimal at ${district.metrics.waterPressureBar} bar. Maintain scheduled nighttime setback.`,
            district.metrics.wasteBinFillPct > 70
              ? `Lower dynamic smart waste dispatch threshold to 65% to avert weekend container spillover.`
              : `Waste collection routes operating with 29.8% fuel reduction. Continue autonomous scheduling.`,
            district.metrics.aqi > 80
              ? `Lower mist-cannon automated trigger from 75 AQI to 60 AQI for immediate particulate knock-down.`
              : `Atmospheric air quality within safe WHO / CPCB benchmarks. Green canopy absorption intact.`
          ]
        };

        setScanReport(newReport);
        saveScanReport(newReport);
        setScanLogs(prev => [
          `[4.20s] Deep scan finalized. Overall telemetry integrity: ${healthScore}% (${grade}).`,
          ...prev
        ]);
      }
      setProgress(Math.min(100, currentProg));
    }, 280);
  };

  const handleApplyRecommendedTuning = () => {
    // Automatically apply the optimal setpoints identified during the deep scan
    tuneDistrict(district.id, {
      prvPressureBar: 3.4,
      peakShavingReservePct: 30,
      smartWasteThresholdPct: 65,
      mistCannonAqiTrigger: 55,
      evFleetRouteOptimization: true,
      hvacPrecoolingDeltaC: -1.0
    });
    onClose();
    if (onOpenTuneDistrict) {
      onOpenTuneDistrict(district.id);
    }
  };

  const handleExportReport = () => {
    if (!scanReport) return;
    const jsonStr = JSON.stringify(scanReport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeepScan_${district.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* ========================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/90 border border-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-950/50">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Deep SCADA Diagnostic Scan
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  {district.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-frequency co-simulation audit across 2,410 IoT transducers, pressure loggers, smart meters, and laser OPCs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startDiagnosticScan}
              disabled={scanState === 'scanning'}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors border border-slate-700 disabled:opacity-50"
              title="Rerun Diagnostics Scan"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${scanState === 'scanning' ? 'animate-spin' : ''}`} />
              <span>Rescan</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SCAN PROGRESS BAR & RADAR STATUS */}
        {/* ========================================================= */}
        <div className="bg-slate-950/60 p-4 border-b border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-2">
              <Radio className={`w-3.5 h-3.5 ${scanState === 'scanning' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
              {scanState === 'scanning' ? (
                <span>Phase {activeStageIdx + 1}/4: {AUDIT_STAGES[activeStageIdx].title}</span>
              ) : (
                <span className="text-emerald-400 font-bold">Diagnostics Complete · 2,410 Sensors Audited</span>
              )}
            </span>
            <span className="text-cyan-400 font-bold tabular-nums">
              {progress}%
            </span>
          </div>

          {/* Progress track */}
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 4 Multi-Subsystem Stage Pips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            {AUDIT_STAGES.map((stg, idx) => {
              const isPast = activeStageIdx > idx || scanState === 'complete';
              const isCurrent = activeStageIdx === idx && scanState === 'scanning';

              return (
                <div 
                  key={idx}
                  className={`p-2 rounded-xl border transition-all ${
                    isPast 
                      ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300' 
                      : isCurrent 
                      ? 'bg-cyan-950/60 border-cyan-600 text-cyan-200 shadow-md'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-[10px] uppercase tracking-wider">
                    {isPast ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    <span>Step {idx + 1}</span>
                  </div>
                  <div className="text-[11px] font-medium truncate mt-0.5">
                    {stg.title.split(' ')[0]} {stg.title.split(' ')[1]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN BODY: DIAGNOSTIC AUDIT RESULTS */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {scanReport && (
            <>
              {/* Overall Integrity Score Card */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 p-5 rounded-2xl border border-cyan-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> SCADA Telemetry Health Index
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
                      {scanReport.overallHealthScore}%
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-xs font-bold">
                      Grade: {scanReport.integrityGrade}
                    </span>
                    <span className="text-slate-400 text-xs">
                      · Verified at {scanReport.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl">
                    All SCADA control loops operating within IEEE 1547 and AWWA M36 fault-tolerance thresholds. No critical cyber-physical anomalies detected.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyRecommendedTuning}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-600/25 transition-all text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Apply Recommended Tuning</span>
                  </button>
                </div>
              </div>

              {/* 4 Subsystem Audit Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scanReport.subsystemAudits.map((sub, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-colors shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Droplets className="w-4 h-4 text-blue-400" />}
                        {idx === 1 && <Zap className="w-4 h-4 text-cyan-400" />}
                        {idx === 2 && <Trash2 className="w-4 h-4 text-emerald-400" />}
                        {idx === 3 && <Wind className="w-4 h-4 text-amber-400" />}
                        <span className="font-bold text-white text-xs">{sub.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        sub.status === 'Optimal' 
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' 
                          : 'bg-amber-950/80 text-amber-300 border-amber-800'
                      }`}>
                        {sub.status} · {sub.score}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {sub.details}
                    </p>

                    {/* Sensor Micro-Metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 font-mono text-[10px]">
                      {sub.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                          <span className="text-slate-500 block text-[9px] uppercase">{m.label}</span>
                          <span className="text-slate-200 font-bold">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actionable Engineering Recommendations */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Automated SCADA Optimization Advisory & Mitigation Playbook</span>
                </h3>

                <div className="space-y-2">
                  {scanReport.recommendations.map((rec, rIdx) => (
                    <div 
                      key={rIdx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 text-[11px]"
                    >
                      <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                        {rIdx + 1}
                      </span>
                      <p className="leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-Time Scan Logs Terminal */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SCADA Diagnostic Sensor Log Stream</span>
                  </span>
                  <span className="text-[10px] text-slate-500">2,410 IoT PACKETS VERIFIED</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-slate-800/60 font-mono text-[10.5px] text-cyan-300 space-y-1 max-h-32 overflow-y-auto">
                  {scanLogs.map((log, lIdx) => (
                    <div key={lIdx} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* ========================================================= */}
        {/* MODAL FOOTER */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReport}
              disabled={!scanReport}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-medium border border-slate-700 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Audit Report (JSON)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenTuneDistrict) {
                  onOpenTuneDistrict(district.id);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl font-semibold transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open District Actuator Tuner</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-cyan-600/25"
            >
              Done & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
