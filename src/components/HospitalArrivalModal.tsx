import React from 'react';
import { Hospital, CheckCircle2, Siren, Clock, ShieldCheck, Heart, RotateCcw } from 'lucide-react';
import { AmbulanceTelemetry, Hospital as HospitalType } from '../types';

interface HospitalArrivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: AmbulanceTelemetry;
  hospital: HospitalType;
  totalTimeSavedMin: number;
}

export const HospitalArrivalModal: React.FC<HospitalArrivalModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  hospital,
  totalTimeSavedMin
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-emerald-950/80 text-white relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/80 mb-3 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-xl font-bold bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
            Ambulance Emergency Mission Successful
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Destination Reached • Green Wave Corridor Deactivated • Patient Safely Handed Over
          </p>
        </div>

        {/* Arrival Summary Details */}
        <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400">Destination ER:</span>
            <span className="font-bold text-emerald-400">{hospital.name}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400">Patient Triage:</span>
            <span className="font-semibold text-slate-200">{telemetry.patientName} ({telemetry.condition})</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400">Assigned ER Bay & Doctor:</span>
            <span className="font-semibold text-cyan-300">{hospital.emergencyBay} — {hospital.doctorAssigned}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Emergency Transit Time Saved:</span>
            <span className="font-bold text-amber-400 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalTimeSavedMin} Minutes (~62% Faster)</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg border border-emerald-400/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset SETS System for Next Mission</span>
        </button>
      </div>
    </div>
  );
};
