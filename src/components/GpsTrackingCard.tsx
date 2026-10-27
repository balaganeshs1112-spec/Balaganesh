import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Gauge, Clock, Radio, CheckCircle, Smartphone } from 'lucide-react';
import { AmbulanceTelemetry } from '../types';

interface GpsTrackingCardProps {
  telemetry: AmbulanceTelemetry;
  useLiveBrowserGps: boolean;
  onToggleLiveBrowserGps: () => void;
}

export const GpsTrackingCard: React.FC<GpsTrackingCardProps> = ({
  telemetry,
  useLiveBrowserGps,
  onToggleLiveBrowserGps
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <MapPin className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">📍 GPS Live Geolocation</h3>
              <p className="text-[11px] text-slate-400">High-Precision Telematics Node</p>
            </div>
          </div>

          <button
            onClick={onToggleLiveBrowserGps}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center space-x-1 ${
              useLiveBrowserGps
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle between Browser GPS sensor and SETS City Simulator GPS"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{useLiveBrowserGps ? 'Browser GPS' : 'SETS Simulator'}</span>
          </button>
        </div>

        {/* GPS Coordinates Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Latitude</div>
            <div className="text-sm font-mono font-bold text-cyan-300">
              {telemetry.lat.toFixed(6)}° N
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Longitude</div>
            <div className="text-sm font-mono font-bold text-cyan-300">
              {telemetry.lng.toFixed(6)}° E
            </div>
          </div>
        </div>

        {/* Speed & Heading Telemetry */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
              <Gauge className="w-3 h-3 text-emerald-400" />
              <span>Speed</span>
            </div>
            <div className="text-xl font-mono font-bold text-emerald-400">
              {telemetry.currentSpeedKmH} <span className="text-[10px] font-sans font-normal text-slate-400">km/h</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>Heading</span>
            </div>
            <div className="text-xl font-mono font-bold text-cyan-300">
              {telemetry.headingDeg}° <span className="text-[10px] font-sans font-normal text-slate-400">NE</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>ETA</span>
            </div>
            <div className="text-xl font-mono font-bold text-amber-300">
              {Math.floor(telemetry.etaSeconds / 60)}m {telemetry.etaSeconds % 60}s
            </div>
          </div>
        </div>
      </div>

      {/* Corridor Navigation Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
          <span className="flex items-center space-x-1">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>Route Navigation Progress</span>
          </span>
          <span className="font-mono text-cyan-400">{telemetry.progressPct.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-300 shadow-sm shadow-cyan-500/50"
            style={{ width: `${Math.min(100, Math.max(0, telemetry.progressPct))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
          <span>Start Node</span>
          <span>{telemetry.distanceRemainingKm.toFixed(1)} km remaining</span>
          <span>City Hospital</span>
        </div>
      </div>
    </div>
  );
};
