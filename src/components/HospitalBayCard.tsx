import React from 'react';
import { Hospital as HospitalIcon, BedDouble, UserCheck, Phone, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { Hospital } from '../types';

interface HospitalBayCardProps {
  hospital: Hospital;
  isArrived: boolean;
  etaSeconds: number;
}

export const HospitalBayCard: React.FC<HospitalBayCardProps> = ({
  hospital,
  isArrived,
  etaSeconds
}) => {
  return (
    <div className={`border rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm transition-all duration-300 ${
      isArrived
        ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-emerald-950/90 border-emerald-400 shadow-emerald-950/80 scale-[1.01]'
        : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/50">
            <HospitalIcon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">{hospital.name}</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
                PRIMARY ER
              </span>
            </div>
            <p className="text-xs text-slate-400">{hospital.locationName}</p>
          </div>
        </div>

        <div>
          {isArrived ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40 animate-bounce flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>AMBULANCE ARRIVED AT BAY</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
              ETA: {Math.floor(etaSeconds / 60)}m {etaSeconds % 60}s
            </span>
          )}
        </div>
      </div>

      {/* Hospital Preparedness Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center space-x-1 mb-1">
            <BedDouble className="w-3.5 h-3.5 text-cyan-400" />
            <span>ICU Bed Availability</span>
          </div>
          <div className="text-xl font-mono font-bold text-white flex items-baseline justify-between">
            <span>{hospital.availableIcuBeds} <span className="text-xs font-sans text-slate-400">/ {hospital.totalIcuBeds}</span></span>
            <span className="text-xs font-sans text-emerald-400 font-normal">Reserved</span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center space-x-1 mb-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Trauma Doctor</span>
          </div>
          <div className="text-xs font-bold text-slate-200 truncate">
            {hospital.doctorAssigned}
          </div>
          <div className="text-[10px] text-emerald-400">On Emergency Standby</div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center space-x-1 mb-1">
            <Phone className="w-3.5 h-3.5 text-rose-400" />
            <span>Hotline Contact</span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-200">
            {hospital.contactNumber}
          </div>
          <div className="text-[10px] text-slate-400">Direct ER Dispatch</div>
        </div>
      </div>

      {/* ER Bay Readiness Checklist */}
      <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Emergency Bay Status: <strong className="text-emerald-300">{hospital.emergencyBay}</strong></span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Blood Bank: O-Negative Prepped • Cath Lab #2 Ready
        </div>
      </div>
    </div>
  );
};
