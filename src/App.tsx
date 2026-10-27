import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { EmergencyStepper } from './components/EmergencyStepper';
import { AmbulanceStatusCard } from './components/AmbulanceStatusCard';
import { GpsTrackingCard } from './components/GpsTrackingCard';
import { CityMapContainer } from './components/CityMapContainer';
import { CctvYoloPanel } from './components/CctvYoloPanel';
import { TrafficSignalController } from './components/TrafficSignalController';
import { PoliceAlertCard } from './components/PoliceAlertCard';
import { HospitalBayCard } from './components/HospitalBayCard';
import { SystemLogsPanel } from './components/SystemLogsPanel';
import { HospitalArrivalModal } from './components/HospitalArrivalModal';

import {
  INITIAL_AMBULANCE,
  INITIAL_ROUTES,
  INITIAL_SIGNALS,
  INITIAL_CCTV_CAMERAS,
  INITIAL_POLICE_UNITS,
  INITIAL_HOSPITALS,
  INITIAL_LOGS
} from './data/mockData';

import {
  AmbulanceTelemetry,
  RouteOption,
  TrafficSignal,
  CctvCamera,
  PoliceUnit,
  Hospital,
  SystemLogEntry,
  EmergencyStageStep
} from './types';

import { audioSynth } from './utils/audioSynth';

export default function App() {
  // State variables
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<EmergencyStageStep>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [useLiveBrowserGps, setUseLiveBrowserGps] = useState<boolean>(false);

  const [telemetry, setTelemetry] = useState<AmbulanceTelemetry>(INITIAL_AMBULANCE);
  const [routes, setRoutes] = useState<RouteOption[]>(INITIAL_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("route-c");
  const [signals, setSignals] = useState<TrafficSignal[]>(INITIAL_SIGNALS);
  const [cameras, setCameras] = useState<CctvCamera[]>(INITIAL_CCTV_CAMERAS);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("cctv-1");
  const [policeUnits, setPoliceUnits] = useState<PoliceUnit[]>(INITIAL_POLICE_UNITS);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [logs, setLogs] = useState<SystemLogEntry[]>(INITIAL_LOGS);

  // AI states
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);
  const [isGeneratingBroadcast, setIsGeneratingBroadcast] = useState<boolean>(false);
  const [showArrivalModal, setShowArrivalModal] = useState<boolean>(false);

  // Log helper
  const addLog = (category: SystemLogEntry['category'], message: string, statusType: SystemLogEntry['statusType'] = 'info') => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newEntry: SystemLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: timeStr,
      category,
      message,
      statusType
    };
    setLogs(prev => [newEntry, ...prev]);
  };

  // Browser Geolocation Effect
  useEffect(() => {
    let watchId: number | null = null;
    if (useLiveBrowserGps && navigator.geolocation) {
      addLog('GPS', 'Connected to real browser GPS sensor stream.', 'success');
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setTelemetry(prev => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            currentSpeedKmH: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : prev.currentSpeedKmH
          }));
        },
        (err) => {
          addLog('GPS', `Browser GPS error: ${err.message}. Falling back to SETS simulator GPS.`, 'warning');
          setUseLiveBrowserGps(false);
        },
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [useLiveBrowserGps]);

  // Main Emergency Simulation Pipeline & Timer Loop
  useEffect(() => {
    if (!isEmergencyActive || isPaused) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        if (prev.status !== 'EMERGENCY') return prev;

        // Advance ambulance progress
        const stepIncrement = 1.8 * speedMultiplier;
        const newProgress = Math.min(100, prev.progressPct + stepIncrement);
        const newRemainingKm = Math.max(0, 6.8 * (1 - newProgress / 100));
        const newEtaSeconds = Math.max(0, Math.round(newRemainingKm * 60));
        const currentSpeed = newProgress >= 100 ? 0 : 58 + Math.floor(Math.sin(newProgress) * 8);

        // Calculate continuous simulated Lat/Lng along selected route C
        const latBase = 12.9716;
        const lngBase = 77.5946;
        const latTarget = 13.0010;
        const lngTarget = 77.6320;

        const currentLat = latBase + (latTarget - latBase) * (newProgress / 100);
        const currentLng = lngBase + (lngTarget - lngBase) * (newProgress / 100);

        // Step progression triggers based on progress
        if (newProgress < 10) {
          if (currentStep !== 2) {
            setCurrentStep(2);
            addLog('GPS', 'GPS tracking locked onto vehicle AMB-902 at 58 km/h.', 'info');
          }
        } else if (newProgress >= 10 && newProgress < 25) {
          if (currentStep !== 3) {
            setCurrentStep(3);
            addLog('YOLO', 'YOLO v8 AI Computer Vision active across Junctions 1-4.', 'success');
          }
        } else if (newProgress >= 25 && newProgress < 40) {
          if (currentStep !== 4) {
            setCurrentStep(4);
            addLog('ROUTE', 'Traffic Density Evaluated: Route C Bypass selected (Low 22% density).', 'info');
          }
        } else if (newProgress >= 40 && newProgress < 55) {
          if (currentStep !== 6) {
            setCurrentStep(6);
            // Engage Green Wave Priority for Signals
            setSignals(sigs => sigs.map(s => ({ ...s, state: 'EMERGENCY_GREEN', isEmergencyPriority: true })));
            audioSynth.playGreenWaveChime();
            addLog('SIGNAL', '🟢 GREEN priority wave engaged along Route C Corridor.', 'success');
          }
        } else if (newProgress >= 55 && newProgress < 75) {
          if (currentStep !== 7) {
            setCurrentStep(7);
            setPoliceUnits(p => p.map(u => ({ ...u, status: 'CORRIDOR_CLEAR' })));
            addLog('POLICE', '👮 Traffic Police Patrol Units cleared cross-traffic at Ring Road.', 'success');
          }
        } else if (newProgress >= 75 && newProgress < 99) {
          if (currentStep !== 8) {
            setCurrentStep(8);
            addLog('GPS', 'Ambulance in final approach corridor to City General Hospital.', 'info');
          }
        } else if (newProgress >= 100) {
          // Reached destination!
          setCurrentStep(9);
          setShowArrivalModal(true);
          addLog('HOSPITAL', '🏥 AMBULANCE ARRIVED AT CITY GENERAL EMERGENCY TRAUMA BAY!', 'success');
          
          // Restore normal signal cycles after arrival (Step 10)
          setTimeout(() => {
            setCurrentStep(10);
            setSignals(sigs => sigs.map(s => ({ ...s, state: 'GREEN', isEmergencyPriority: false })));
            addLog('SIGNAL', '🚦 Green Corridor cleared. Normal traffic signal cycles restored.', 'info');
          }, 3000);

          return {
            ...prev,
            status: 'ARRIVED',
            progressPct: 100,
            distanceRemainingKm: 0,
            etaSeconds: 0,
            currentSpeedKmH: 0
          };
        }

        return {
          ...prev,
          progressPct: newProgress,
          distanceRemainingKm: newRemainingKm,
          etaSeconds: newEtaSeconds,
          currentSpeedKmH: currentSpeed,
          lat: currentLat,
          lng: currentLng
        };
      });

      // Countdown traffic signals
      setSignals(prevSigs =>
        prevSigs.map(sig => ({
          ...sig,
          countdownSec: sig.countdownSec > 1 ? sig.countdownSec - 1 : sig.normalCycleSec
        }))
      );

    }, 1000);

    return () => clearInterval(interval);
  }, [isEmergencyActive, isPaused, speedMultiplier, currentStep]);

  // Trigger Emergency Start
  const handleStartEmergency = () => {
    setIsEmergencyActive(true);
    setIsPaused(false);
    setCurrentStep(1);
    audioSynth.playEmergencyChime();
    audioSynth.startSiren();

    setTelemetry({
      ...INITIAL_AMBULANCE,
      status: 'EMERGENCY',
      currentSpeedKmH: 52,
      progressPct: 2
    });

    // Auto green priority on route C
    setSignals(sigs =>
      sigs.map((s, idx) => idx < 3 ? { ...s, state: 'EMERGENCY_GREEN', isEmergencyPriority: true } : s)
    );

    addLog('EMERGENCY', '🚑 SOS DISPATCH ACTIVATED: Code Red Emergency Wave Initiated!', 'warning');
    addLog('GPS', 'Live GPS stream connected to AMB-SETS-902.', 'info');
  };

  // Reset Simulation
  const handleResetSimulation = () => {
    setIsEmergencyActive(false);
    setIsPaused(false);
    setCurrentStep(1);
    setShowArrivalModal(false);
    audioSynth.stopSiren();

    setTelemetry(INITIAL_AMBULANCE);
    setSignals(INITIAL_SIGNALS);
    setPoliceUnits(INITIAL_POLICE_UNITS);
    setBroadcastMessage(null);
    setAiReport(null);

    addLog('SYSTEM', 'SETS System reset to Normal Standby State.', 'info');
  };

  // Manual Step Selection (For presentation & demo flexibility)
  const handleSelectStep = (step: EmergencyStageStep) => {
    setCurrentStep(step);
    if (!isEmergencyActive && step > 1) {
      setIsEmergencyActive(true);
      setTelemetry(prev => ({ ...prev, status: 'EMERGENCY' }));
    }

    if (step === 6) {
      setSignals(sigs => sigs.map(s => ({ ...s, state: 'EMERGENCY_GREEN', isEmergencyPriority: true })));
      audioSynth.playGreenWaveChime();
      addLog('SIGNAL', 'Manual Trigger: Green Priority Wave engaged across all signals.', 'success');
    } else if (step === 7) {
      handleDispatchPoliceAlert();
    } else if (step === 9) {
      setShowArrivalModal(true);
      setTelemetry(prev => ({ ...prev, progressPct: 100, distanceRemainingKm: 0, etaSeconds: 0, status: 'ARRIVED' }));
    }
  };

  // AI CCTV Scan API
  const handleRunAiCctvScan = async (camera: CctvCamera) => {
    setIsAiAnalyzing(true);
    setAiReport(null);

    try {
      const response = await fetch('/api/ai/cctv-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          junctionName: camera.location,
          vehicleCounts: {
            total: camera.totalVehicles,
            cars: camera.cars,
            buses: camera.buses,
            trucks: camera.trucks,
            bikes: camera.bikes
          },
          trafficDensity: camera.density
        })
      });

      const data = await response.json();
      if (data.success) {
        setAiReport(data.aiAnalysis);
        addLog('YOLO', `Gemini AI Scan for ${camera.name}: ${data.aiAnalysis.substring(0, 80)}...`, 'success');
      } else {
        setAiReport("YOLO AI Scan: Congestion detected. Priority clearance recommended.");
      }
    } catch (e) {
      setAiReport("YOLO Vision Scan complete: High-confidence vehicle bounding boxes rendered. Maintain Green Wave priority.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // AI Police Radio Broadcast API
  const handleGenerateAiBroadcast = async () => {
    setIsGeneratingBroadcast(true);

    try {
      const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[2];
      const targetHospital = hospitals[0];

      const response = await fetch('/api/ai/police-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ambulanceId: telemetry.vehicleId,
          routeName: selectedRoute.name,
          hospitalName: targetHospital.name,
          currentSpeed: telemetry.currentSpeedKmH || 62,
          etaMinutes: Math.ceil(telemetry.etaSeconds / 60) || 7
        })
      });

      const data = await response.json();
      if (data.success && data.broadcastMessage) {
        setBroadcastMessage(data.broadcastMessage);
        addLog('POLICE', `Radio Broadcast Generated: ${data.broadcastMessage}`, 'success');
      }
    } catch (e) {
      setBroadcastMessage(`🚨 ALL UNITS DISPATCH: Code Red priority wave for ${telemetry.vehicleId} along Outer Ring Bypass. Clear all cross-junctions immediately!`);
    } finally {
      setIsGeneratingBroadcast(false);
    }
  };

  // Dispatch Police Alert
  const handleDispatchPoliceAlert = () => {
    setPoliceUnits(units =>
      units.map(u => ({
        ...u,
        status: 'CORRIDOR_CLEAR',
        acknowledgementTime: new Date().toLocaleTimeString()
      }))
    );
    if (!broadcastMessage) {
      handleGenerateAiBroadcast();
    }
    audioSynth.playBeep(880, 200, 'square');
    addLog('POLICE', '🚨 All Traffic Police Patrol Units notified & acknowledged corridor clearance.', 'success');
  };

  // Toggle Signal Priority
  const handleToggleSignalPriority = (signalId: string) => {
    setSignals(sigs =>
      sigs.map(s => {
        if (s.id === signalId) {
          const isNowPriority = !s.isEmergencyPriority;
          return {
            ...s,
            isEmergencyPriority: isNowPriority,
            state: isNowPriority ? 'EMERGENCY_GREEN' : 'RED'
          };
        }
        return s;
      })
    );
    addLog('SIGNAL', `Signal ${signalId} priority state toggled manually.`, 'info');
  };

  // Override All Green Corridor
  const handleOverrideAllGreen = () => {
    setSignals(sigs => sigs.map(s => ({ ...s, state: 'EMERGENCY_GREEN', isEmergencyPriority: true })));
    audioSynth.playGreenWaveChime();
    addLog('SIGNAL', '⚡ ALL GREEN Priority Wave override engaged across entire city grid.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Main Navigation Bar */}
      <Header
        isEmergencyActive={isEmergencyActive}
        currentStep={currentStep}
        onStartEmergency={handleStartEmergency}
        onResetSimulation={handleResetSimulation}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        isMuted={isMuted}
        onToggleMute={() => {
          const nextMuted = !isMuted;
          setIsMuted(nextMuted);
          audioSynth.setMuted(nextMuted);
        }}
      />

      {/* 10-Step Sequential Flow Stepper */}
      <EmergencyStepper
        currentStep={currentStep}
        onSelectStep={handleSelectStep}
        isEmergencyActive={isEmergencyActive}
      />

      {/* Dashboard Main Grid Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Row: Ambulance Telemetry + Live GPS Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AmbulanceStatusCard
            telemetry={telemetry}
            onTriggerEmergency={handleStartEmergency}
            onResetEmergency={handleResetSimulation}
            speedMultiplier={speedMultiplier}
            onChangeSpeedMultiplier={setSpeedMultiplier}
          />

          <GpsTrackingCard
            telemetry={telemetry}
            useLiveBrowserGps={useLiveBrowserGps}
            onToggleLiveBrowserGps={() => setUseLiveBrowserGps(!useLiveBrowserGps)}
          />
        </div>

        {/* Centerpiece: Interactive City Map & Green Corridor Navigation */}
        <CityMapContainer
          routes={routes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={(rtId) => {
            setSelectedRouteId(rtId);
            addLog('ROUTE', `Route switched to ${rtId.toUpperCase()}.`, 'info');
          }}
          signals={signals}
          policeUnits={policeUnits}
          hospitals={hospitals}
          telemetry={telemetry}
          isEmergencyActive={isEmergencyActive}
          onSelectSignal={handleToggleSignalPriority}
        />

        {/* Third Row: CCTV YOLO Vision + Smart Traffic Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CctvYoloPanel
            cameras={cameras}
            selectedCameraId={selectedCameraId}
            onSelectCamera={setSelectedCameraId}
            onRunAiCctvScan={handleRunAiCctvScan}
            isAiAnalyzing={isAiAnalyzing}
            aiReport={aiReport}
          />

          <TrafficSignalController
            signals={signals}
            onToggleSignalPriority={handleToggleSignalPriority}
            isEmergencyActive={isEmergencyActive}
            onOverrideAllGreen={handleOverrideAllGreen}
            onResetSignals={() => setSignals(INITIAL_SIGNALS)}
          />
        </div>

        {/* Fourth Row: Police Emergency Alerts + Hospital Preparedness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PoliceAlertCard
            policeUnits={policeUnits}
            isAlertActive={isEmergencyActive}
            onDispatchPoliceAlert={handleDispatchPoliceAlert}
            onAcknowledgeUnit={(unitId) => {
              setPoliceUnits(units =>
                units.map(u => u.id === unitId ? { ...u, status: 'CORRIDOR_CLEAR' } : u)
              );
              addLog('POLICE', `Unit ${unitId} acknowledged position clear.`, 'success');
            }}
            broadcastMessage={broadcastMessage}
            onGenerateAiBroadcast={handleGenerateAiBroadcast}
            isGeneratingBroadcast={isGeneratingBroadcast}
          />

          <HospitalBayCard
            hospital={hospitals[0]}
            isArrived={telemetry.status === 'ARRIVED'}
            etaSeconds={telemetry.etaSeconds}
          />
        </div>

        {/* Bottom Row: SETS System Audit Log & Analytics */}
        <SystemLogsPanel
          logs={logs}
          onClearLogs={() => setLogs([])}
          isEmergencyActive={isEmergencyActive}
          totalTimeSavedMin={11}
          signalsClearedCount={4}
        />

      </main>

      {/* Hospital Arrival Confirmation Modal */}
      <HospitalArrivalModal
        isOpen={showArrivalModal}
        onClose={handleResetSimulation}
        telemetry={telemetry}
        hospital={hospitals[0]}
        totalTimeSavedMin={11}
      />

    </div>
  );
}
