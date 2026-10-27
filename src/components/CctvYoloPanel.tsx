import React, { useState } from 'react';
import { Video, Eye, Cpu, AlertTriangle, RefreshCw, Sparkles, Car, Bus, Truck, Bike } from 'lucide-react';
import { CctvCamera } from '../types';

interface CctvYoloPanelProps {
  cameras: CctvCamera[];
  selectedCameraId: string;
  onSelectCamera: (cameraId: string) => void;
  onRunAiCctvScan: (camera: CctvCamera) => Promise<void>;
  isAiAnalyzing: boolean;
  aiReport: string | null;
}

export const CctvYoloPanel: React.FC<CctvYoloPanelProps> = ({
  cameras,
  selectedCameraId,
  onSelectCamera,
  onRunAiCctvScan,
  isAiAnalyzing,
  aiReport
}) => {
  const currentCam = cameras.find(c => c.id === selectedCameraId) || cameras[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm flex flex-col justify-between">
      <div>
        {/* Header & Camera Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>📹 CCTV & YOLO v8 AI Vision Feed</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
                  LIVE 30 FPS
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Autonomous Object Detection & Vehicle Density Count</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
            {cameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => onSelectCamera(cam.id)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  cam.id === selectedCameraId
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cam.name.replace("CCTV Cam #", "CAM ")}
              </button>
            ))}
          </div>
        </div>

        {/* Video Canvas Feed & Bounding Boxes */}
        <div className="relative w-full h-52 sm:h-60 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner mb-4 group">
          {/* Simulated CCTV Camera Background Theme */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentCam.feedImageStyle} opacity-90`} />

          {/* CCTV Grid Lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Camera Info HUD Overlay */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-cyan-300 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800/80 z-10">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold">{currentCam.name}</span>
              <span className="text-slate-400">— {currentCam.location}</span>
            </span>
            <span className="text-slate-400">YOLOv8 CONFIDENCE: 98.4%</span>
          </div>

          {/* YOLO Bounding Boxes Overlay */}
          {currentCam.detectedBoxes.map((box) => (
            <div
              key={box.id}
              className="absolute border-2 rounded transition-all duration-300 pointer-events-none group-hover:scale-[1.02]"
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.width}%`,
                height: `${box.height}%`,
                borderColor: box.color,
                backgroundColor: `${box.color}15`
              }}
            >
              <div
                className="absolute left-0 bottom-full mb-0.5 text-[9px] font-mono font-bold px-1 rounded text-slate-950 whitespace-nowrap shadow"
                style={{ backgroundColor: box.color }}
              >
                {box.label}
              </div>
            </div>
          ))}

          {/* Bottom HUD bar */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800/80">
            <span>DETECTED VEHICLES: <strong className="text-amber-400">{currentCam.totalVehicles}</strong></span>
            <span>DENSITY LEVEL: <strong className={`px-1.5 py-0.2 rounded ${
              currentCam.density === 'HIGH' ? 'bg-red-500/20 text-red-400' : currentCam.density === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
            }`}>{currentCam.density}</strong></span>
          </div>
        </div>

        {/* Object Count Stats Breakdown */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
            <Car className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
            <div className="text-[10px] text-slate-400">Cars</div>
            <div className="text-base font-mono font-bold text-white">{currentCam.cars}</div>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
            <Bus className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <div className="text-[10px] text-slate-400">Buses</div>
            <div className="text-base font-mono font-bold text-white">{currentCam.buses}</div>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
            <Truck className="w-3.5 h-3.5 text-rose-400 mx-auto mb-1" />
            <div className="text-[10px] text-slate-400">Trucks</div>
            <div className="text-base font-mono font-bold text-white">{currentCam.trucks}</div>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
            <Bike className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
            <div className="text-[10px] text-slate-400">Bikes</div>
            <div className="text-base font-mono font-bold text-white">{currentCam.bikes}</div>
          </div>
        </div>
      </div>

      {/* AI Scan Trigger & Report Display */}
      <div>
        <button
          onClick={() => onRunAiCctvScan(currentCam)}
          disabled={isAiAnalyzing}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md border border-cyan-400/30 transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs disabled:opacity-50"
        >
          {isAiAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing CCTV Frame with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Run Gemini AI CCTV Vision Report</span>
            </>
          )}
        </button>

        {aiReport && (
          <div className="mt-3 p-3 bg-slate-950/90 rounded-xl border border-cyan-500/40 text-xs text-slate-300 leading-relaxed shadow-lg">
            <div className="font-bold text-cyan-400 mb-1 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Vision Analysis</span>
            </div>
            <div>{aiReport}</div>
          </div>
        )}
      </div>
    </div>
  );
};
