import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  OperatingMode, 
  DistrictId, 
  District, 
  EnergyMetrics, 
  WaterMetrics, 
  WasteMetrics, 
  EnvironmentMetrics, 
  AlertItem, 
  ShockScenario, 
  TimeSeriesPoint,
  DistrictTuning,
  DeepScanReport
} from '../types/cityos';
import { DISTRICTS_DATA, SHOCK_SCENARIOS, INITIAL_ALERTS, HOURLY_PROFILE_24H } from '../data/cityData';

interface CitySimulationContextType {
  // Time and playback
  currentHour: number;
  currentMinute: number;
  isPlaying: boolean;
  simSpeed: number; // 1, 5, 15
  setCurrentHour: (hour: number) => void;
  togglePlay: () => void;
  setSimSpeed: (speed: number) => void;

  // Navigation & selection
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDistrict: District | null;
  setSelectedDistrict: (district: District | null) => void;

  // District Actuator Tuning & Deep SCADA Scan
  districtTunings: Record<string, DistrictTuning>;
  tuneDistrict: (districtId: string, tuning: Partial<DistrictTuning>) => void;
  resetDistrictTuning: (districtId: string) => void;
  latestScanReports: Record<string, DeepScanReport>;
  saveScanReport: (report: DeepScanReport) => void;

  // Brain & Modes
  operatingMode: OperatingMode;
  setOperatingMode: (mode: OperatingMode) => void;

  // Shocks & Response Inspection
  activeShock: ShockScenario | null;
  triggerShock: (scenarioId: string) => void;
  clearShock: () => void;
  isInspectOpen: boolean;
  setIsInspectOpen: (open: boolean) => void;
  inspectScenario: (scenario?: ShockScenario | null) => void;
  inspectedScenario: ShockScenario | null;

  // Alerts
  alerts: AlertItem[];
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;

  // Overrides
  manualOverrides: {
    batteryForceDischargeMW: number;
    forceMistCannons: boolean;
    valveIsolationOverride: boolean;
    evChargingThrottlePct: number;
  };
  setManualOverride: (key: string, value: any) => void;
  resetOverrides: () => void;

  // Dynamic Telemetry
  energyMetrics: EnergyMetrics;
  waterMetrics: WaterMetrics;
  wasteMetrics: WasteMetrics;
  environmentMetrics: EnvironmentMetrics;
  districts: District[];
  hourlyProfiles: TimeSeriesPoint[];
}

const CitySimulationContext = createContext<CitySimulationContextType | undefined>(undefined);

export const CitySimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHour, setCurrentHour] = useState<number>(14);
  const [currentMinute, setCurrentMinute] = useState<number>(25);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedDistrictId, setSelectedDistrictId] = useState<DistrictId>('d1_downtown');
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('balanced');
  const [activeShock, setActiveShock] = useState<ShockScenario | null>(null);
  const [isInspectOpen, setIsInspectOpen] = useState<boolean>(false);
  const [inspectedScenario, setInspectedScenario] = useState<ShockScenario | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  // Fine-grained District SCADA Tunings & Scan Reports
  const [districtTunings, setDistrictTunings] = useState<Record<string, DistrictTuning>>({});
  const [latestScanReports, setLatestScanReports] = useState<Record<string, DeepScanReport>>({});

  const tuneDistrict = (districtId: string, tuning: Partial<DistrictTuning>) => {
    setDistrictTunings(prev => {
      const current = prev[districtId] || {
        prvPressureBar: 3.8,
        peakShavingReservePct: 25,
        smartWasteThresholdPct: 75,
        mistCannonAqiTrigger: 65,
        evFleetRouteOptimization: true,
        hvacPrecoolingDeltaC: 0.0,
      };
      return {
        ...prev,
        [districtId]: {
          ...current,
          ...tuning,
          lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        }
      };
    });
  };

  const resetDistrictTuning = (districtId: string) => {
    setDistrictTunings(prev => {
      const updated = { ...prev };
      delete updated[districtId];
      return updated;
    });
  };

  const saveScanReport = (report: DeepScanReport) => {
    setLatestScanReports(prev => ({
      ...prev,
      [report.districtId]: report,
    }));
  };

  const [manualOverrides, setManualOverrides] = useState({
    batteryForceDischargeMW: 0,
    forceMistCannons: false,
    valveIsolationOverride: false,
    evChargingThrottlePct: 0,
  });

  const setManualOverride = (key: string, value: any) => {
    setManualOverrides(prev => ({ ...prev, [key]: value }));
  };

  const resetOverrides = () => {
    setManualOverrides({
      batteryForceDischargeMW: 0,
      forceMistCannons: false,
      valveIsolationOverride: false,
      evChargingThrottlePct: 0,
    });
  };

  // Clock progression
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentMinute(prevMin => {
        const nextMin = prevMin + (simSpeed === 1 ? 1 : simSpeed === 5 ? 5 : 12);
        if (nextMin >= 60) {
          setCurrentHour(prevH => (prevH + 1) % 24);
          return nextMin % 60;
        }
        return nextMin;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const togglePlay = () => setIsPlaying(prev => !prev);

  const inspectScenario = (scenario?: ShockScenario | null) => {
    if (scenario) {
      setInspectedScenario(scenario);
    } else if (activeShock) {
      setInspectedScenario(activeShock);
    } else {
      setInspectedScenario(SHOCK_SCENARIOS[1]);
    }
    setIsInspectOpen(true);
  };

  const triggerShock = (scenarioId: string) => {
    const scenario = SHOCK_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setActiveShock(scenario);
      setInspectedScenario(scenario);
      // Auto-escalate operating mode if catastrophic
      if (scenario.severityLevel === 'Catastrophic') {
        setOperatingMode('crisis_response');
      } else if (scenario.severityLevel === 'Severe') {
        setOperatingMode('resilience_peak');
      }

      // Add high-priority alert
      const newAlert: AlertItem = {
        id: `shock_${Date.now()}`,
        timestamp: `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`,
        districtId: scenario.subsystem === 'water' ? 'd1_downtown' : scenario.subsystem === 'energy' ? 'd1_downtown' : 'd4_industrial',
        districtName: 'Neo-Veridia Central',
        subsystem: scenario.subsystem,
        severity: 'critical',
        title: `CRISIS INJECTED: ${scenario.name}`,
        description: scenario.headline,
        autonomousAction: scenario.cityOsMitigation,
        isAcknowledged: false,
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const clearShock = () => {
    setActiveShock(null);
    setOperatingMode('balanced');
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isAcknowledged: true } : a));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Compute live dynamic telemetry based on time, mode, shocks and overrides
  const currentProfile = useMemo(() => {
    return HOURLY_PROFILE_24H[currentHour] || HOURLY_PROFILE_24H[14];
  }, [currentHour]);

  const energyMetrics: EnergyMetrics = useMemo(() => {
    let demand = currentProfile.optimizedEnergyMW;
    let baseline = currentProfile.baselineEnergyMW;
    let solar = currentProfile.solarMW;
    let wind = currentProfile.windMW;
    let bPower = 0; // battery power
    let soc = 68;

    // Operating mode modulations
    if (operatingMode === 'eco_saver') {
      demand *= 0.94;
    } else if (operatingMode === 'resilience_peak') {
      demand *= 0.88;
      bPower = 18; // discharging to shave peak
      soc = 52;
    } else if (operatingMode === 'crisis_response') {
      demand *= 0.78;
      bPower = 28;
      soc = 41;
    }

    // Shock scenario influence
    if (activeShock?.id === 'scenario_1_heatwave') {
      demand += 22.4;
      baseline += 42.0;
      bPower = 26.5;
    } else if (activeShock?.id === 'scenario_5_ev_surge') {
      demand += 14.2;
      baseline += 34.0;
      bPower = 12.0;
    }

    // Manual overrides
    if (manualOverrides.batteryForceDischargeMW > 0) {
      bPower += manualOverrides.batteryForceDischargeMW;
      soc = Math.max(15, soc - manualOverrides.batteryForceDischargeMW * 0.4);
    }
    if (manualOverrides.evChargingThrottlePct > 0) {
      demand -= (manualOverrides.evChargingThrottlePct * 0.12);
    }

    const netClean = solar + wind;
    const gridImport = Math.max(0, demand - netClean - bPower);
    const renewableShare = Math.min(100, Math.round(((netClean + bPower) / Math.max(1, demand)) * 100));
    const peakShaved = Math.max(0, baseline - demand);

    return {
      totalDemandMW: parseFloat(demand.toFixed(1)),
      solarGenMW: parseFloat(solar.toFixed(1)),
      windGenMW: parseFloat(wind.toFixed(1)),
      batterySocPct: Math.round(soc),
      batteryPowerMW: parseFloat(bPower.toFixed(1)),
      gridImportMW: parseFloat(gridImport.toFixed(1)),
      baselineDemandMW: parseFloat(baseline.toFixed(1)),
      peakShavedMW: parseFloat(peakShaved.toFixed(1)),
      renewableSharePct: renewableShare,
      carbonRateKgPerMWh: Math.round(Math.max(45, (100 - renewableShare) * 3.8)),
    };
  }, [currentProfile, operatingMode, activeShock, manualOverrides]);

  const waterMetrics: WaterMetrics = useMemo(() => {
    let flow = currentProfile.waterDemandM3;
    let lossPct = currentProfile.waterLossPct;
    let pressure = 3.8;
    let resPct = 84.2;
    let leaks = 1;
    let fsmState: WaterMetrics['leakFsmState'] = 'MONITORING';

    if (activeShock?.id === 'scenario_2_pipe_burst') {
      flow += 450;
      lossPct = manualOverrides.valveIsolationOverride ? 16.2 : 28.5;
      pressure = manualOverrides.valveIsolationOverride ? 3.4 : 1.8;
      leaks = manualOverrides.valveIsolationOverride ? 0 : 1;
      fsmState = manualOverrides.valveIsolationOverride ? 'VALVE_ISOLATED' : 'ACOUSTIC_ANOMALY';
    } else if (activeShock?.id === 'scenario_4_flash_flood') {
      resPct = 94.6;
      pressure = 4.4;
    }

    if (operatingMode === 'eco_saver') {
      flow *= 0.95;
      lossPct *= 0.92;
    }

    return {
      reservoirLevelPct: parseFloat(resPct.toFixed(1)),
      reservoirVolumeM3: Math.round(14500000 * (resPct / 100)),
      networkFlowM3h: Math.round(flow),
      averagePressureBar: parseFloat(pressure.toFixed(1)),
      activeLeaksDetected: leaks,
      waterLossRatePct: parseFloat(lossPct.toFixed(1)),
      baselineLossPct: 24.8,
      pumpEfficiencyPct: 92.4,
      leakFsmState: fsmState,
    };
  }, [currentProfile, operatingMode, activeShock, manualOverrides]);

  const wasteMetrics: WasteMetrics = useMemo(() => {
    const avgFill = currentProfile.wasteFillPct;
    const thresholdCount = Math.round(avgFill > 60 ? (avgFill - 50) * 4.2 : 8);

    return {
      avgFillLevelPct: avgFill,
      binsAboveThreshold: thresholdCount,
      totalSmartBins: 1240,
      activeTrucks: operatingMode === 'eco_saver' ? 6 : 8,
      routeCompletionPct: Math.min(100, Math.round(30 + (currentHour / 24) * 65)),
      landfillDiversionPct: 76.4,
      fleetFuelSavedPct: 29.8,
      dailyCollectedTons: Math.round(180 + (currentHour / 24) * 140),
    };
  }, [currentProfile, operatingMode, currentHour]);

  const environmentMetrics: EnvironmentMetrics = useMemo(() => {
    let aqi = currentProfile.aqi;
    let pm25 = aqi * 0.32;
    let cannons = 2;
    let uhi = 2.8; // urban heat island

    if (activeShock?.id === 'scenario_3_smog_inversion') {
      aqi = manualOverrides.forceMistCannons ? 88 : 194;
      pm25 = aqi * 0.42;
      cannons = 16;
    }

    if (operatingMode === 'eco_saver') {
      aqi = Math.max(18, aqi - 8);
      pm25 = Math.max(4, pm25 - 3);
    }

    return {
      cityAqiAvg: Math.round(aqi),
      pm25UgM3: parseFloat(pm25.toFixed(1)),
      pm10UgM3: parseFloat((pm25 * 1.8).toFixed(1)),
      urbanHeatIslandDeltaC: parseFloat(uhi.toFixed(1)),
      activeMistCannons: manualOverrides.forceMistCannons ? 16 : cannons,
      noiseDbAvg: currentHour >= 22 || currentHour <= 5 ? 44.2 : 58.4,
      greenCanopyAbsorptionTons: 428,
    };
  }, [currentProfile, operatingMode, activeShock, manualOverrides, currentHour]);

  // Adjust district metrics dynamically with live multipliers & actuator tunings
  const districts = useMemo(() => {
    return DISTRICTS_DATA.map(d => {
      let demand = d.metrics.powerDemandMW;
      let aqi = d.metrics.aqi;
      let temp = d.metrics.temperatureC;
      let pressure = d.metrics.waterPressureBar;
      let leakRisk = d.metrics.leakRiskScore;
      let wasteFill = d.metrics.wasteBinFillPct;

      // Active district tuning setpoint application
      const tuning = districtTunings[d.id];
      if (tuning) {
        pressure = tuning.prvPressureBar;
        if (tuning.prvPressureBar < 3.8) {
          leakRisk = Math.max(2, Math.round(leakRisk * (tuning.prvPressureBar / 3.8) * 0.65));
        } else if (tuning.prvPressureBar > 3.8) {
          leakRisk = Math.min(95, Math.round(leakRisk * (tuning.prvPressureBar / 3.8)));
        }

        if (tuning.peakShavingReservePct > 20) {
          const shaveRatio = (tuning.peakShavingReservePct - 20) * 0.007;
          demand = Math.max(8, demand * (1 - shaveRatio));
        }

        if (tuning.smartWasteThresholdPct < 75) {
          wasteFill = Math.max(20, Math.round(wasteFill * (tuning.smartWasteThresholdPct / 75)));
        }

        if (aqi >= tuning.mistCannonAqiTrigger) {
          aqi = Math.max(15, Math.round(aqi * 0.7));
        }

        temp = parseFloat((temp + tuning.hvacPrecoolingDeltaC).toFixed(1));
      }

      // Live Shock Scenario perturbations
      if (activeShock?.id === 'scenario_1_heatwave') {
        temp += 8.2;
        demand *= 1.34;
      } else if (activeShock?.id === 'scenario_3_smog_inversion' && d.id === 'd4_industrial') {
        aqi = 195;
      } else if (activeShock?.id === 'scenario_2_pipe_burst' && d.id === 'd1_downtown') {
        pressure = 1.8;
        leakRisk = 94;
      }

      return {
        ...d,
        metrics: {
          ...d.metrics,
          powerDemandMW: parseFloat(demand.toFixed(1)),
          aqi: Math.round(aqi),
          pm25: parseFloat((aqi * 0.32).toFixed(1)),
          temperatureC: parseFloat(temp.toFixed(1)),
          waterPressureBar: parseFloat(pressure.toFixed(1)),
          leakRiskScore: leakRisk,
          wasteBinFillPct: wasteFill,
        }
      };
    });
  }, [activeShock, districtTunings]);

  // Reactive selected district
  const selectedDistrict = useMemo(() => {
    return districts.find(d => d.id === selectedDistrictId) || districts[0] || null;
  }, [districts, selectedDistrictId]);

  const setSelectedDistrict = (d: District | null) => {
    if (d) {
      setSelectedDistrictId(d.id);
    }
  };

  return (
    <CitySimulationContext.Provider
      value={{
        currentHour,
        currentMinute,
        isPlaying,
        simSpeed,
        setCurrentHour,
        togglePlay,
        setSimSpeed,
        activeTab,
        setActiveTab,
        selectedDistrict,
        setSelectedDistrict,
        districtTunings,
        tuneDistrict,
        resetDistrictTuning,
        latestScanReports,
        saveScanReport,
        operatingMode,
        setOperatingMode,
        activeShock,
        triggerShock,
        clearShock,
        isInspectOpen,
        setIsInspectOpen,
        inspectScenario,
        inspectedScenario,
        alerts,
        acknowledgeAlert,
        dismissAlert,
        manualOverrides,
        setManualOverride,
        resetOverrides,
        energyMetrics,
        waterMetrics,
        wasteMetrics,
        environmentMetrics,
        districts,
        hourlyProfiles: HOURLY_PROFILE_24H,
      }}
    >
      {children}
    </CitySimulationContext.Provider>
  );
};

export const useCitySimulation = () => {
  const context = useContext(CitySimulationContext);
  if (!context) {
    throw new Error('useCitySimulation must be used within a CitySimulationProvider');
  }
  return context;
};
