import React, { useState } from 'react';
import { 
  CitySimulationProvider, 
  useCitySimulation 
} from './context/CitySimulationContext';
import { NavigationHeader } from './components/NavigationHeader';
import { HomePage } from './components/HomePage';
import { CityMapDigitalTwin } from './components/CityMapDigitalTwin';
import { SubsystemsHub } from './components/SubsystemsHub';
import { CityBrainConsole } from './components/CityBrainConsole';
import { StressLabScenarios } from './components/StressLabScenarios';
import { AnalyticsBenchmark } from './components/AnalyticsBenchmark';
import { SystemDocsGuide } from './components/SystemDocsGuide';
import { InputLabProcessor } from './components/InputLabProcessor';
import { AlertsModal } from './components/AlertsModal';
import { ManualOverridesModal } from './components/ManualOverridesModal';
import { IncidentResponseModal } from './components/IncidentResponseModal';
import { CityNexusLogo } from './components/CityNexusLogo';
import { 
  ArrowLeft,
  ChevronRight,
  Home
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, isInspectOpen, setIsInspectOpen } = useCitySimulation();
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isOverridesOpen, setIsOverridesOpen] = useState(false);

  const pageTitles: Record<string, string> = {
    home: 'Home Portal',
    digital_twin: 'Digital Twin Map',
    subsystems: 'Subsystems Hub',
    city_brain: 'City Brain Optimizer',
    stress_lab: 'Stress Lab Scenarios',
    input_lab: 'Input Lab & Solver',
    analytics: 'Benchmark Analytics & ROI',
    docs: 'Model Guide & Docs'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <NavigationHeader 
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenOverrides={() => setIsOverridesOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Breadcrumb Navigation Bar (Visible on all sub-pages except Home) */}
        {activeTab !== 'home' && (
          <div className="flex items-center justify-between bg-slate-900/60 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <button 
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-1.5 hover:text-white transition-colors text-cyan-400"
              >
                <Home className="w-3.5 h-3.5" />
                <span>City Nexus Home</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-white font-semibold">{pageTitles[activeTab] || 'Module'}</span>
            </div>

            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors font-medium text-[11px]"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Home</span>
            </button>
          </div>
        )}

        {/* Page 1: Dedicated Main / Home Page */}
        {activeTab === 'home' && <HomePage onNavigate={setActiveTab} />}

        {/* Page 2: Interactive Spatial Map & District Inspector */}
        {activeTab === 'digital_twin' && <CityMapDigitalTwin />}

        {/* Page 3: Subsystems Hub (Energy, Water, Waste, Environment) */}
        {activeTab === 'subsystems' && <SubsystemsHub />}

        {/* Page 4: City Brain Autonomous Multi-Agent Optimizer */}
        {activeTab === 'city_brain' && <CityBrainConsole />}

        {/* Page 5: Stress Lab Scenarios & Disaster Response */}
        {activeTab === 'stress_lab' && <StressLabScenarios />}

        {/* Page 6: Input Randomizer, Processor & Output Lab */}
        {activeTab === 'input_lab' && <InputLabProcessor />}

        {/* Page 7: Benchmark Analytics & Population ROI Calculator */}
        {activeTab === 'analytics' && <AnalyticsBenchmark />}

        {/* Page 8: Architecture Documentation & MATLAB Guide */}
        {activeTab === 'docs' && <SystemDocsGuide />}
      </main>

      {/* Modals */}
      <AlertsModal 
        isOpen={isAlertsOpen} 
        onClose={() => setIsAlertsOpen(false)} 
      />
      
      <ManualOverridesModal 
        isOpen={isOverridesOpen} 
        onClose={() => setIsOverridesOpen(false)} 
      />

      <IncidentResponseModal 
        isOpen={isInspectOpen} 
        onClose={() => setIsInspectOpen(false)} 
        onOpenOverrides={() => setIsOverridesOpen(true)}
      />

      {/* Footer with City Nexus Branding */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('home')} className="hover:opacity-90 transition-opacity">
              <CityNexusLogo size="sm" showSubtitle={false} />
            </button>
            <span>·</span>
            <span>Simulink Continuous Solver (SmartCity_Top.slx)</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">100Hz Co-Simulation Active</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-400 flex-wrap">
            <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => setActiveTab('digital_twin')} className="hover:text-white transition-colors">Map</button>
            <button onClick={() => setActiveTab('subsystems')} className="hover:text-white transition-colors">Subsystems</button>
            <button onClick={() => setActiveTab('city_brain')} className="hover:text-white transition-colors">City Brain</button>
            <button onClick={() => setActiveTab('stress_lab')} className="hover:text-white transition-colors">Stress Lab</button>
            <button onClick={() => setActiveTab('input_lab')} className="hover:text-white transition-colors">Input Lab</button>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-white transition-colors">Analytics</button>
            <button onClick={() => setActiveTab('docs')} className="hover:text-white transition-colors">Model Guide</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CitySimulationProvider>
      <MainAppContent />
    </CitySimulationProvider>
  );
}

