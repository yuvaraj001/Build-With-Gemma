import { Driver, DemoStage, RadioMessage, StrategyRecommendation, TrackPoint, TelemetrySnapshot } from '../types';

// Drivers for current session replay
export const INITIAL_DRIVERS: Driver[] = [
  {
    driverNumber: 1,
    code: 'VER',
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    teamColor: '#3671C6',
    currentPosition: 2,
    tireCompound: 'MEDIUM',
    tireAge: 24,
    lastLapTime: '1:32.845',
    lastLapSeconds: 92.845,
    gapAhead: 1.45,
    gapBehind: 2.12,
    speed: 318,
    gear: 7,
    throttle: 98,
    brake: 0,
    drs: true,
  },
  {
    driverNumber: 4,
    code: 'NOR',
    name: 'Lando Norris',
    team: 'McLaren',
    teamColor: '#FF8000',
    currentPosition: 1,
    tireCompound: 'MEDIUM',
    tireAge: 24,
    lastLapTime: '1:32.410',
    lastLapSeconds: 92.410,
    gapAhead: 0,
    gapBehind: 1.45,
    speed: 322,
    gear: 8,
    throttle: 100,
    brake: 0,
    drs: false,
  },
  {
    driverNumber: 44,
    code: 'HAM',
    name: 'Lewis Hamilton',
    team: 'Mercedes-AMG',
    teamColor: '#27F4D2',
    currentPosition: 3,
    tireCompound: 'MEDIUM',
    tireAge: 25,
    lastLapTime: '1:33.102',
    lastLapSeconds: 93.102,
    gapAhead: 2.12,
    gapBehind: 3.54,
    speed: 315,
    gear: 7,
    throttle: 94,
    brake: 0,
    drs: true,
  },
  {
    driverNumber: 16,
    code: 'LEC',
    name: 'Charles Leclerc',
    team: 'Ferrari',
    teamColor: '#E8002D',
    currentPosition: 4,
    tireCompound: 'HARD',
    tireAge: 12,
    lastLapTime: '1:32.205',
    lastLapSeconds: 92.205,
    gapAhead: 3.54,
    gapBehind: 4.88,
    speed: 324,
    gear: 8,
    throttle: 100,
    brake: 0,
    drs: false,
  },
  {
    driverNumber: 14,
    code: 'ALO',
    name: 'Fernando Alonso',
    team: 'Aston Martin',
    teamColor: '#229971',
    currentPosition: 5,
    tireCompound: 'HARD',
    tireAge: 15,
    lastLapTime: '1:32.990',
    lastLapSeconds: 92.990,
    gapAhead: 4.88,
    gapBehind: 8.15,
    speed: 312,
    gear: 7,
    throttle: 92,
    brake: 0,
    drs: false,
  },
];

// Silverstone / Grand Prix circuit outline normalized to viewBox 0..800, 0..500
export const SILVERSTONE_LAYOUT: TrackPoint[] = [
  { x: 100, y: 350, distance: 0, cornerNumber: 1, sector: 1 }, // Abbey
  { x: 180, y: 380, distance: 0.05, cornerNumber: 2, sector: 1 }, // Farm
  { x: 260, y: 410, distance: 0.1, cornerNumber: 3, sector: 1 }, // Village
  { x: 300, y: 440, distance: 0.15, cornerNumber: 4, sector: 1 }, // The Loop
  { x: 280, y: 380, distance: 0.2, cornerNumber: 5, sector: 1 }, // Aintree
  { x: 340, y: 300, distance: 0.25, cornerNumber: 6, sector: 2 }, // Wellington Straight
  { x: 440, y: 220, distance: 0.3, cornerNumber: 7, sector: 2 }, // Brooklands
  { x: 500, y: 240, distance: 0.35, cornerNumber: 8, sector: 2 }, // Luffield
  { x: 550, y: 280, distance: 0.4, cornerNumber: 9, sector: 2 }, // Woodcote
  { x: 650, y: 260, distance: 0.45, cornerNumber: 10, sector: 2 }, // Copse
  { x: 720, y: 190, distance: 0.5, cornerNumber: 11, sector: 2 }, // Maggotts
  { x: 740, y: 140, distance: 0.55, cornerNumber: 12, sector: 3 }, // Becketts
  { x: 680, y: 110, distance: 0.6, cornerNumber: 13, sector: 3 }, // Chapel
  { x: 520, y: 100, distance: 0.7, cornerNumber: 14, sector: 3 }, // Hangar Straight
  { x: 380, y: 100, distance: 0.8, cornerNumber: 15, sector: 3 }, // Stowes
  { x: 250, y: 150, distance: 0.88, cornerNumber: 16, sector: 3 }, // Vale
  { x: 180, y: 220, distance: 0.94, cornerNumber: 17, sector: 3 }, // Club
  { x: 100, y: 350, distance: 1.0, cornerNumber: 18, sector: 1 }, // Abbey
];

// Monza (Autodromo Nazionale Monza - Temple of Speed)
export const MONZA_LAYOUT: TrackPoint[] = [
  { x: 120, y: 380, distance: 0, cornerNumber: 1, sector: 1 }, // Pit Straight / Rettifilo Chicane
  { x: 160, y: 350, distance: 0.06, cornerNumber: 2, sector: 1 }, // Turn 2 Chicane Exit
  { x: 280, y: 280, distance: 0.16, cornerNumber: 3, sector: 1 }, // Curva Grande (Biassono)
  { x: 420, y: 200, distance: 0.28, cornerNumber: 4, sector: 2 }, // Variante della Roggia T4
  { x: 450, y: 215, distance: 0.33, cornerNumber: 5, sector: 2 }, // T5
  { x: 560, y: 150, distance: 0.43, cornerNumber: 6, sector: 2 }, // Lesmo 1 (T6)
  { x: 630, y: 130, distance: 0.49, cornerNumber: 7, sector: 2 }, // Lesmo 2 (T7)
  { x: 740, y: 210, distance: 0.60, cornerNumber: 8, sector: 3 }, // Serraglio / Ascari entry (T8)
  { x: 700, y: 260, distance: 0.67, cornerNumber: 9, sector: 3 }, // Ascari apex (T9)
  { x: 630, y: 295, distance: 0.73, cornerNumber: 10, sector: 3 }, // Ascari exit (T10)
  { x: 420, y: 375, distance: 0.85, cornerNumber: 11, sector: 3 }, // Curva Parabolica (Alboreto) (T11)
  { x: 250, y: 405, distance: 0.94, sector: 1 }, // Main Straight
  { x: 120, y: 380, distance: 1.0, cornerNumber: 1, sector: 1 },
];

// Yas Marina (Abu Dhabi Grand Prix)
export const YAS_MARINA_LAYOUT: TrackPoint[] = [
  { x: 150, y: 380, distance: 0, cornerNumber: 1, sector: 1 }, // Turn 1
  { x: 220, y: 320, distance: 0.08, cornerNumber: 2, sector: 1 }, // T2
  { x: 270, y: 290, distance: 0.14, cornerNumber: 3, sector: 1 }, // T3
  { x: 320, y: 310, distance: 0.20, cornerNumber: 4, sector: 1 }, // T4
  { x: 370, y: 360, distance: 0.27, cornerNumber: 5, sector: 1 }, // Hairpin T5
  { x: 540, y: 140, distance: 0.42, cornerNumber: 6, sector: 2 }, // Long Back Straight Chicane T6
  { x: 590, y: 130, distance: 0.48, cornerNumber: 7, sector: 2 }, // T7 Exit
  { x: 740, y: 180, distance: 0.58, cornerNumber: 8, sector: 2 }, // Second straight T8/T9
  { x: 710, y: 260, distance: 0.68, cornerNumber: 9, sector: 3 }, // Marina Hotel entry T9
  { x: 620, y: 330, distance: 0.78, cornerNumber: 12, sector: 3 }, // Hotel Complex T12
  { x: 470, y: 365, distance: 0.86, cornerNumber: 14, sector: 3 }, // Turn 14
  { x: 290, y: 410, distance: 0.94, cornerNumber: 16, sector: 3 }, // Turn 16
  { x: 150, y: 380, distance: 1.0, cornerNumber: 1, sector: 1 },
];

export interface CircuitInfo {
  id: string;
  name: string;
  location: string;
  lengthKm: string;
  drsZones: number;
  totalLaps: number;
  layout: TrackPoint[];
  pitLaneD: string;
  pitLaneTextPos: { x: number; y: number };
  startFinishLine: { x1: number; y1: number; x2: number; y2: number };
  startFinishTextPos: { x: number; y: number };
}

export const CIRCUITS_DATA: Record<string, CircuitInfo> = {
  Silverstone: {
    id: 'Silverstone',
    name: 'Silverstone Circuit Map',
    location: 'United Kingdom 🇬🇧',
    lengthKm: '5.891 KM',
    drsZones: 2,
    totalLaps: 52,
    layout: SILVERSTONE_LAYOUT,
    pitLaneD: 'M 120 370 L 190 395 L 240 415',
    pitLaneTextPos: { x: 160, y: 420 },
    startFinishLine: { x1: 100, y1: 335, x2: 100, y2: 365 },
    startFinishTextPos: { x: 75, y: 325 },
  },
  Monza: {
    id: 'Monza',
    name: 'Autodromo Nazionale Monza',
    location: 'Italy 🇮🇹',
    lengthKm: '5.793 KM',
    drsZones: 2,
    totalLaps: 53,
    layout: MONZA_LAYOUT,
    pitLaneD: 'M 130 395 L 200 410 L 260 415',
    pitLaneTextPos: { x: 170, y: 430 },
    startFinishLine: { x1: 120, y1: 365, x2: 120, y2: 395 },
    startFinishTextPos: { x: 95, y: 355 },
  },
  'Yas Marina': {
    id: 'Yas Marina',
    name: 'Yas Marina Circuit (Abu Dhabi)',
    location: 'Abu Dhabi 🇦🇪',
    lengthKm: '5.281 KM',
    drsZones: 2,
    totalLaps: 58,
    layout: YAS_MARINA_LAYOUT,
    pitLaneD: 'M 160 395 L 230 420 L 290 425',
    pitLaneTextPos: { x: 200, y: 440 },
    startFinishLine: { x1: 150, y1: 365, x2: 150, y2: 395 },
    startFinishTextPos: { x: 125, y: 355 },
  },
  'Abu Dhabi': {
    id: 'Abu Dhabi',
    name: 'Yas Marina Circuit (Abu Dhabi)',
    location: 'Abu Dhabi 🇦🇪',
    lengthKm: '5.281 KM',
    drsZones: 2,
    totalLaps: 58,
    layout: YAS_MARINA_LAYOUT,
    pitLaneD: 'M 160 395 L 230 420 L 290 425',
    pitLaneTextPos: { x: 200, y: 440 },
    startFinishLine: { x1: 150, y1: 365, x2: 150, y2: 395 },
    startFinishTextPos: { x: 125, y: 355 },
  },
};

export const CIRCUIT_LAYOUT: TrackPoint[] = SILVERSTONE_LAYOUT;

// Preserved Radio Demo Samples for immediate hackathon trigger
export const PRESET_RADIO_SAMPLES: { id: string; title: string; transcript: string; category: string; audioText: string }[] = [
  {
    id: 'tire-cliff',
    title: 'Tire Degradation & Vibration',
    transcript: 'The tires are completely gone. I have a big vibration in Turn 8, front left is dead!',
    category: 'TIRE_DEGRADATION',
    audioText: 'The tires are completely gone. I have a big vibration in Turn 8!',
  },
  {
    id: 'rain-alert',
    title: 'Incoming Rain Sector 2',
    transcript: 'Heavy raindrops on my visor through Sector 2! Track is getting slippery fast.',
    category: 'RAIN',
    audioText: 'Heavy raindrops on my visor through Sector 2! Track getting slippery.',
  },
  {
    id: 'brake-concern',
    title: 'Brake Overheating',
    transcript: 'Brake pedal is feeling soft into Turn 4. Temperatures are in the red.',
    category: 'BRAKE_ISSUE',
    audioText: 'Brake pedal feeling soft into Turn 4. Temps in red.',
  },
  {
    id: 'wing-damage',
    title: 'Front Wing Endplate Damage',
    transcript: 'Touched the barrier exiting Stowe. Lost some front downforce, check debris!',
    category: 'DEBRIS_OR_DAMAGE',
    audioText: 'Touched the barrier exiting Stowe. Lost front downforce.',
  },
  {
    id: 'normal-radio',
    title: 'Normal Status Radio',
    transcript: 'Pace feels comfortable. Managing the rear tires. Gap to Lando is stable.',
    category: 'NORMAL',
    audioText: 'Pace feels comfortable, managing rears, gap is stable.',
  },
];

// Demo Stage Presets as documented in PDF page 15-16
export const DEMO_STAGES: DemoStage[] = [
  {
    id: 'STAGE_1_NORMAL',
    name: 'Stage 1: Normal Race State',
    description: 'All specialist agents remain in monitoring mode. Telemetry stable, pace normal.',
    lap: 18,
  },
  {
    id: 'STAGE_2_TIRE_DEG',
    name: 'Stage 2: Tire Degradation Trigger',
    description: 'Telemetry Agent detects accelerating lap-time loss (+0.85s/lap) and predicts tire cliff in 2 laps.',
    lap: 24,
  },
  {
    id: 'STAGE_3_COMPETITOR_THREAT',
    name: 'Stage 3: Competitor Threat',
    description: 'Competitor Strategy Agent identifies HAM behind has entered undercut window (0.82 undercut prob).',
    lap: 25,
  },
  {
    id: 'STAGE_4_RADIO_INPUT',
    name: 'Stage 4: Live Radio Input',
    description: 'Driver radio: "The tires are completely gone. I have a big vibration in Turn 8."',
    lap: 26,
    presetRadio: 'tire-cliff',
  },
  {
    id: 'STAGE_5_AGENT_COLLAB',
    name: 'Stage 5: Agent Collaboration',
    description: 'Race Strategy Coordinator receives findings from all 3 agents, runs pit option simulator, and evaluates conflicts.',
    lap: 26,
  },
  {
    id: 'STAGE_6_MULTIMODAL_RECOMMENDATION',
    name: 'Stage 6: Strategy Recommendation',
    description: 'Synthesized strategy: "BOX NOW for Hard tires". Spoken alert generated, 12s decision deadline active.',
    lap: 26,
  },
  {
    id: 'STAGE_7_HUMAN_DECISION',
    name: 'Stage 7: Human Engineer Decision',
    description: 'Race engineer approves or rejects recommendation. System visualizes projected race outcome.',
    lap: 26,
  },
];

// Generates dynamic strategy recommendation and radio finding based on current lap and pit stop decision
export function getStrategyAndRadioForLap(
  lap: number,
  driverCode = 'VER',
  userDecision: 'APPROVED' | 'REJECTED' | 'NONE' = 'NONE',
  pitLap: number | null = null
): { recommendation: StrategyRecommendation; radioMessage: RadioMessage } {
  const isPitted = userDecision === 'APPROVED' && pitLap !== null && lap >= pitLap;

  if (isPitted) {
    return {
      recommendation: {
        action: 'STAY_OUT',
        targetCompound: 'HARD',
        reasoning: `Pit stop executed successfully on Lap ${pitLap}. Driver on fresh Hard tires. Pace delta +0.95s/lap faster in clean air.`,
        counterfactualRisk: 'Unnecessary extra pit stop would cost 21.4s track position.',
        decisionDeadlineSeconds: 60,
        confidenceScore: 0.98,
        contributingAgents: ['TELEMETRY_AGENT', 'COMPETITOR_AGENT'],
        evidenceIds: [`postpit-${driverCode.toLowerCase()}-lap${lap}`],
        conflictDetected: false,
        missingInputs: [],
        requiresHumanApproval: false,
        timestamp: new Date().toISOString(),
      },
      radioMessage: {
        id: `radio-pitted-lap-${lap}`,
        timestamp: '14:40:15',
        lap,
        driverCode,
        transcript: 'New Hard tires feel great! Grip and balance restored.',
        intent: 'NORMAL_STATUS',
        urgency: 'NORMAL',
        reportedIssues: [],
        driverRequestedAction: 'NO_REQUEST',
        confidence: 0.97,
      },
    };
  }

  if (lap <= 15) {
    return {
      recommendation: {
        action: 'MONITOR',
        targetCompound: null,
        reasoning:
          'Vehicle telemetry nominal. Tire degradation baseline steady (+0.05s/lap). Stint target on track.',
        counterfactualRisk: 'None. Staying out is optimal strategy.',
        decisionDeadlineSeconds: 60,
        confidenceScore: 0.98,
        contributingAgents: ['TELEMETRY_AGENT', 'COMPETITOR_AGENT'],
        evidenceIds: [`baseline-${driverCode.toLowerCase()}-lap${lap}`],
        conflictDetected: false,
        missingInputs: [],
        requiresHumanApproval: false,
        timestamp: new Date().toISOString(),
      },
      radioMessage: {
        id: `radio-lap-${lap}`,
        timestamp: '14:15:00',
        lap,
        driverCode,
        transcript: 'Pace feels comfortable. Managing rear tires.',
        intent: 'NORMAL_STATUS',
        urgency: 'NORMAL',
        reportedIssues: [],
        driverRequestedAction: 'NO_REQUEST',
        confidence: 0.98,
      },
    };
  } else if (lap <= 22) {
    return {
      recommendation: {
        action: 'MONITOR',
        targetCompound: 'HARD',
        reasoning:
          'Tire thermal degradation beginning to slope (+0.35s/lap). Monitoring pit window for stint 1.',
        counterfactualRisk: 'Pitting early creates traffic exit behind slower cars in Sector 2.',
        decisionDeadlineSeconds: 35,
        confidenceScore: 0.92,
        contributingAgents: ['TELEMETRY_AGENT', 'COMPETITOR_AGENT'],
        evidenceIds: [`deg-${driverCode.toLowerCase()}-lap${lap}`],
        conflictDetected: false,
        missingInputs: [],
        requiresHumanApproval: false,
        timestamp: new Date().toISOString(),
      },
      radioMessage: {
        id: `radio-lap-${lap}`,
        timestamp: '14:28:12',
        lap,
        driverCode,
        transcript: 'Rears are starting to slide a bit through Sector 2.',
        intent: 'TIRE_WEAR_WARNING',
        urgency: 'HIGH',
        reportedIssues: ['TIRE_DEGRADATION'],
        driverRequestedAction: 'NO_REQUEST',
        confidence: 0.92,
      },
    };
  } else if (lap <= 28) {
    const isPitted = userDecision === 'APPROVED' && pitLap !== null && lap >= pitLap;
    if (isPitted) {
      const stintAge = pitLap ? lap - pitLap + 1 : 1;
      return {
        recommendation: {
          action: 'STAY_OUT',
          targetCompound: 'HARD',
          reasoning: `Pitted successfully on Lap ${pitLap}. Fresh Hard compound fitted (stint age ${stintAge} laps). Pace delta +0.9s/lap faster than previous stint.`,
          counterfactualRisk: 'Over-pushing on fresh rubber increases thermal degradation.',
          decisionDeadlineSeconds: 60,
          confidenceScore: 0.96,
          contributingAgents: ['TELEMETRY_AGENT', 'COMPETITOR_AGENT'],
          evidenceIds: [`stint2-${driverCode.toLowerCase()}-lap${lap}`],
          conflictDetected: false,
          missingInputs: [],
          requiresHumanApproval: false,
          timestamp: new Date().toISOString(),
        },
        radioMessage: {
          id: `radio-lap-${lap}`,
          timestamp: '14:35:10',
          lap,
          driverCode,
          transcript: `Fresh Hard tires fitted (stint age ${stintAge} laps). Balance is stable and pace is strong.`,
          intent: 'NORMAL_STATUS',
          urgency: 'NORMAL',
          reportedIssues: [],
          driverRequestedAction: 'NO_REQUEST',
          confidence: 0.98,
        },
      };
    }
    return {
      recommendation: {
        action: 'BOX_NOW',
        targetCompound: 'HARD',
        reasoning:
          'Accelerating tire degradation (+0.85s/lap), high undercut exposure from rival (82%), and driver vibration report support an immediate pit stop.',
        counterfactualRisk:
          'Staying out is projected to cost 1.1s next lap and creates a 78% probability of losing position.',
        decisionDeadlineSeconds: 60,
        confidenceScore: 0.89,
        contributingAgents: ['TELEMETRY_AGENT', 'COMPETITOR_AGENT', 'RADIO_AGENT'],
        evidenceIds: [
          `cliff-${driverCode.toLowerCase()}-lap${lap}`,
          `undercut-rival44`,
          `radio-${driverCode.toLowerCase()}-lap${lap}`,
        ],
        conflictDetected: false,
        missingInputs: [],
        requiresHumanApproval: true,
        timestamp: new Date().toISOString(),
      },
      radioMessage: {
        id: `radio-lap-${lap}`,
        timestamp: '14:32:05',
        lap,
        driverCode,
        transcript: 'The tires are completely gone. I have a big vibration in Turn 8.',
        intent: 'REPORT_CRITICAL_TIRE_ISSUE',
        urgency: 'URGENT',
        reportedIssues: ['TIRE_DEGRADATION', 'VIBRATION'],
        driverRequestedAction: 'PIT',
        confidence: 0.94,
      },
    };
  } else if (lap <= 42) {
    const isHighWear = userDecision === 'REJECTED' || pitLap === null || lap - (pitLap || 0) >= 20;
    return {
      recommendation: {
        action: isHighWear ? 'BOX_NOW' : 'STAY_OUT',
        targetCompound: isHighWear ? 'SOFT' : 'HARD',
        reasoning:
          isHighWear
            ? `High pace degradation (+0.52s/lap) detected on lap ${lap}. Tire cliff limit approaching. Immediate pit stop advised.`
            : 'Pitted successfully for Hard compound. Pace delta +0.9s/lap faster than previous stint.',
        counterfactualRisk: isHighWear
          ? 'Continuing on worn rubber risks losing 1.2s per lap to trailing competitors.'
          : 'Over-pushing on worn rubber increases failure probability.',
        decisionDeadlineSeconds: 15,
        confidenceScore: 0.94,
        contributingAgents: ['TELEMETRY_AGENT', 'COMPETITOR_AGENT'],
        evidenceIds: [`deg-${driverCode.toLowerCase()}-lap${lap}`],
        conflictDetected: false,
        missingInputs: [],
        requiresHumanApproval: isHighWear,
        timestamp: new Date().toISOString(),
      },
      radioMessage: {
        id: `radio-lap-${lap}`,
        timestamp: '14:45:20',
        lap,
        driverCode,
        transcript: isHighWear ? 'Tires are sliding everywhere. Pace is dropping fast, need fresh rubber!' : 'Tires feel good. Balance is stable.',
        intent: isHighWear ? 'REPORT_CRITICAL_TIRE_ISSUE' : 'NORMAL_STATUS',
        urgency: isHighWear ? 'URGENT' : 'NORMAL',
        reportedIssues: isHighWear ? ['TIRE_DEGRADATION'] : [],
        driverRequestedAction: isHighWear ? 'PIT' : 'NO_REQUEST',
        confidence: 0.96,
      },
    };
  } else {
    const stintAge = pitLap ? lap - pitLap + 1 : lap;
    const isCriticalLateWear = userDecision === 'REJECTED' || pitLap === null || stintAge >= 20 || lap >= 48;
    return {
      recommendation: {
        action: isCriticalLateWear ? 'BOX_NOW' : 'STAY_OUT',
        targetCompound: isCriticalLateWear ? 'SOFT' : 'HARD',
        reasoning: isCriticalLateWear
          ? `Lap ${lap}: Severe pace degradation (+0.52s/lap) on stint age ${stintAge} laps. Telemetry Agent signals critical tire wear window.`
          : 'Final stint strategy locked. Gap to trailing car is +4.2s. Fuel saving target -0.2kg/lap.',
        counterfactualRisk: isCriticalLateWear
          ? 'Staying out on degraded rubber costs 1.5s per lap and risks losing track position to rivals.'
          : 'Unnecessary extra pit stop drops position down to P4.',
        decisionDeadlineSeconds: 12,
        confidenceScore: 0.95,
        contributingAgents: ['TELEMETRY_AGENT', 'COMPETITOR_AGENT'],
        evidenceIds: [`finalstint-${driverCode.toLowerCase()}-lap${lap}`],
        conflictDetected: false,
        missingInputs: [],
        requiresHumanApproval: isCriticalLateWear,
        timestamp: new Date().toISOString(),
      },
      radioMessage: {
        id: `radio-lap-${lap}`,
        timestamp: '15:02:10',
        lap,
        driverCode,
        transcript: isCriticalLateWear
          ? 'The rear tires are completely cooked! I cannot get power down on exit!'
          : 'Managing gap to P2. Final laps of race.',
        intent: isCriticalLateWear ? 'REPORT_CRITICAL_TIRE_ISSUE' : 'NORMAL_STATUS',
        urgency: isCriticalLateWear ? 'URGENT' : 'NORMAL',
        reportedIssues: isCriticalLateWear ? ['TIRE_DEGRADATION', 'TRACTION_LOSS'] : [],
        driverRequestedAction: isCriticalLateWear ? 'PIT' : 'NO_REQUEST',
        confidence: 0.97,
      },
    };
  }
}

// Generates lap-by-lap snapshot telemetry data for simulation
export function getSnapshotForLap(
  lap: number,
  selectedDriverCode = 'VER',
  userDecision: 'APPROVED' | 'REJECTED' | 'NONE' = 'NONE',
  pitLap: number | null = null
): TelemetrySnapshot {
  const isPitted = userDecision === 'APPROVED' && pitLap !== null && lap >= pitLap;

  const currentCompound = isPitted ? ('HARD' as const) : ('MEDIUM' as const);
  const tireAge = isPitted ? lap - pitLap + 1 : lap;

  let basePaceDeg = 0.05;
  let degLoss = 0;
  let predictedCliff = 26;

  if (isPitted) {
    if (tireAge >= 20) {
      basePaceDeg = 0.52 + (tireAge - 20) * 0.04;
      degLoss = 0.8 + (tireAge - 20) * 0.12;
    } else if (tireAge >= 15) {
      basePaceDeg = 0.28 + (tireAge - 15) * 0.048;
      degLoss = 0.4 + (tireAge - 15) * 0.08;
    } else {
      basePaceDeg = 0.04 + tireAge * 0.015;
      degLoss = tireAge * 0.02;
    }
    predictedCliff = pitLap + 24;
  } else {
    if (lap < 18) {
      basePaceDeg = 0.05 + lap * 0.01;
      degLoss = lap * 0.03;
    } else if (lap < 24) {
      basePaceDeg = 0.22 + (lap - 18) * 0.06;
      degLoss = 0.5 + (lap - 18) * 0.15;
    } else {
      basePaceDeg = 0.78 + (lap - 24) * 0.12;
      degLoss = 1.4 + (lap - 24) * 0.45;
    }
  }

  const lapSecs = isPitted ? 91.8 + degLoss : 92.2 + degLoss;

  const drivers = INITIAL_DRIVERS.map((d) => {
    if (d.code === selectedDriverCode) {
      return {
        ...d,
        tireCompound: currentCompound,
        tireAge,
        lastLapSeconds: lapSecs,
        lastLapTime: `1:${lapSecs.toFixed(3)}`,
        speed: isPitted
          ? Math.floor(328 - degLoss * 2)
          : Math.max(275, Math.floor(325 - degLoss * 8)),
        currentPosition: isPitted ? (lap < pitLap + 3 ? 4 : 2) : d.currentPosition,
      };
    }
    return d;
  });

  const selectedDriver = drivers.find((d) => d.code === selectedDriverCode) || drivers[0];
  const competitors = drivers.filter((d) => d.code !== selectedDriverCode);

  return {
    lap,
    totalLaps: 57,
    timeInLap: (lap * 0.17) % 1,
    trackTemp: 42.5,
    airTemp: 26.1,
    safetyCarStatus: lap === 32 ? 'VSC' : 'NONE',
    weather: 'DRY',
    pitLossTimeSeconds: 21.4,
    selectedDriver,
    competitors,
    paceDegradationPerLap: Number(basePaceDeg.toFixed(2)),
    predictedCliffLap: predictedCliff,
    undercutRiskScore: !isPitted && lap >= 24 ? 0.84 : 0.12,
    overcutPotentialScore: 0.15,
    predictedPitExitPosition: 4,
  };
}
