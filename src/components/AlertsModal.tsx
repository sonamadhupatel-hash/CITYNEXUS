import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Droplets, 
  Trash2, 
  Wind,
  Filter,
  Check
} from 'lucide-react';
import { useCitySimulation } from '../context/CitySimulationContext';
import { SubsystemType } from '../types/cityos';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({ isOpen, onClose }) => {
  const { alerts, acknowledgeAlert, dismissAlert } = useCitySimulation();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterSubsystem, setFilterSubsystem] = useState<string>('all');

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    if (filterSubsystem !== 'all' && a.subsystem !== filterSubsystem) return false;
    return true;
  });

  const getSubsystemIcon = (subsystem: SubsystemType) => {
    switch (subsystem) {
      case 'energy': return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'water': return <Droplets className="w-3.5 h-3.5 text-blue-400" />;
      case 'waste': return <Trash2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'environment': return <Wind className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Bell className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Incident Triage & Alert Catalog</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  alert_catalog.m
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Autonomous multi-domain incident response and operator confirmation queue.
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

        {/* Filter Toolbar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Filter className="w-3.5 h-3.5" /> Severity:
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              {['all', 'critical', 'warning', 'info'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    filterSeverity === sev 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Domain:</span>
            <select
              value={filterSubsystem}
              onChange={(e) => setFilterSubsystem(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Domains</option>
              <option value="energy">Energy Grid</option>
              <option value="water">Water Network</option>
              <option value="waste">Smart Waste</option>
              <option value="environment">Environment</option>
            </select>
          </div>
        </div>

        {/* Alerts Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No matching alerts in queue. System operating within nominal parameters.
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border space-y-2.5 transition-all text-xs ${
                  alert.severity === 'critical'
                    ? 'bg-rose-950/30 border-rose-800/80 text-rose-100'
                    : alert.severity === 'warning'
                    ? 'bg-amber-950/20 border-amber-800/60 text-amber-100'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSubsystemIcon(alert.subsystem)}
                    <span className="font-bold text-white text-sm">{alert.title}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      alert.severity === 'critical'
                        ? 'bg-rose-900/60 text-rose-300'
                        : alert.severity === 'warning'
                        ? 'bg-amber-900/60 text-amber-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>

                  <span className="font-mono text-slate-400 text-[11px]">{alert.timestamp}</span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {alert.description}
                </p>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="text-[10px] text-cyan-400 font-mono block font-semibold uppercase">
                    Autonomous Response Dispatched:
                  </span>
                  <p className="text-[11px] text-slate-300">{alert.autonomousAction}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/50">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Target: {alert.districtName}
                  </span>

                  <div className="flex items-center gap-2">
                    {!alert.isAcknowledged ? (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                      </span>
                    )}
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
