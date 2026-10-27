import React from 'react';
import { TrafficCone, Zap, Clock, ShieldCheck, CheckCircle2, RotateCcw, Lock } from 'lucide-react';
import { TrafficSignal } from '../types';

interface TrafficSignalControllerProps {
  signals: TrafficSignal[];
  onToggleSignalPriority: (signalId: string) => void;
  isEmergencyActive: boolean;
  onOverrideAllGreen: () => void;
  onResetSignals: () => void;
}

export const TrafficSignalController: React.FC<TrafficSignalControllerProps> = ({
  signals,
  onToggleSignalPriority,
  isEmergencyActive,
  onOverrideAllGreen,
  onResetSignals
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <TrafficCone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>🚦 Smart Traffic Signal Priority Control</span>
                {isEmergencyActive && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono animate-pulse">
                    CORRIDOR SYNCED
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">Dynamic Green Priority Wave Override & Cycle Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOverrideAllGreen}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/30 transition-all cursor-pointer shadow-md flex items-center space-x-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Engage All Green Corridor</span>
            </button>

            <button
              onClick={onResetSignals}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Reset Signal Cycles to Normal State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Signals Junction Table Grid */}
        <div className="space-y-2.5 mb-4">
          {signals.map((sig) => {
            const isPriority = sig.isEmergencyPriority || sig.state === 'EMERGENCY_GREEN';

            return (
              <div
                key={sig.id}
                className={`p-3 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isPriority
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Traffic Light Visual Box */}
                  <div className="w-6 h-14 bg-slate-900 border border-slate-700 rounded-lg p-1 flex flex-col items-center justify-between shrink-0 shadow">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      sig.state === 'RED' ? 'bg-red-500 shadow-md shadow-red-500/80 animate-pulse' : 'bg-slate-800'
                    }`} />
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      sig.state === 'AMBER' ? 'bg-amber-400 shadow-md shadow-amber-400/80 animate-pulse' : 'bg-slate-800'
                    }`} />
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      sig.state === 'GREEN' || sig.state === 'EMERGENCY_GREEN' ? 'bg-emerald-400 shadow-md shadow-emerald-400/80 animate-pulse' : 'bg-slate-800'
                    }`} />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{sig.junctionName}</span>
                      {isPriority && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          PRIORITY WAVE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{sig.locationName}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-mono">COUNTDOWN</div>
                    <div className="text-sm font-mono font-bold text-amber-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{sig.countdownSec}s</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleSignalPriority(sig.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      isPriority
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isPriority ? '🟢 Priority On' : 'Override Green'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auto Reset Footer Note */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Automated Safety Protocol:</strong> Once the ambulance passes each junction, SETS holds a 5-second safety buffer and automatically restores normal signal timing cycles.
        </span>
      </div>
    </div>
  );
};
