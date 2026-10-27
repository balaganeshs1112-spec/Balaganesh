import React from 'react';
import { Siren, Activity, Heart, Shield, User, Gauge, Zap, Play, Pause, FastForward } from 'lucide-react';
import { AmbulanceTelemetry } from '../types';

interface AmbulanceStatusCardProps {
  telemetry: AmbulanceTelemetry;
  onTriggerEmergency: () => void;
  onResetEmergency: () => void;
  speedMultiplier: number;
  onChangeSpeedMultiplier: (speed: number) => void;
}

export const AmbulanceStatusCard: React.FC<AmbulanceStatusCardProps> = ({
  telemetry,
  onTriggerEmergency,
  onResetEmergency,
  speedMultiplier,
  onChangeSpeedMultiplier
}) => {
  const isEmergency = telemetry.status === 'EMERGENCY';
  const isArrived = telemetry.status === 'ARRIVED';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Background Accent glow */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isEmergency ? 'bg-gradient-to-r from-red-500 via-rose-500 to-amber-500' : isArrived ? 'bg-emerald-500' : 'bg-slate-700'
      }`} />

      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl border ${
            isEmergency 
              ? 'bg-red-950/80 border-red-500/50 text-red-400 shadow-lg shadow-red-950/50 animate-bounce' 
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <Siren className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">Ambulance Telemetry & Patient Status</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                {telemetry.vehicleId}
              </span>
            </div>
            <p className="text-xs text-slate-400">Driver: <span className="text-slate-200 font-medium">{telemetry.driverName}</span></p>
          </div>
        </div>

        <div>
          {isEmergency ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center space-x-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>CODE RED EMERGENCY</span>
            </span>
          ) : isArrived ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>DESTINATION REACHED</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
              STANDBY / NORMAL
            </span>
          )}
        </div>
      </div>

      {/* Patient Vitals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Heart Rate</span>
            </span>
            <span className="text-[10px] font-mono text-rose-400">BPM</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline justify-between">
            <span>{isEmergency ? telemetry.heartRate : 74}</span>
            <span className="text-xs font-sans text-rose-400/80 font-normal">
              {isEmergency ? 'Tachycardia' : 'Normal'}
            </span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>SpO2 Oxygen</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400">%</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline justify-between">
            <span>{isEmergency ? `${telemetry.spO2}%` : '98%'}</span>
            <span className={`text-xs font-sans font-normal ${isEmergency ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isEmergency ? 'Supplemental O2' : 'Stable'}
            </span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Blood Pressure</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400">mmHg</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline justify-between">
            <span>{isEmergency ? telemetry.bloodPressure : '120/80'}</span>
            <span className="text-xs font-sans text-amber-400/80 font-normal">
              {isEmergency ? 'Elevated' : 'Normal'}
            </span>
          </div>
        </div>
      </div>

      {/* Patient Triage Banner */}
      <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-500/40 text-red-400 flex items-center justify-center font-bold text-xs">
            P1
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Patient: {telemetry.patientName} ({telemetry.age} yrs)
            </div>
            <div className="text-xs text-slate-400">
              Diagnosed Condition: <span className="text-red-300 font-semibold">{telemetry.condition}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Sim Speed:</span>
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              onClick={() => onChangeSpeedMultiplier(spd)}
              className={`px-2 py-1 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                speedMultiplier === spd
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {!isEmergency ? (
          <button
            onClick={onTriggerEmergency}
            className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-950/60 border border-red-400/40 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-98"
          >
            <Siren className="w-5 h-5 animate-pulse" />
            <span>START AMBULANCE EMERGENCY WAVE (SETS ENGINE)</span>
          </button>
        ) : (
          <button
            onClick={onResetEmergency}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Reset Emergency Status</span>
          </button>
        )}
      </div>
    </div>
  );
};
