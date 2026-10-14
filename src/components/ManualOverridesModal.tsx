import React from 'react';
import { 
  X, 
  SlidersHorizontal, 
  RotateCcw, 
  Zap, 
  Droplets, 
  Wind, 
  BatteryCharging, 
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useCitySimulation } from '../context/CitySimulationContext';

interface ManualOverridesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualOverridesModal: React.FC<ManualOverridesModalProps> = ({ isOpen, onClose }) => {
  const { manualOverrides, setManualOverride, resetOverrides } = useCitySimulation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-5 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Manual Actuator Overrides</h3>
              <p className="text-xs text-slate-400">
                Direct operator setpoint injection overriding the autonomous City Brain.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* BESS Discharge Slider */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <BatteryCharging className="w-4 h-4 text-cyan-400" /> Utility BESS Forced Discharge:
              </span>
              <span className="font-mono text-cyan-400 font-bold text-sm">
                {manualOverrides.batteryForceDischargeMW} MW
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="30"
              step="5"
              value={manualOverrides.batteryForceDischargeMW}
              onChange={(e) => setManualOverride('batteryForceDischargeMW', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Forces battery discharge onto 110kV grid regardless of optimizer threshold.
            </p>
          </div>

          {/* EV Fleet Throttle Slider */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-4 h-4 text-amber-400" /> EV Fast-Charging Station Throttle:
              </span>
              <span className="font-mono text-amber-400 font-bold text-sm">
                {manualOverrides.evChargingThrottlePct}%
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="50"
              step="5"
              value={manualOverrides.evChargingThrottlePct}
              onChange={(e) => setManualOverride('evChargingThrottlePct', parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded appearance-none cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Smooths distribution peak during simultaneous 350kW vehicle charging pulses.
            </p>
          </div>

          {/* Binary Toggles: Valves & Mist Cannons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-300 block font-medium">Motor Gate Valves V-14/15</span>
              <button
                onClick={() => setManualOverride('valveIsolationOverride', !manualOverrides.valveIsolationOverride)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold font-mono transition-colors ${
                  manualOverrides.valveIsolationOverride
                    ? 'bg-rose-950 border-rose-600 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {manualOverrides.valveIsolationOverride ? 'ISOLATED (CLOSED)' : 'OPEN (NORMAL)'}
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-300 block font-medium">16 Aerosol Mist Cannons</span>
              <button
                onClick={() => setManualOverride('forceMistCannons', !manualOverrides.forceMistCannons)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold font-mono transition-colors ${
                  manualOverrides.forceMistCannons
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {manualOverrides.forceMistCannons ? 'FORCED ENGAGED' : 'AUTO SCADA'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={resetOverrides}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Autonomous</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
