export type TrafficDensity = 'LOW' | 'MEDIUM' | 'HIGH';

export type SignalState = 'RED' | 'AMBER' | 'GREEN' | 'EMERGENCY_GREEN';

export type EmergencyStageStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface EmergencyStageInfo {
  step: EmergencyStageStep;
  title: string;
  subtitle: string;
  iconName: string;
}

export interface AmbulanceTelemetry {
  status: 'NORMAL' | 'EMERGENCY' | 'ARRIVED';
  patientName: string;
  age: number;
  condition: string; // e.g., "Acute Cardiac Arrest", "Severe Trauma"
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'STABLE';
  heartRate: number;
  spO2: number;
  bloodPressure: string;
  driverName: string;
  vehicleId: string;
  currentSpeedKmH: number;
  lat: number;
  lng: number;
  headingDeg: number;
  progressPct: number; // 0 to 100 along selected route
  distanceRemainingKm: number;
  etaSeconds: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  baseTimeMin: number;
  currentDensity: TrafficDensity;
  congestionScore: number; // 0-100%
  signalsCount: number;
  pathCoordinates: Point2D[];
  geoPoints: { lat: number; lng: number }[];
  isRecommended: boolean;
  color: string;
  reason: string;
}

export interface TrafficSignal {
  id: string;
  junctionName: string;
  locationName: string;
  x: number;
  y: number;
  state: SignalState;
  isEmergencyPriority: boolean;
  countdownSec: number;
  normalCycleSec: number;
  lastPassedAt?: number;
}

export interface YoloDetectionBox {
  id: string;
  label: string;
  confidence: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  color: string;
}

export interface CctvCamera {
  id: string;
  name: string;
  location: string;
  junctionId: string;
  totalVehicles: number;
  cars: number;
  buses: number;
  trucks: number;
  bikes: number;
  density: TrafficDensity;
  detectedBoxes: YoloDetectionBox[];
  feedImageStyle: string; // CSS canvas or gradient theme
}

export interface PoliceUnit {
  id: string;
  unitCode: string;
  officerInCharge: string;
  sector: string;
  status: 'PATROLLING' | 'ALERTED' | 'EN_ROUTE' | 'CORRIDOR_CLEAR';
  distanceToCorridorKm: number;
  radioFreq: string;
  badgeNumber: string;
  acknowledgementTime?: string;
}

export interface Hospital {
  id: string;
  name: string;
  locationName: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  totalIcuBeds: number;
  availableIcuBeds: number;
  traumaTeamStatus: 'STANDBY' | 'MOBILIZED' | 'BAY_READY';
  doctorAssigned: string;
  contactNumber: string;
  emergencyBay: string;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  category: 'EMERGENCY' | 'GPS' | 'YOLO' | 'ROUTE' | 'SIGNAL' | 'POLICE' | 'HOSPITAL' | 'SYSTEM';
  message: string;
  statusType: 'info' | 'success' | 'warning' | 'error';
}
