import React from 'react';
import {
  Siren,
  MapPin,
  Video,
  BarChart3,
  Route,
  TrafficCone,
  ShieldAlert,
  Navigation,
  Hospital,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { EMERGENCY_STAGES } from '../data/mockData';
import { EmergencyStageStep } from '../types';

interface EmergencyStepperProps {
  currentStep: EmergencyStageStep;
  onSelectStep: (step: EmergencyStageStep) => void;
  isEmergencyActive: boolean;
}

const STEP_ICONS: Record<string, React.ReactNode> = {
  Siren: <Siren className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Route: <Route className="w-4 h-4" />,
  TrafficCone: <TrafficCone className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Navigation: <Navigation className="w-4 h-4" />,
  Hospital: <Hospital className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />
};

export const EmergencyStepper: React.FC<EmergencyStepperProps> = ({
  currentStep,
  onSelectStep,
  isEmergencyActive
}) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 py-3 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
      <div className="max-w-7xl mx-auto flex items-center min-w-[900px] justify-between gap-1">
        {EMERGENCY_STAGES.map((stage) => {
          const isActive = currentStep === stage.step;
          const isCompleted = currentStep > stage.step;
          const isPending = currentStep < stage.step;

          return (
            <React.Fragment key={stage.step}>
              <button
                onClick={() => onSelectStep(stage.step)}
                className={`flex-1 flex items-center space-x-2 p-2 rounded-xl transition-all duration-200 border text-left cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-500/80 text-cyan-200 shadow-lg shadow-cyan-950/50 scale-[1.02]'
                    : isCompleted
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/50 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800 border border-slate-700 text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : STEP_ICONS[stage.iconName] || stage.step}
                </div>

                <div className="min-w-0 pr-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-mono opacity-60 uppercase tracking-wider">
                      Step {stage.step}
                    </span>
                  </div>
                  <div className="text-xs font-semibold truncate leading-tight">
                    {stage.title}
                  </div>
                </div>
              </button>

              {stage.step < 10 && (
                <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${
                  isCompleted ? 'text-emerald-500/60' : isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-800'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
