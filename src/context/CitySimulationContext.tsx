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
    let bPower = currentHour >= 13 && currentHour <= 18 ? 8 : (currentHour >= 1 && currentHour <= 5 ? -6 : 0);
    let soc = 68;

    // Operating mode modulations
    if (operatingMode === 'eco_saver') {
      demand *= 0.84; // 16% reduction via smart lighting & eco-HVAC setpoints
      bPower = 12; // clean BESS discharge to displace peaker generation
      soc = 62;
    } else if (operatingMode === 'resilience_peak') {
      demand *= 0.79; // 21% reduction via proactive peak shaving
      bPower = 24; // aggressive 24 MW discharge to evade peak utility tariffs
      soc = 48;
    } else if (operatingMode === 'crisis_response') {
      demand *= 0.68; // 32% load shedding to protect critical feeds
      bPower = 30; // maximum 30 MW microgrid emergency dispatch
      soc = 34;
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
    const renewableShare = Math.min(100, Math.round(((netClean + Math.max(0, bPower)) / Math.max(1, demand)) * 100));
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
      carbonRateKgPerMWh: Math.round(Math.max(38, (100 - renewableShare) * 3.4)),
    };
  }, [currentProfile, operatingMode, activeShock, manualOverrides, currentHour]);

  const waterMetrics: WaterMetrics = useMemo(() => {
    let flow = currentProfile.waterDemandM3;
    let lossPct = currentProfile.waterLossPct;
    let pressure = 3.8;
    let resPct = 84.2;
    let leaks = 1;
    let fsmState: WaterMetrics['leakFsmState'] = 'MONITORING';
    let efficiency = 92.4;

    if (operatingMode === 'eco_saver') {
      flow *= 0.91; // 9% reduction from non-essential irrigation throttling
      lossPct *= 0.78; // loss drops to ~12.3%
      pressure = 3.2; // eco PRV down-modulation
      efficiency = 95.8;
      leaks = 0;
    } else if (operatingMode === 'resilience_peak') {
      flow *= 0.95;
      lossPct *= 0.94;
      pressure = 3.5; // gravity pressure buffer
      efficiency = 91.0;
    } else if (operatingMode === 'crisis_response') {
      flow *= 0.75;
      lossPct = 10.8;
      pressure = 4.2; // boosted line pressure for emergency response
      efficiency = 88.5;
      leaks = 0;
      fsmState = 'VALVE_ISOLATED';
    }

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

    return {
      reservoirLevelPct: parseFloat(resPct.toFixed(1)),
      reservoirVolumeM3: Math.round(14500000 * (resPct / 100)),
      networkFlowM3h: Math.round(flow),
      averagePressureBar: parseFloat(pressure.toFixed(1)),
      activeLeaksDetected: leaks,
      waterLossRatePct: parseFloat(lossPct.toFixed(1)),
      baselineLossPct: 24.8,
      pumpEfficiencyPct: parseFloat(efficiency.toFixed(1)),
      leakFsmState: fsmState,
    };
  }, [currentProfile, operatingMode, activeShock, manualOverrides]);

  const wasteMetrics: WasteMetrics = useMemo(() => {
    let avgFill = currentProfile.wasteFillPct;
    let trucks = 8;
    let fuelSaved = 29.8;
    let diversion = 76.4;

    if (operatingMode === 'eco_saver') {
      trucks = 6; // high-density TSP route clusters
      fuelSaved = 39.5;
      diversion = 84.8; // robotic optical sorting boosted
      avgFill = Math.max(25, avgFill - 6);
    } else if (operatingMode === 'resilience_peak') {
      trucks = 7; // off-peak corridor scheduling
      fuelSaved = 33.2;
      diversion = 78.0;
    } else if (operatingMode === 'crisis_response') {
      trucks = 4; // emergency waste dispatch only
      fuelSaved = 44.0;
      diversion = 65.0;
    }

    const thresholdCount = Math.round(avgFill > 60 ? (avgFill - 50) * 4.2 : 8);

    return {
      avgFillLevelPct: Math.round(avgFill),
      binsAboveThreshold: thresholdCount,
      totalSmartBins: 1240,
      activeTrucks: trucks,
      routeCompletionPct: Math.min(100, Math.round(30 + (currentHour / 24) * 65)),
      landfillDiversionPct: parseFloat(diversion.toFixed(1)),
      fleetFuelSavedPct: parseFloat(fuelSaved.toFixed(1)),
      dailyCollectedTons: Math.round(180 + (currentHour / 24) * 140),
    };
  }, [currentProfile, operatingMode, currentHour]);

  const environmentMetrics: EnvironmentMetrics = useMemo(() => {
    let aqi = currentProfile.aqi;
    let cannons = 2;
    let uhi = 2.8; // urban heat island

    if (operatingMode === 'eco_saver') {
      aqi = Math.max(16, Math.round(aqi * 0.68)); // crisp clean air
      cannons = 4;
      uhi = 2.1;
    } else if (operatingMode === 'resilience_peak') {
      aqi = Math.max(22, Math.round(aqi * 0.88));
      cannons = 6;
      uhi = 2.4;
    } else if (operatingMode === 'crisis_response') {
      aqi = Math.max(20, Math.round(aqi * 0.62));
      cannons = 16; // full emergency mist cannon scrub
      uhi = 1.8;
    }

    if (activeShock?.id === 'scenario_3_smog_inversion') {
      aqi = manualOverrides.forceMistCannons ? 88 : 194;
      cannons = 16;
    }

    let pm25 = parseFloat((aqi * 0.32).toFixed(1));

    return {
      cityAqiAvg: Math.round(aqi),
      pm25UgM3: pm25,
      pm10UgM3: parseFloat((pm25 * 1.8).toFixed(1)),
      urbanHeatIslandDeltaC: parseFloat(uhi.toFixed(1)),
      activeMistCannons: manualOverrides.forceMistCannons ? 16 : cannons,
      noiseDbAvg: currentHour >= 22 || currentHour <= 5 ? 44.2 : 58.4,
      greenCanopyAbsorptionTons: 428,
    };
  }, [currentProfile, operatingMode, activeShock, manualOverrides, currentHour]);

  // Adjust district metrics dynamically with live multipliers, policy mode & actuator tunings
  const districts = useMemo(() => {
    return DISTRICTS_DATA.map(d => {
      let demand = d.metrics.powerDemandMW;
      let aqi = d.metrics.aqi;
      let temp = d.metrics.temperatureC;
      let pressure = d.metrics.waterPressureBar;
      let leakRisk = d.metrics.leakRiskScore;
      let wasteFill = d.metrics.wasteBinFillPct;

      // Operating Mode policies applied to districts
      if (operatingMode === 'eco_saver') {
        demand *= 0.84; // 16% eco-load curtailment
        aqi = Math.max(14, Math.round(aqi * 0.68)); // clean air improvement
        pressure = 3.2; // eco pressure setpoint
        leakRisk = Math.max(2, Math.round(leakRisk * 0.7));
      } else if (operatingMode === 'resilience_peak') {
        demand *= 0.79; // active peak load shaving via BESS microgrid
        pressure = 3.5; // buffer pressure
        leakRisk = Math.max(4, Math.round(leakRisk * 0.85));
      } else if (operatingMode === 'crisis_response') {
        demand *= 0.68; // non-critical load shedding
        pressure = d.id === 'd1_downtown' || d.id === 'd3_residential' ? 4.2 : 3.4; // priority firefighting/medical pressure
        aqi = Math.max(18, Math.round(aqi * 0.60)); // mist cannons full scrub
        leakRisk = 8; // isolated
      }

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
  }, [activeShock, districtTunings, operatingMode]);

  // Dynamic 24-hour profiles reactive to operating mode & shocks
  const hourlyProfiles = useMemo(() => {
    return HOURLY_PROFILE_24H.map(p => {
      let energy = p.optimizedEnergyMW;
      let water = p.waterDemandM3;
      let loss = p.waterLossPct;
      let aqi = p.aqi;

      if (operatingMode === 'eco_saver') {
        energy *= 0.84;
        water *= 0.91;
        loss *= 0.78;
        aqi = Math.max(16, Math.round(aqi * 0.68));
      } else if (operatingMode === 'resilience_peak') {
        energy = p.hour >= 11 && p.hour <= 19 ? energy * 0.75 : energy * 0.88;
        water *= 0.95;
        loss *= 0.94;
        aqi = Math.max(20, Math.round(aqi * 0.88));
      } else if (operatingMode === 'crisis_response') {
        energy *= 0.68;
        water *= 0.75;
        loss *= 0.65;
        aqi = Math.max(18, Math.round(aqi * 0.62));
      }

      if (activeShock?.id === 'scenario_1_heatwave') {
        energy *= 1.34;
      } else if (activeShock?.id === 'scenario_2_pipe_burst') {
        water += 450;
      } else if (activeShock?.id === 'scenario_3_smog_inversion') {
        aqi = Math.round(aqi * 2.2);
      }

      return {
        ...p,
        optimizedEnergyMW: parseFloat(energy.toFixed(1)),
        waterDemandM3: Math.round(water),
        waterLossPct: parseFloat(loss.toFixed(1)),
        aqi: Math.round(aqi),
      };
    });
  }, [operatingMode, activeShock]);

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
        hourlyProfiles,
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
