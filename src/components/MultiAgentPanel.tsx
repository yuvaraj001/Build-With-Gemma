import React from 'react';
import { AgentFinding, StrategyRecommendation, TelemetrySnapshot, RadioMessage } from '../types';
import { Cpu, Activity, Users, Radio, CheckCircle, AlertOctagon, ArrowRight, ShieldCheck } from 'lucide-react';

interface MultiAgentPanelProps {
  telemetrySnapshot: TelemetrySnapshot;
  radioMessage?: RadioMessage;
  recommendation?: StrategyRecommendation;
}

export const MultiAgentPanel: React.FC<MultiAgentPanelProps> = ({
  telemetrySnapshot,
  radioMessage,
  recommendation,
}) => {
  const lap = telemetrySnapshot.lap;
  const driver = telemetrySnapshot.selectedDriver;

  // Build Telemetry Agent Finding
  const paceDeg = telemetrySnapshot.paceDegradationPerLap || 0;
  const tireAge = driver.tireAge || lap;

  const isCriticalDeg = paceDeg >= 0.50 || tireAge >= 28;
  const isHighDeg = !isCriticalDeg && (paceDeg >= 0.30 || tireAge >= 20);
  const isMediumDeg = !isCriticalDeg && !isHighDeg && (paceDeg >= 0.18 || tireAge >= 15);

  const telemetryRiskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL' = isCriticalDeg
    ? 'CRITICAL'
    : isHighDeg
    ? 'HIGH'
    : isMediumDeg
    ? 'MEDIUM'
    : 'NORMAL';

  const telemetryAction: 'BOX_NOW' | 'BOX_NEXT_LAP' | 'STAY_OUT' | 'MONITOR' = isCriticalDeg || isHighDeg
    ? 'BOX_NOW'
    : isMediumDeg
    ? 'BOX_NEXT_LAP'
    : 'STAY_OUT';

  const telemetrySummary = isCriticalDeg
    ? `Critical tire degradation (+${paceDeg.toFixed(2)}s/lap, stint age: ${tireAge} laps). Tire cliff limit exceeded — immediate pit stop required.`
    : isHighDeg
    ? `High tire degradation (+${paceDeg.toFixed(2)}s/lap, stint age: ${tireAge} laps). Accelerating pace loss approaching cliff.`
    : isMediumDeg
    ? `Moderate tire degradation (+${paceDeg.toFixed(2)}s/lap, stint age: ${tireAge} laps). Monitoring wear gradient.`
    : `Nominal tire degradation (+${paceDeg.toFixed(2)}s/lap, stint age: ${tireAge} laps). Telemetry within baseline parameters.`;

  const telemetryAgentFinding: AgentFinding = {
    agent: 'TELEMETRY_AGENT',
    riskLevel: telemetryRiskLevel,
    recommendedAction: telemetryAction,
    confidence: isCriticalDeg || isHighDeg ? 0.95 : 0.92,
    latencyMs: 640,
    evidenceIds: [`pace-${driver.code.toLowerCase()}-lap${lap}`, `cliff-${driver.code.toLowerCase()}-lap${telemetrySnapshot.predictedCliffLap}`],
    summary: telemetrySummary,
  };

  // Build Competitor Agent Finding
  const isUndercut = telemetrySnapshot.undercutRiskScore > 0.5;

  const competitorAgentFinding: AgentFinding = {
    agent: 'COMPETITOR_AGENT',
    riskLevel: isUndercut ? 'HIGH' : 'LOW',
    recommendedAction: isUndercut ? 'BOX_NOW' : 'STAY_OUT',
    confidence: isUndercut ? 0.84 : 0.93,
    latencyMs: 680,
    evidenceIds: [`undercut-${driver.code.toLowerCase()}-rival44`, `pit-exit-${driver.code.toLowerCase()}-lap${lap}`],
    summary: isUndercut
      ? 'The rival behind (HAM) has entered the undercut window (82% probability) and is likely to pit.'
      : 'No immediate undercut threat. Competitor gaps remain stable.',
  };

  // Build Radio Agent Finding
  const isRadioUrgent =
    Boolean(radioMessage) &&
    (radioMessage?.urgency === 'CRITICAL' ||
      radioMessage?.urgency === 'URGENT' ||
      radioMessage?.urgency === 'HIGH' ||
      radioMessage?.driverRequestedAction === 'PIT' ||
      (radioMessage?.reportedIssues &&
        radioMessage.reportedIssues.some((issue) =>
          ['STEERING', 'MECHANICAL', 'PUNCTURE', 'BRAKE', 'TIRE', 'ENGINE', 'SUSPENSION', 'VIBRATION', 'FAIL', 'DAMAGE', 'WING', 'AERO', 'BODYWORK'].some((kw) =>
            issue.toUpperCase().includes(kw)
          )
        )));

  const isRadioMedium =
    Boolean(radioMessage) &&
    !isRadioUrgent &&
    (radioMessage?.urgency === 'MEDIUM' || (radioMessage?.reportedIssues && radioMessage.reportedIssues.length > 0));

  const radioAgentFinding: AgentFinding = {
    agent: 'RADIO_AGENT',
    riskLevel: isRadioUrgent
      ? (radioMessage?.urgency === 'CRITICAL' ||
         (radioMessage?.reportedIssues &&
          radioMessage.reportedIssues.some(i =>
            ['STEERING', 'FAIL', 'WING', 'DAMAGE', 'CRITICAL', 'MECHANICAL', 'BRAKE', 'ENGINE'].some(kw => i.toUpperCase().includes(kw))
          )))
        ? 'CRITICAL'
        : 'HIGH'
      : isRadioMedium
      ? 'MEDIUM'
      : 'NORMAL',
    recommendedAction: isRadioUrgent
      ? 'BOX_NOW'
      : isRadioMedium
      ? 'BOX_NEXT_LAP'
      : 'STAY_OUT',
    confidence: radioMessage?.confidence || 0.94,
    latencyMs: 1250,
    evidenceIds: [radioMessage?.id || `radio-${driver.code.toLowerCase()}-lap${lap}`],
    summary: radioMessage
      ? `Driver radio: "${radioMessage.transcript}" (Urgency: ${radioMessage.urgency})`
      : 'No active driver radio distress reported.',
  };

  // Build Coordinator Finding
  const isAnyAgentUrgent = isCriticalDeg || isHighDeg || isRadioUrgent || isUndercut;
  const coordinatorFinding: AgentFinding = {
    agent: 'RACE_CONTROL_AGENT',
    riskLevel: recommendation?.action === 'BOX_NOW' || isAnyAgentUrgent ? 'HIGH' : 'NORMAL',
    recommendedAction: recommendation?.action || (isCriticalDeg || isHighDeg || isRadioUrgent ? 'BOX_NOW' : 'MONITOR'),
    confidence: recommendation?.confidenceScore || 0.89,
    latencyMs: 1100,
    evidenceIds: recommendation?.evidenceIds || [],
    summary: recommendation?.reasoning || 'Race Strategy Coordinator evaluating multi-agent telemetry stream.',
  };

  const agents: { title: string; icon: React.ReactNode; finding: AgentFinding }[] = [
    {
      title: 'Telemetry Agent',
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
      finding: telemetryAgentFinding,
    },
    {
      title: 'Competitor Strategy Agent',
      icon: <Users className="w-4 h-4 text-purple-400" />,
      finding: competitorAgentFinding,
    },
    {
      title: 'Radio Intelligence Agent',
      icon: <Radio className="w-4 h-4 text-amber-400" />,
      finding: radioAgentFinding,
    },
    {
      title: 'Race Strategy Coordinator',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      finding: coordinatorFinding,
    },
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'BOX_NOW':
        return 'bg-rose-600 text-white font-extrabold animate-pulse';
      case 'BOX_NEXT_LAP':
        return 'bg-amber-600 text-white font-bold';
      case 'STAY_OUT':
        return 'bg-emerald-600 text-white font-bold';
      default:
        return 'bg-slate-700 text-slate-200 font-medium';
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-black text-slate-100 uppercase tracking-wider">
            Multi-Agent System Panel
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Parallel Concurrency (asyncio)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {agents.map(({ title, icon, finding }) => (
          <div
            key={finding.agent}
            className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  {icon}
                  <span className="text-xs font-bold text-slate-200">{title}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadge(finding.riskLevel)}`}>
                  {finding.riskLevel}
                </span>
              </div>

              {/* Recommended Action & Confidence */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Recommendation</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${getActionBadge(finding.recommendedAction)}`}>
                  {finding.recommendedAction.replace('_', ' ')}
                </span>
              </div>

              {/* Summary Text */}
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-sans mb-3">
                {finding.summary}
              </p>
            </div>

            {/* Evidence & Latency Footer */}
            <div className="border-t border-slate-800/60 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="text-cyan-400 font-semibold">
                Conf: {(finding.confidence * 100).toFixed(0)}%
              </span>
              <span className="text-slate-500">
                {finding.latencyMs}ms
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
