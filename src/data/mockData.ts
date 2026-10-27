import {
  EmergencyStageInfo,
  RouteOption,
  TrafficSignal,
  CctvCamera,
  PoliceUnit,
  Hospital,
  AmbulanceTelemetry,
  SystemLogEntry
} from '../types';

export const EMERGENCY_STAGES: EmergencyStageInfo[] = [
  { step: 1, title: "Ambulance Emergency Starts", subtitle: "SOS Alert Received & Patient Triage Initialized", iconName: "Siren" },
  { step: 2, title: "GPS Tracking Active", subtitle: "Real-time Vehicle Geolocation & Speed Telemetry Lock", iconName: "MapPin" },
  { step: 3, title: "AI CCTV Monitoring", subtitle: "YOLO Computer Vision Vehicle Detection & Counting", iconName: "Video" },
  { step: 4, title: "Traffic Analysis", subtitle: "Junction Density Classification (Low / Medium / High)", iconName: "BarChart3" },
  { step: 5, title: "Route Selection", subtitle: "SETS Autonomous Optimal Emergency Path Selection", iconName: "Route" },
  { step: 6, title: "Traffic Signal Control", subtitle: "Green Priority Wave Active (Corridor Red Override)", iconName: "TrafficCone" },
  { step: 7, title: "Traffic Police Alert", subtitle: "Automatic Patrol Dispatch & Radio Broadcast", iconName: "ShieldAlert" },
  { step: 8, title: "Moving Simulation", subtitle: "Ambulance Navigating Priority Green Wave Corridor", iconName: "Navigation" },
  { step: 9, title: "Hospital Detection", subtitle: "Arrival at ER Bay & Medical Team Handoff", iconName: "Hospital" },
  { step: 10, title: "Normal Traffic Restored", subtitle: "Automatic Signal Cycle Reset & Corridor Deactivation", iconName: "CheckCircle2" }
];

export const INITIAL_AMBULANCE: AmbulanceTelemetry = {
  status: 'NORMAL',
  patientName: "Vikram Sharma",
  age: 54,
  condition: "Severe Acute Myocardial Infarction",
  urgencyLevel: 'CRITICAL',
  heartRate: 118,
  spO2: 92,
  bloodPressure: "155/98",
  driverName: "Officer K. Ramesh",
  vehicleId: "AMB-SETS-902",
  currentSpeedKmH: 0,
  lat: 12.9716,
  lng: 77.5946,
  headingDeg: 45,
  progressPct: 0,
  distanceRemainingKm: 6.8,
  etaSeconds: 420
};

export const INITIAL_ROUTES: RouteOption[] = [
  {
    id: "route-a",
    name: "Route A — Central Expressway",
    distanceKm: 7.4,
    baseTimeMin: 18,
    currentDensity: "HIGH",
    congestionScore: 84,
    signalsCount: 6,
    isRecommended: false,
    color: "#ef4444", // Red
    reason: "Heavy congestion around Central Junction (84% gridlock). 6 active signal stops.",
    pathCoordinates: [
      { x: 10, y: 80 },
      { x: 25, y: 75 },
      { x: 45, y: 60 },
      { x: 60, y: 50 },
      { x: 75, y: 35 },
      { x: 90, y: 20 }
    ],
    geoPoints: [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9745, lng: 77.6010 },
      { lat: 12.9810, lng: 77.6100 },
      { lat: 12.9880, lng: 77.6180 },
      { lat: 12.9940, lng: 77.6250 },
      { lat: 13.0010, lng: 77.6320 }
    ]
  },
  {
    id: "route-b",
    name: "Route B — Commercial Avenue",
    distanceKm: 5.8,
    baseTimeMin: 14,
    currentDensity: "MEDIUM",
    congestionScore: 58,
    signalsCount: 5,
    isRecommended: false,
    color: "#eab308", // Yellow
    reason: "Moderate traffic density (58%). Narrow lanes near Market Square cause slowdowns.",
    pathCoordinates: [
      { x: 10, y: 80 },
      { x: 20, y: 55 },
      { x: 40, y: 40 },
      { x: 65, y: 30 },
      { x: 80, y: 25 },
      { x: 90, y: 20 }
    ],
    geoPoints: [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9780, lng: 77.5980 },
      { lat: 12.9850, lng: 77.6050 },
      { lat: 12.9910, lng: 77.6150 },
      { lat: 12.9970, lng: 77.6240 },
      { lat: 13.0010, lng: 77.6320 }
    ]
  },
  {
    id: "route-c",
    name: "Route C — Outer Ring Bypass (SETS Priority)",
    distanceKm: 6.8,
    baseTimeMin: 7,
    currentDensity: "LOW",
    congestionScore: 22,
    signalsCount: 4,
    isRecommended: true,
    color: "#10b981", // Emerald Green
    reason: "Optimal green corridor. Low density (22%), wide multi-lane road, synchronized signals.",
    pathCoordinates: [
      { x: 10, y: 80 },
      { x: 15, y: 30 },
      { x: 45, y: 18 },
      { x: 75, y: 15 },
      { x: 85, y: 18 },
      { x: 90, y: 20 }
    ],
    geoPoints: [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9830, lng: 77.5890 },
      { lat: 12.9920, lng: 77.5990 },
      { lat: 13.0000, lng: 77.6120 },
      { lat: 13.0020, lng: 77.6250 },
      { lat: 13.0010, lng: 77.6320 }
    ]
  }
];

export const INITIAL_SIGNALS: TrafficSignal[] = [
  { id: "sig-1", junctionName: "Junction 1 - Bypass Entry", locationName: "Outer Ring Rd & West Blvd", x: 15, y: 30, state: "RED", isEmergencyPriority: false, countdownSec: 28, normalCycleSec: 45 },
  { id: "sig-2", junctionName: "Junction 2 - Tech Park Crossing", locationName: "Ring Bypass & Innovation Way", x: 45, y: 18, state: "RED", isEmergencyPriority: false, countdownSec: 15, normalCycleSec: 45 },
  { id: "sig-3", junctionName: "Junction 3 - North Flyover", locationName: "Bypass & North Flyover Ramp", x: 75, y: 15, state: "AMBER", isEmergencyPriority: false, countdownSec: 4, normalCycleSec: 45 },
  { id: "sig-4", junctionName: "Junction 4 - Hospital Gate Link", locationName: "Medical Corridor Junction", x: 85, y: 18, state: "RED", isEmergencyPriority: false, countdownSec: 32, normalCycleSec: 45 },
  { id: "sig-5", junctionName: "Junction 5 - ER Emergency Bay", locationName: "City General Hospital Entry Gate", x: 90, y: 20, state: "GREEN", isEmergencyPriority: false, countdownSec: 10, normalCycleSec: 45 }
];

export const INITIAL_CCTV_CAMERAS: CctvCamera[] = [
  {
    id: "cctv-1",
    name: "CCTV Cam #101",
    location: "Junction 1 - Ring Bypass West",
    junctionId: "sig-1",
    totalVehicles: 12,
    cars: 7,
    buses: 1,
    trucks: 1,
    bikes: 3,
    density: "LOW",
    feedImageStyle: "from-slate-900 via-emerald-950 to-slate-900",
    detectedBoxes: [
      { id: "box-1", label: "Car (0.96)", confidence: 0.96, x: 18, y: 35, width: 22, height: 28, color: "#10b981" },
      { id: "box-2", label: "Bus (0.92)", confidence: 0.92, x: 55, y: 25, width: 28, height: 42, color: "#eab308" },
      { id: "box-3", label: "Bike (0.89)", confidence: 0.89, x: 42, y: 65, width: 14, height: 18, color: "#3b82f6" },
      { id: "box-4", label: "Car (0.94)", confidence: 0.94, x: 72, y: 48, width: 20, height: 26, color: "#10b981" }
    ]
  },
  {
    id: "cctv-2",
    name: "CCTV Cam #102",
    location: "Junction 2 - Tech Park Hub",
    junctionId: "sig-2",
    totalVehicles: 19,
    cars: 12,
    buses: 2,
    trucks: 2,
    bikes: 3,
    density: "MEDIUM",
    feedImageStyle: "from-slate-900 via-amber-950 to-slate-900",
    detectedBoxes: [
      { id: "box-5", label: "Truck (0.91)", confidence: 0.91, x: 12, y: 20, width: 30, height: 45, color: "#f97316" },
      { id: "box-6", label: "Car (0.97)", confidence: 0.97, x: 48, y: 40, width: 22, height: 30, color: "#10b981" },
      { id: "box-7", label: "Car (0.95)", confidence: 0.95, x: 70, y: 30, width: 20, height: 28, color: "#10b981" },
      { id: "box-8", label: "Car (0.98)", confidence: 0.98, x: 32, y: 58, width: 24, height: 32, color: "#10b981" }
    ]
  },
  {
    id: "cctv-3",
    name: "CCTV Cam #103",
    location: "Junction 3 - Expressway Ramp",
    junctionId: "sig-3",
    totalVehicles: 38,
    cars: 24,
    buses: 4,
    trucks: 5,
    bikes: 5,
    density: "HIGH",
    feedImageStyle: "from-slate-900 via-rose-950 to-slate-900",
    detectedBoxes: [
      { id: "box-9", label: "Heavy Truck (0.95)", confidence: 0.95, x: 10, y: 15, width: 35, height: 50, color: "#ef4444" },
      { id: "box-10", label: "Bus (0.93)", confidence: 0.93, x: 50, y: 22, width: 28, height: 40, color: "#ef4444" },
      { id: "box-11", label: "Car (0.96)", confidence: 0.96, x: 22, y: 62, width: 20, height: 26, color: "#eab308" },
      { id: "box-12", label: "Car (0.92)", confidence: 0.92, x: 76, y: 50, width: 18, height: 24, color: "#eab308" }
    ]
  },
  {
    id: "cctv-4",
    name: "CCTV Cam #104",
    location: "Junction 4 - Hospital Gate Link",
    junctionId: "sig-4",
    totalVehicles: 8,
    cars: 5,
    buses: 0,
    trucks: 0,
    bikes: 3,
    density: "LOW",
    feedImageStyle: "from-slate-900 via-emerald-950 to-slate-900",
    detectedBoxes: [
      { id: "box-13", label: "Car (0.98)", confidence: 0.98, x: 25, y: 40, width: 22, height: 28, color: "#10b981" },
      { id: "box-14", label: "Car (0.95)", confidence: 0.95, x: 60, y: 35, width: 20, height: 26, color: "#10b981" }
    ]
  }
];

export const INITIAL_POLICE_UNITS: PoliceUnit[] = [
  {
    id: "pol-1",
    unitCode: "Patrol Alpha-1",
    officerInCharge: "Inspector R. Deshmukh",
    sector: "Ring Bypass West Sector 4",
    status: "PATROLLING",
    distanceToCorridorKm: 0.4,
    radioFreq: "148.25 MHz",
    badgeNumber: "TP-4819"
  },
  {
    id: "pol-2",
    unitCode: "Patrol Beta-3",
    officerInCharge: "Sergeant V. Nair",
    sector: "Tech Park Junction Sector 2",
    status: "PATROLLING",
    distanceToCorridorKm: 0.8,
    radioFreq: "148.25 MHz",
    badgeNumber: "TP-3022"
  },
  {
    id: "pol-3",
    unitCode: "Patrol Charlie-5",
    officerInCharge: "Sub-Inspector S. Patil",
    sector: "Hospital Gate Sector 1",
    status: "PATROLLING",
    distanceToCorridorKm: 0.2,
    radioFreq: "148.25 MHz",
    badgeNumber: "TP-5104"
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: "hosp-1",
    name: "City General Hospital & Emergency Trauma Center",
    locationName: "9th Ave Medical Hub, North Sector",
    x: 90,
    y: 20,
    lat: 13.0010,
    lng: 77.6320,
    totalIcuBeds: 24,
    availableIcuBeds: 6,
    traumaTeamStatus: "STANDBY",
    doctorAssigned: "Dr. Ananya Roy (Chief Cardiology)",
    contactNumber: "+91 80 2847 9000",
    emergencyBay: "Trauma Bay 4 (Reserved)"
  },
  {
    id: "hosp-2",
    name: "St. Jude Super Specialty Hospital",
    locationName: "Central Boulevard West",
    x: 65,
    y: 30,
    lat: 12.9910,
    lng: 77.6150,
    totalIcuBeds: 18,
    availableIcuBeds: 2,
    traumaTeamStatus: "STANDBY",
    doctorAssigned: "Dr. M. K. Gupta",
    contactNumber: "+91 80 2521 1100",
    emergencyBay: "Bay 2"
  },
  {
    id: "hosp-3",
    name: "Metro Emergency Heart Institute",
    locationName: "Ring Road Interchange",
    x: 80,
    y: 25,
    lat: 12.9970,
    lng: 77.6240,
    totalIcuBeds: 15,
    availableIcuBeds: 4,
    traumaTeamStatus: "STANDBY",
    doctorAssigned: "Dr. P. Swaminathan",
    contactNumber: "+91 80 4110 3300",
    emergencyBay: "Cardiac ER 1"
  }
];

export const INITIAL_LOGS: SystemLogEntry[] = [
  {
    id: "log-1",
    timestamp: "07:05:10",
    category: "SYSTEM",
    message: "SETS (Smart Emergency Traffic Management System) Engine v2.4 initialized.",
    statusType: "info"
  },
  {
    id: "log-2",
    timestamp: "07:05:12",
    category: "GPS",
    message: "GPS Geolocation telemetry stream connected to AMB-SETS-902.",
    statusType: "info"
  },
  {
    id: "log-3",
    timestamp: "07:05:15",
    category: "YOLO",
    message: "YOLOv8 Computer Vision cameras online across 4 city junctions.",
    statusType: "success"
  }
];
