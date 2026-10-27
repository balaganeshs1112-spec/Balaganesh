import React, { useState } from 'react';
import { Terminal, Shield, Clock, TrendingUp, CheckCircle2, Download, Trash2, Search } from 'lucide-react';
import { SystemLogEntry } from '../types';

interface SystemLogsPanelProps {
  logs: SystemLogEntry[];
  onClearLogs: () => void;
  isEmergencyActive: boolean;
  totalTimeSavedMin: number;
  signalsClearedCount: number;
}

export const SystemLogsPanel: React.FC<SystemLogsPanelProps> = ({
  logs,
  onClearLogs,
  isEmergencyActive,
  totalTimeSavedMin,
  signalsClearedCount
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    if (filterCategory === 'ALL') return true;
    return log.category === filterCategory;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>📊 SETS System Audit Logs & Performance Analytics</span>
            </h3>
            <p className="text-[11px] text-slate-400">Real-Time Event Timeline & Response Speed Optimization</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Event Categories</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="GPS">GPS Telematics</option>
            <option value="YOLO">YOLO Vision</option>
            <option value="ROUTE">Route AI</option>
            <option value="SIGNAL">Traffic Signals</option>
            <option value="POLICE">Police Alert</option>
            <option value="HOSPITAL">Hospital ER</option>
          </select>

          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Clear Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SETS Performance Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Transit Time Saved</div>
          <div className="text-xl font-mono font-bold text-emerald-400">
            {totalTimeSavedMin} <span className="text-xs font-sans text-slate-400">mins (~62% faster)</span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Signals Cleared</div>
          <div className="text-xl font-mono font-bold text-cyan-400">
            {signalsClearedCount} <span className="text-xs font-sans text-slate-400">Green Priority</span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">YOLO AI Vision Acc.</div>
          <div className="text-xl font-mono font-bold text-amber-400">
            98.4% <span className="text-xs font-sans text-slate-400">Detection</span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Police Intercepts</div>
          <div className="text-xl font-mono font-bold text-blue-400">
            3 Units <span className="text-xs font-sans text-slate-400">Dispatched</span>
          </div>
        </div>
      </div>

      {/* Log Console Window */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 max-h-56 overflow-y-auto font-mono text-xs space-y-2 scrollbar-thin scrollbar-thumb-slate-700 shadow-inner">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 text-center py-6">No event logs recorded for selected category.</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2 border-b border-slate-900/80 pb-1.5 last:border-none">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded shrink-0 uppercase ${
                log.category === 'EMERGENCY' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                log.category === 'SIGNAL' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                log.category === 'YOLO' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                log.category === 'POLICE' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-slate-800 text-slate-300'
              }`}>
                {log.category}
              </span>
              <span className="text-slate-300 leading-snug">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
