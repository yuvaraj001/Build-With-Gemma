export type TireCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';

export type RaceAction = 'BOX_NOW' | 'BOX_NEXT_LAP' | 'STAY_OUT' | 'MONITOR' | 'INSUFFICIENT_DATA';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'NORMAL';

export interface Driver {
  driverNumber: number;
  code: string;
  name: string;
  team: string;
  teamColor: string;
  currentPosition: number;
  tireCompound: TireCompound;
  tireAge: number;
  lastLapTime: string;
  lastLapSeconds: number;
  gapAhead: number; // in seconds
  gapBehind: number; // in seconds
  speed: number; // km/h
  gear: number;
  throttle: number;
  brake: number;
  drs: boolean;
}

export interface TelemetrySnapshot {
  lap: number;
  totalLaps: number;
  timeInLap: number; // 0 to 1 lap completion
  trackTemp: number; // celsius
  airTemp: number;
  safetyCarStatus: 'NONE' | 'VSC' | 'FULL_SAFETY_CAR' | 'RED_FLAG';
  weather: 'DRY' | 'LIGHT_RAIN' | 'HEAVY_RAIN';
  pitLossTimeSeconds: number;
  selectedDriver: Driver;
  competitors: Driver[];
  paceDegradationPerLap: number; // seconds lost per lap
  predictedCliffLap: number;
  undercutRiskScore: number; // 0 to 1
  overcutPotentialScore: number; // 0 to 1
  predictedPitExitPosition: number;
}

export interface AgentFinding {
  agent: 'TELEMETRY_AGENT' | 'COMPETITOR_AGENT' | 'RADIO_AGENT' | 'RACE_CONTROL_AGENT';
  riskLevel: RiskLevel;
  recommendedAction: RaceAction;
  confidence: number;
  latencyMs: number;
  evidenceIds: string[];
  summary: string;
  details?: Record<string, any>;
}

export interface RadioMessage {
  id: string;
  timestamp: string;
  lap: number;
  driverCode: string;
  transcript: string;
  intent: string;
  urgency: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW' | 'UNCLEAR';
  reportedIssues: string[];
  driverRequestedAction?: 'PIT' | 'STAY_OUT' | 'NO_REQUEST';
  confidence: number;
  audioBlobUrl?: string;
  isCustomRecording?: boolean;
}

export interface StrategyRecommendation {
  action: RaceAction;
  targetCompound: TireCompound | null;
  reasoning: string;
  counterfactualRisk: string;
  decisionDeadlineSeconds: number;
  confidenceScore: number;
  contributingAgents: string[];
  agentFindings?: AgentFinding[];
  evidenceIds: string[];
  conflictDetected: boolean;
  conflictingAgents?: string[];
  resolutionReason?: string;
  missingInputs: string[];
  requiresHumanApproval: boolean;
  timestamp: string;
}

export type DemoStageId =
  | 'STAGE_1_NORMAL'
  | 'STAGE_2_TIRE_DEG'
  | 'STAGE_3_COMPETITOR_THREAT'
  | 'STAGE_4_RADIO_INPUT'
  | 'STAGE_5_AGENT_COLLAB'
  | 'STAGE_6_MULTIMODAL_RECOMMENDATION'
  | 'STAGE_7_HUMAN_DECISION';

export interface DemoStage {
  id: DemoStageId;
  name: string;
  description: string;
  lap: number;
  presetRadio?: string;
}

export interface TrackPoint {
  x: number;
  y: number;
  distance: number; // 0 to 100% of lap
  cornerNumber?: number;
  sector?: 1 | 2 | 3;
}
