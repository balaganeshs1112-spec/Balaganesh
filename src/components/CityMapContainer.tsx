import React, { useState } from 'react';
import {
  MapPin,
  Siren,
  Hospital as HospitalIcon,
  Shield,
  TrafficCone,
  Layers,
  ZoomIn,
  ZoomOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  RouteOption,
  TrafficSignal,
  PoliceUnit,
  Hospital,
  AmbulanceTelemetry
} from '../types';

interface CityMapContainerProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  signals: TrafficSignal[];
  policeUnits: PoliceUnit[];
  hospitals: Hospital[];
  telemetry: AmbulanceTelemetry;
  isEmergencyActive: boolean;
  onSelectSignal: (signalId: string) => void;
}

export const CityMapContainer: React.FC<CityMapContainerProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  signals,
  policeUnits,
  hospitals,
  telemetry,
  isEmergencyActive,
  onSelectSignal
}) => {
  const [mapMode, setMapMode] = useState<'grid' | 'tactical'>('tactical');
  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[2];

  // Calculate ambulance position on map (x, y percentages) along path coordinates of selected route
  const getAmbulanceMapPos = () => {
    const path = selectedRoute.pathCoordinates;
    if (!path || path.length < 2) return { x: 10, y: 80 };

    const totalSegments = path.length - 1;
    const progress = Math.min(100, Math.max(0, telemetry.progressPct)) / 100;
    const scaledProgress = progress * totalSegments;

    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentProgress = scaledProgress - segmentIndex;

    const p1 = path[segmentIndex];
    const p2 = path[segmentIndex + 1];

    const currentX = p1.x + (p2.x - p1.x) * segmentProgress;
    const currentY = p1.y + (p2.y - p1.y) * segmentProgress;

    return { x: currentX, y: currentY };
  };

  const ambulancePos = getAmbulanceMapPos();

  // Convert SVG coordinates to path string
  const getPathString = (coords: { x: number; y: number }[]) => {
    if (!coords || coords.length === 0) return "";
    return coords.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, "");
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col h-full">
      
      {/* Map Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>🗺️ SETS Live City Corridor Map</span>
              {isEmergencyActive && (
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono animate-pulse">
                  GREEN CORRIDOR LIVE
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive Signal Priority, Ambulance Navigation & Hospital Routes
            </p>
          </div>
        </div>

        {/* Map View Toggle & Layer Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMapMode(mapMode === 'tactical' ? 'grid' : 'tactical')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all flex items-center space-x-1 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{mapMode === 'tactical' ? 'Tactical HUD' : 'Standard Grid'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner group">
        
        {/* Tactical Grid Overlay Background */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            mapMode === 'tactical' ? 'opacity-30' : 'opacity-10'
          }`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 80%),
              linear-gradient(to right, rgba(51, 65, 85, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(51, 65, 85, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 30px 30px, 30px 30px'
          }}
        />

        {/* Simulated Map Features (River, Parks, City Blocks) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* River */}
          <path d="M 0 45 Q 30 50, 50 35 T 100 40" fill="none" stroke="#0284c7" strokeWidth="3" opacity="0.25" strokeDasharray="2 1" />
          
          {/* City District Boundaries */}
          <rect x="5" y="5" width="25" height="20" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" rx="1" opacity="0.6" />
          <text x="7" y="10" fill="#475569" fontSize="2.5" fontFamily="sans-serif">WEST SECTOR</text>

          <rect x="35" y="5" width="30" height="25" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" rx="1" opacity="0.6" />
          <text x="37" y="10" fill="#475569" fontSize="2.5" fontFamily="sans-serif">TECH PARK CORRIDOR</text>

          <rect x="70" y="5" width="25" height="30" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" rx="1" opacity="0.6" />
          <text x="72" y="10" fill="#475569" fontSize="2.5" fontFamily="sans-serif">NORTH MEDICAL HUB</text>
        </svg>

        {/* Interactive SVG Routes Layer */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Unselected Alternative Routes */}
          {routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            if (isSelected) return null; // Render selected route last on top

            return (
              <g key={route.id} className="cursor-pointer hover:opacity-100 opacity-60 transition-opacity" onClick={() => onSelectRoute(route.id)}>
                <path
                  d={getPathString(route.pathCoordinates)}
                  fill="none"
                  stroke={route.color}
                  strokeWidth="1.2"
                  strokeDasharray="2 1"
                />
              </g>
            );
          })}

          {/* Render Active Selected Route with Emergency Wave Glow */}
          {selectedRoute && (
            <g>
              {/* Outer Glow Effect */}
              {isEmergencyActive && (
                <path
                  d={getPathString(selectedRoute.pathCoordinates)}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  opacity="0.5"
                  filter="url(#greenGlow)"
                  className="animate-pulse"
                />
              )}

              {/* Main Corridor Line */}
              <path
                d={getPathString(selectedRoute.pathCoordinates)}
                fill="none"
                stroke={isEmergencyActive ? "#10b981" : selectedRoute.color}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dynamic Animated Pulse Along Route */}
              {isEmergencyActive && (
                <path
                  d={getPathString(selectedRoute.pathCoordinates)}
                  fill="none"
                  stroke="#a7f3d0"
                  strokeWidth="2.2"
                  strokeDasharray="3 6"
                  className="animate-dash"
                  style={{
                    animation: 'dash 1.5s linear infinite'
                  }}
                />
              )}
            </g>
          )}
        </svg>

        {/* Traffic Signals Layer */}
        {signals.map((sig) => {
          const isEmergencyGreen = sig.isEmergencyPriority || sig.state === 'EMERGENCY_GREEN';

          return (
            <div
              key={sig.id}
              onClick={() => onSelectSignal(sig.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/sig z-20"
              style={{ left: `${sig.x}%`, top: `${sig.y}%` }}
            >
              <div className={`p-1.5 rounded-full border shadow-lg transition-all duration-300 flex items-center justify-center ${
                isEmergencyGreen
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300 ring-4 ring-emerald-500/30 scale-125'
                  : sig.state === 'RED'
                  ? 'bg-red-950 border-red-500 text-red-400'
                  : sig.state === 'AMBER'
                  ? 'bg-amber-950 border-amber-500 text-amber-400'
                  : 'bg-emerald-950 border-emerald-500 text-emerald-400'
              }`}>
                <TrafficCone className="w-3.5 h-3.5" />
              </div>

              {/* Signal Tooltip on Hover or Emergency Active */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover/sig:block z-30 pointer-events-none whitespace-nowrap">
                <div className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[10px] text-white shadow-xl">
                  <div className="font-bold">{sig.junctionName}</div>
                  <div className="flex items-center space-x-1 font-mono text-[9px] text-slate-300">
                    <span>STATE:</span>
                    <span className={isEmergencyGreen ? 'text-emerald-400 font-bold' : 'text-amber-300'}>
                      {sig.state}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Police Patrol Units Layer */}
        {policeUnits.map((pol) => (
          <div
            key={pol.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            style={{ left: `${30 + (pol.distanceToCorridorKm * 20)}%`, top: `${45 + (pol.distanceToCorridorKm * 10)}%` }}
          >
            <div className={`p-1 rounded-full border shadow-md ${
              pol.status === 'ALERTED' || pol.status === 'CORRIDOR_CLEAR'
                ? 'bg-blue-900 border-blue-400 text-cyan-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <Shield className="w-3 h-3" />
            </div>
          </div>
        ))}

        {/* Target Hospitals Layer */}
        {hospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/hosp cursor-pointer"
            style={{ left: `${hosp.x}%`, top: `${hosp.y}%` }}
          >
            <div className="p-2 rounded-xl bg-emerald-950 border-2 border-emerald-400 text-emerald-300 shadow-xl shadow-emerald-950/80 flex items-center justify-center animate-bounce">
              <HospitalIcon className="w-5 h-5" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-slate-900/90 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 whitespace-nowrap shadow-lg">
              {hosp.name.split(" ")[0]} ER
            </div>
          </div>
        ))}

        {/* Moving Ambulance Marker Layer */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 ease-linear"
          style={{ left: `${ambulancePos.x}%`, top: `${ambulancePos.y}%` }}
        >
          {/* Radar Pulse Wave */}
          {isEmergencyActive && (
            <div className="absolute inset-0 -m-3 rounded-full bg-red-500/30 animate-ping" />
          )}

          <div className={`p-2.5 rounded-xl border shadow-2xl flex items-center justify-center transition-transform ${
            isEmergencyActive
              ? 'bg-gradient-to-r from-red-600 to-rose-600 border-white text-white shadow-red-500/80 scale-125'
              : 'bg-slate-800 border-slate-600 text-slate-300'
          }`}>
            <Siren className={`w-5 h-5 ${isEmergencyActive ? 'animate-spin' : ''}`} />
          </div>

          {/* Ambulance Label Badge */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 bg-red-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap border border-white/20 flex items-center space-x-1">
            <span>AMB-902</span>
            {isEmergencyActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
          </div>
        </div>

      </div>

      {/* Map Legend & Route Switcher Controls */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
        {routes.map((rt) => {
          const isSelected = rt.id === selectedRouteId;
          return (
            <button
              key={rt.id}
              onClick={() => onSelectRoute(rt.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rt.color }} />
                  <span className="truncate">{rt.name}</span>
                </span>
                {rt.isRecommended && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    BEST ROUTE
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Dist: {rt.distanceKm} km</span>
                <span>Congestion: {rt.congestionScore}%</span>
                <span>Signals: {rt.signalsCount}</span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
