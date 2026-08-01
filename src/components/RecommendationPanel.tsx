import React, { useState, useEffect } from 'react';
import { StrategyRecommendation, TireCompound } from '../types';
import { AlertOctagon, CheckCircle2, XCircle, Volume2, ShieldAlert, Sparkles, Clock, HelpCircle, ArrowRight } from 'lucide-react';

interface RecommendationPanelProps {
  recommendation: StrategyRecommendation;
  onApprove: () => void;
  onReject: () => void;
  userDecision: 'APPROVED' | 'REJECTED' | 'NONE';
  onSpeakAlert: () => void;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendation,
  onApprove,
  onReject,
  userDecision,
  onSpeakAlert,
}) => {
  const isBoxNow = recommendation.action === 'BOX_NOW';
  const isStayOut = recommendation.action === 'STAY_OUT';
  const isBoxAction = isBoxNow || recommendation.action === 'BOX_NEXT_LAP';
  const isTimerActive = isBoxAction && userDecision === 'NONE';

  const [countdown, setCountdown] = useState<number>(60);

  // Countdown timer effect
  useEffect(() => {
    if (!isTimerActive) {
      setCountdown(60);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, recommendation.action, userDecision]);

  const getActionTheme = () => {
    if (isBoxNow) {
      return {
        bannerBg: 'bg-rose-950/80 border-rose-600',
        text: 'text-rose-400',
        badge: 'bg-rose-600 text-white shadow-lg shadow-rose-900/50 animate-pulse',
        ringColor: '#f43f5e',
      };
    }
    if (isStayOut) {
      return {
        bannerBg: 'bg-emerald-950/80 border-emerald-600',
        text: 'text-emerald-400',
        badge: 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50',
        ringColor: '#10b981',
      };
    }
    return {
      bannerBg: 'bg-cyan-950/80 border-cyan-600',
      text: 'text-cyan-400',
      badge: 'bg-cyan-600 text-white',
      ringColor: '#06b6d4',
    };
  };

  const theme = getActionTheme();

  return (
    <div className={`border rounded-xl p-4 flex flex-col gap-4 shadow-2xl transition-all duration-300 ${theme.bannerBg}`}>
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center">
            <AlertOctagon className={`w-8 h-8 ${theme.text}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                STRATEGY RECOMMENDATION
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-400">
                CONFIDENCE {(recommendation.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-2xl font-black uppercase tracking-tight px-3 py-1 rounded-md ${theme.badge}`}>
                {recommendation.action.replace('_', ' ')}
              </span>
              {recommendation.targetCompound && (
                <span className="px-3 py-1 rounded-md bg-slate-900 text-white font-mono font-black text-sm border border-slate-700">
                  TARGET: {recommendation.targetCompound}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Controls: Decision Deadline Countdown & Speak Audio Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSpeakAlert}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Volume2 className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>Speak Alert</span>
          </button>

          {/* Radial Countdown Timer */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
            <div className="relative w-10 h-10 flex items-center justify-center font-mono font-black text-sm text-white">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="transition-all duration-1000 ease-linear"
                  strokeDasharray={`${(countdown / 12) * 100}, 100`}
                  strokeWidth="3.5"
                  stroke={theme.ringColor}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute">{countdown}s</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              <span className="block font-bold text-slate-200">DEADLINE</span>
              <span>Window Closing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reasoning & Counterfactual Risk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why Box */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3.5">
          <span className="text-xs font-bold text-slate-300 uppercase block mb-2 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Evidence Hierarchy Reasoning
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {recommendation.reasoning}
          </p>

          <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
            {recommendation.evidenceIds.map((id) => (
              <span
                key={id}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-cyan-400 border border-slate-800"
              >
                #{id}
              </span>
            ))}
          </div>
        </div>

        {/* Counterfactual Risk Box */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3.5">
          <span className="text-xs font-bold text-rose-400 uppercase block mb-2 tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Counterfactual Risk (If Stay Out)
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {recommendation.counterfactualRisk}
          </p>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Projected Lap Loss: <strong className="text-rose-400">+1.1s</strong></span>
            <span>Position Loss Risk: <strong className="text-rose-400">78%</strong></span>
          </div>
        </div>
      </div>

      {/* Conflict Resolution Drawer (if detected) */}
      {recommendation.conflictDetected && (
        <div className="bg-amber-950/60 border border-amber-600/40 rounded-lg p-3 text-xs text-amber-200">
          <div className="flex items-center gap-2 font-bold uppercase text-amber-400 mb-1">
            <HelpCircle className="w-4 h-4" /> Agent Disagreement Resolved by Hierarchy
          </div>
          <p className="text-amber-100 font-sans">
            {recommendation.resolutionReason ||
              'Telemetry Agent recommended BOX NOW due to tire cliff, while Competitor Agent suggested STAY OUT. Safety and telemetry evidence prioritized BOX NOW.'}
          </p>
        </div>
      )}

      {/* Human Engineer Approval Buttons */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
            Human Race Engineer Confirmation
          </span>
          <span className="text-[11px] text-slate-400">
            {userDecision === 'NONE'
              ? 'Recommendation requires explicit approval before broadcasting to driver.'
              : userDecision === 'APPROVED'
              ? '✅ Decision APPROVED: Pit wall preparing pit crew & fresh Hard compound tires.'
              : '❌ Decision REJECTED: Staying out on track. Driver instructed to manage tires.'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReject}
            className={`px-4 py-2.5 rounded-lg border text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              userDecision === 'REJECTED'
                ? 'bg-rose-900 text-white border-rose-500 ring-2 ring-rose-500'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>REJECT & STAY OUT</span>
          </button>

          <button
            onClick={onApprove}
            className={`px-5 py-2.5 rounded-lg border text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              userDecision === 'APPROVED'
                ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-emerald-900/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>APPROVE & PIT NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
