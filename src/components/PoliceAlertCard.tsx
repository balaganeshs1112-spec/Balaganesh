import React from 'react';
import { ShieldAlert, Radio, CheckCircle, AlertCircle, Sparkles, RefreshCw, Send, PhoneCall } from 'lucide-react';
import { PoliceUnit } from '../types';

interface PoliceAlertCardProps {
  policeUnits: PoliceUnit[];
  isAlertActive: boolean;
  onDispatchPoliceAlert: () => void;
  onAcknowledgeUnit: (unitId: string) => void;
  broadcastMessage: string | null;
  onGenerateAiBroadcast: () => Promise<void>;
  isGeneratingBroadcast: boolean;
}

export const PoliceAlertCard: React.FC<PoliceAlertCardProps> = ({
  policeUnits,
  isAlertActive,
  onDispatchPoliceAlert,
  onAcknowledgeUnit,
  broadcastMessage,
  onGenerateAiBroadcast,
  isGeneratingBroadcast
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg border ${
              isAlertActive 
                ? 'bg-blue-950/80 border-blue-500/50 text-cyan-400 animate-pulse' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>👮 Traffic Police Emergency Alert</span>
                <span className={`text-[10px] border px-2 py-0.5 rounded font-mono ${
                  isAlertActive ? 'bg-blue-500/20 text-cyan-300 border-cyan-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isAlertActive ? 'DISPATCH BROADCASTING' : 'STANDBY'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Patrol Clearance & Corridor Intercept Management</p>
            </div>
          </div>

          <button
            onClick={onDispatchPoliceAlert}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center space-x-1.5 shadow-md ${
              isAlertActive
                ? 'bg-blue-600 text-white border-blue-400 shadow-blue-900/50'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-400/30'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isAlertActive ? 'Broadcast Resent' : 'Dispatch Police Units'}</span>
          </button>
        </div>

        {/* Radio Broadcast Dispatch Banner */}
        <div className="bg-slate-950/90 p-3 rounded-xl border border-blue-500/30 mb-4 shadow-inner">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
            <span className="flex items-center space-x-1 font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>SETS RADIO DISPATCH — FREQ: 148.25 MHz</span>
            </span>
            <span className="text-[10px] text-slate-400">ENCRYPTED WAVE</span>
          </div>

          <div className="text-xs font-mono text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800 leading-relaxed min-h-[50px] flex items-center">
            {broadcastMessage ? (
              <span>{broadcastMessage}</span>
            ) : (
              <span className="text-slate-500 italic">
                No active police broadcast. Click "Generate AI Broadcast" to construct custom radio dispatch.
              </span>
            )}
          </div>

          <button
            onClick={onGenerateAiBroadcast}
            disabled={isGeneratingBroadcast}
            className="mt-2 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
          >
            {isGeneratingBroadcast ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Generating Radio Dispatch via Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Generate AI Emergency Dispatch Broadcast</span>
              </>
            )}
          </button>
        </div>

        {/* Police Patrol Units List */}
        <div className="space-y-2 mb-4">
          {policeUnits.map((unit) => {
            const isAck = unit.status === 'CORRIDOR_CLEAR' || unit.status === 'ALERTED';

            return (
              <div
                key={unit.id}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`p-1.5 rounded-lg border text-xs font-bold ${
                    isAck ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {unit.unitCode.split(" ")[1]}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <span>{unit.unitCode}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({unit.officerInCharge})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{unit.sector}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right text-[10px] font-mono text-slate-400">
                    <div>{unit.distanceToCorridorKm} km to route</div>
                    <div className={isAck ? 'text-cyan-300 font-bold' : 'text-slate-500'}>{unit.status}</div>
                  </div>

                  <button
                    onClick={() => onAcknowledgeUnit(unit.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      isAck
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {isAck ? '✓ Position Cleared' : 'Clear Lane'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
