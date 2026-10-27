import React, { useState, useEffect } from 'react';
import { Siren, Volume2, VolumeX, RotateCcw, Play, Pause, Activity, Radio, Shield, MapPin, Zap } from 'lucide-react';

interface HeaderProps {
  isEmergencyActive: boolean;
  currentStep: number;
  onStartEmergency: () => void;
  onResetSimulation: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isEmergencyActive,
  currentStep,
  onStartEmergency,
  onResetSimulation,
  isPaused,
  onTogglePause,
  isMuted,
  onToggleMute
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & System ID */}
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all duration-300 ${
              isEmergencyActive 
                ? 'bg-red-950/80 border-red-500/50 text-red-500 shadow-lg shadow-red-500/20 animate-pulse' 
                : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
            }`}>
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  SETS
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 border border-slate-700 text-cyan-400">
                  Smart Emergency Traffic System
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-2">
                <span>Autonomous Green Wave Corridor Control</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </p>
            </div>
          </div>

          {/* Status Badge & Step Indicator */}
          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800/80">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${isEmergencyActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className="text-xs font-medium text-slate-300">STATUS:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                isEmergencyActive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {isEmergencyActive ? '🚨 EMERGENCY ACTIVE' : '🟢 NORMAL SYSTEM'}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-400">
              <span>PHASE:</span>
              <span className="font-mono font-bold text-amber-400">{currentStep} / 10</span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isEmergencyActive ? (
              <button
                onClick={onStartEmergency}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg shadow-red-950/50 border border-red-400/30 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Siren className="w-4 h-4 animate-bounce" />
                <span>Trigger Emergency Dispatch</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onTogglePause}
                  className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                    isPaused
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                      : 'bg-amber-950/50 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
                  }`}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>

                <button
                  onClick={onResetSimulation}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 transition-all cursor-pointer"
                  title="Reset System to Normal State"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            )}

            <button
              onClick={onToggleMute}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isMuted
                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50'
              }`}
              title={isMuted ? 'Unmute Audio Siren' : 'Mute Audio Siren'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="hidden lg:block text-right font-mono text-xs text-slate-400 pl-2">
              <div className="text-slate-200 font-bold">{timeString}</div>
              <div className="text-[10px] text-slate-500">SETS GRID LIVE</div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
