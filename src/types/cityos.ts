export type OperatingMode = 'balanced' | 'eco_saver' | 'resilience_peak' | 'crisis_response';

export type SubsystemType = 'energy' | 'water' | 'waste' | 'environment' | 'brain';

export type DistrictId = 'd1_downtown' | 'd2_tech' | 'd3_residential' | 'd4_industrial' | 'd5_greenbelt';

export interface District {
  id: DistrictId;
  name: string;
  category: string;
  population: number;
  areaKm2: number;
  description: string;
  coordinates: { x: number; y: number; width: number; height: number };
  color: string;
  metrics: {
    powerDemandMW: number;
    solarCapMW: number;
    waterDemandMLD: number; // megaliters per day
    waterPressureBar: number;
    leakRiskScore: number; // 0-100
    wasteBinFillPct: number;
    aqi: number;
    pm25: number;
    temperatureC: number;
  };
  activeAlertsCount: number;
}

export interface EnergyMetrics {
  totalDemandMW: number;
  solarGenMW: number;
  windGenMW: number;
  batterySocPct: number;
  batteryPowerMW: number; // positive = discharging, negative = charging
  gridImportMW: number;
  baselineDemandMW: number;
  peakShavedMW: number;
  renewableSharePct: number;
  carbonRateKgPerMWh: number;
}

export interface WaterMetrics {
  reservoirLevelPct: number;
  reservoirVolumeM3: number;
  networkFlowM3h: number;
  averagePressureBar: number;
  activeLeaksDetected: number;
  waterLossRatePct: number;
  baselineLossPct: number;
  pumpEfficiencyPct: number;
  leakFsmState: 'MONITORING' | 'ACOUSTIC_ANOMALY' | 'LOCALIZED' | 'VALVE_ISOLATED' | 'REPAIR_SCHEDULED';
}

export interface WasteMetrics {
  avgFillLevelPct: number;
  binsAboveThreshold: number;
  totalSmartBins: number;
  activeTrucks: number;
  routeCompletionPct: number;
  landfillDiversionPct: number;
  fleetFuelSavedPct: number;
  dailyCollectedTons: number;
}

export interface EnvironmentMetrics {
  cityAqiAvg: number;
  pm25UgM3: number;
  pm10UgM3: number;
  urbanHeatIslandDeltaC: number;
  activeMistCannons: number;
  noiseDbAvg: number;
  greenCanopyAbsorptionTons: number;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  districtId: DistrictId;
  districtName: string;
  subsystem: SubsystemType;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  autonomousAction: string;
  isAcknowledged: boolean;
}

export interface ShockScenario {
  id: string;
  scenarioNumber: number;
  name: string;
  subsystem: SubsystemType;
  durationMinutes: number;
  severityLevel: 'Moderate' | 'Severe' | 'Catastrophic';
  headline: string;
  description: string;
  baselineImpact: string;
  cityOsMitigation: string;
  kpiImpact: {
    label: string;
    baseline: string;
    cityOs: string;
    improvement: string;
  }[];
}

export interface TimeSeriesPoint {
  hour: number;
  timeLabel: string;
  baselineEnergyMW: number;
  optimizedEnergyMW: number;
  solarMW: number;
  windMW: number;
  waterDemandM3: number;
  waterLossPct: number;
  aqi: number;
  wasteFillPct: number;
}

export interface SimulationInputDataset {
  datasetId: string;
  name: string;
  seed: number;
  ambientTempC: number;
  solarIrradiancePeakWm2: number;
  windSpeedAvgMs: number;
  electricLoadScale: number; // 0.7 to 1.5
  waterDemandScale: number; // 0.7 to 1.5
  wasteGenRateDailyTons: number; // 150 to 450
  backgroundAqi: number; // 15 to 190
  batteryInitialSocPct: number; // 20 to 90
  gridTariffPeakInrMwh: number; // ₹9,000 to ₹32,000 / MWh
  hourlyTemp: number[];
  hourlySolarWm2: number[];
  hourlyWindMs: number[];
  hourlyBaseLoadMW: number[];
  hourlyWaterM3: number[];
}

export interface ProcessedSimulationOutput {
  runId: string;
  timestamp: string;
  inputDataset: SimulationInputDataset;
  hourlyProfile: TimeSeriesPoint[];
  hourlyCostProfile: {
    hour: number;
    timeLabel: string;
    baselineCostINR: number;
    optimizedCostINR: number;
    hourlySavingsINR: number;
    energyCostINR: number;
    waterCostINR: number;
    logisticsCostINR: number;
  }[];
  kpis: {
    peakBaselineMW: number;
    peakOptimizedMW: number;
    peakReductionPct: number;
    totalDailyEnergyMWh: number;
    renewableSharePct: number;
    bessDischargeTotalMWh: number;
    totalWaterDemandM3: number;
    waterLossBaselineM3: number;
    waterLossOptimizedM3: number;
    waterLossReductionPct: number;
    fleetDistanceKm: number;
    distanceSavedKm: number;
    binsCollectedCount: number;
    overflowCount: number;
    cityAverageAqi: number;
    hazardousAqiHours: number;
    mistCannonsEngagedCount: number;
    baselineDailyCostINR: number;
    optimizedDailyCostINR: number;
    dailySavingsINR: number;
    costReductionPct: number;
    dailyCarbonTonCO2: number;
    carbonSavedTonCO2: number;
    resilienceScore: number;
    energyGenMix: {
      solarMWh: number;
      windMWh: number;
      batteryMWh: number;
      gridMWh: number;
    };
  };
  solverExecutionLog: {
    stage: string;
    durationMs: number;
    status: 'COMPLETE' | 'OPTIMAL' | 'CONVERGED';
    details: string;
  }[];
}

export interface DistrictTuning {
  prvPressureBar: number;
  peakShavingReservePct: number;
  smartWasteThresholdPct: number;
  mistCannonAqiTrigger: number;
  evFleetRouteOptimization: boolean;
  hvacPrecoolingDeltaC: number;
  lastUpdated?: string;
}

export interface DeepScanReport {
  districtId: DistrictId;
  districtName: string;
  timestamp: string;
  overallHealthScore: number;
  integrityGrade: 'A+' | 'A' | 'B+' | 'B' | 'Needs Attention';
  sensorsAudited: number;
  subsystemAudits: {
    name: string;
    status: 'Nominal' | 'Optimal' | 'Advisory' | 'Critical';
    score: number;
    details: string;
    anomaliesFound: number;
    metrics: { label: string; value: string }[];
  }[];
  recommendations: string[];
}
