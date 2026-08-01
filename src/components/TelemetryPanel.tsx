import React from 'react';
import { Driver, TelemetrySnapshot } from '../types';
import { Gauge, Flame, AlertTriangle, TrendingDown, Clock, ShieldAlert } from 'lucide-react';

interface TelemetryPanelProps {
  snapshot: TelemetrySnapshot;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ snapshot }) => {
  const driver = snapshot.selectedDriver;

  // Compound styling map
  const getCompoundBadge = (compound: string) => {
    switch (compound) {
      case 'SOFT':
        return { bg: 'bg-red-500/10 text-red-400 border-red-500/30', label: '🔴 SOFT' };
      case 'MEDIUM':
        return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: '🟡 MEDIUM' };
      case 'HARD':
        return { bg: 'bg-slate-100/10 text-slate-200 border-slate-300/30', label: '⚪ HARD' };
      case 'INTERMEDIATE':
        return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: '🟢 INTER' };
      case 'WET':
        return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', label: '🔵 WET' };
      default:
        return { bg: 'bg-slate-800 text-slate-300 border-slate-700', label: compound };
    }
  };

  const compoundInfo = getCompoundBadge(driver.tireCompound);
  const maxLife = driver.tireCompound === 'HARD' ? 38 : 28;
  const tireWearPercent = Math.min(100, Math.floor((driver.tireAge / maxLife) * 100));

  // Generate lap degradation historical curve points for SVG dynamically from tire compound & age
  const lapHistory = Array.from({ length: 8 }, (_, i) => {
    const l = Math.max(1, snapshot.lap - 7 + i);
    const ageAtL = Math.max(1, driver.tireAge - (snapshot.lap - l));
    let loss = 0.05;

    if (driver.tireCompound === 'HARD') {
      loss = 0.04 + ageAtL * 0.012;
    } else {
      if (ageAtL < 18) {
        loss = 0.05 + ageAtL * 0.01;
      } else if (ageAtL < 24) {
        loss = 0.22 + (ageAtL - 18) * 0.06;
      } else {
        loss = 0.78 + (ageAtL - 24) * 0.15;
      }
    }
    return { lap: l, loss: Math.min(2.5, loss) };
  });

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 shadow-xl">
      {/* Driver Header & Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-3.5 h-10 rounded"
            style={{ backgroundColor: driver.teamColor }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight">
                P{driver.currentPosition}
              </span>
              <h2 className="text-lg font-bold text-slate-100">
                #{driver.driverNumber} {driver.name} ({driver.code})
              </h2>
            </div>
            <p className="text-xs text-slate-400">{driver.team}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Last Lap Time</span>
            <span className="text-sm font-mono font-bold text-cyan-400">{driver.lastLapTime}</span>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Telemetry Telemetry Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Speedometer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 uppercase">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Speed
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {driver.speed}
            </span>
            <span className="text-xs font-semibold text-slate-400">KM/H</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(driver.speed / 350) * 100}%` }}
            />
          </div>
        </div>

        {/* Gear & DRS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Gear</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                driver.drs
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              DRS {driver.drs ? 'OPEN' : 'OFF'}
            </span>
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-white">
            {driver.gear}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">RPM 11,850</span>
        </div>

        {/* Throttle % */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Throttle</span>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
            {driver.throttle}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-150"
              style={{ width: `${driver.throttle}%` }}
            />
          </div>
        </div>

        {/* Brake % */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Brake</span>
          <div className="mt-2 text-2xl font-black font-mono text-rose-400">
            {driver.brake}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-150"
              style={{ width: `${driver.brake}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Row 2: Tire Compound & Deg Analysis Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Tire Behavior & Degradation
            </span>
          </div>

          <span
            className={`px-2.5 py-1 rounded-md text-xs font-extrabold border ${compoundInfo.bg}`}
          >
            {compoundInfo.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tire Age</span>
            <span className="text-lg font-mono font-bold text-slate-100">{driver.tireAge} Laps</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pace Degradation</span>
            <span className="text-lg font-mono font-bold text-amber-400">
              +{snapshot.paceDegradationPerLap.toFixed(2)}s/lap
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Predicted Cliff Lap</span>
            <span
              className={`text-lg font-mono font-bold ${
                snapshot.lap >= snapshot.predictedCliffLap - 2 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
              }`}
            >
              Lap {snapshot.predictedCliffLap}
            </span>
          </div>
        </div>

        {/* Tire Degradation Progress bar */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400 font-medium">Tire Wear & Structural Life</span>
            <span className="font-mono text-slate-300 font-bold">{tireWearPercent}% Worn</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                tireWearPercent > 75
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                  : 'bg-gradient-to-r from-emerald-500 to-amber-400'
              }`}
              style={{ width: `${tireWearPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Row 3: Pace Degradation Line Chart & Competitor Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Pace Degradation SVG Line Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> Pace Loss Curve
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Laps {snapshot.lap - 7} - {snapshot.lap}</span>
          </div>

          <div className="h-28 w-full relative pt-2">
            <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
              {/* Horizontal grid lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#334155" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="#475569" strokeWidth="1" />

              {/* Cliff Threshold Red Line */}
              <line x1="0" y1="25" x2="300" y2="25" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="220" y="20" fill="#ef4444" fontSize="8" fontWeight="bold">Tire Cliff Threshold</text>

              {/* Trend Polyline */}
              {(() => {
                const pointsStr = lapHistory
                  .map((pt, idx) => {
                    const x = (idx / (lapHistory.length - 1)) * 280 + 10;
                    const y = 75 - (pt.loss / 2.5) * 60;
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      points={pointsStr}
                    />
                    {lapHistory.map((pt, idx) => {
                      const x = (idx / (lapHistory.length - 1)) * 280 + 10;
                      const y = 75 - (pt.loss / 2.5) * 60;
                      return (
                        <circle
                          key={idx}
                          cx={x}
                          cy={y}
                          r={idx === lapHistory.length - 1 ? 4 : 2.5}
                          fill={idx === lapHistory.length - 1 ? '#ef4444' : '#f59e0b'}
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Competitor Intervals Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Rival Pit Window Gaps
            </span>
            <span className="text-[10px] text-slate-400">Pit Loss: ~21.4s</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {snapshot.competitors.map((comp) => (
              <div
                key={comp.code}
                className="flex items-center justify-between p-1.5 rounded bg-slate-950/80 border border-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300">P{comp.currentPosition}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: comp.teamColor }}
                  />
                  <span className="font-extrabold text-white">{comp.code}</span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    ({comp.tireCompound[0]} L{comp.tireAge})
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-semibold ${
                      comp.currentPosition < driver.currentPosition
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {comp.currentPosition < driver.currentPosition
                      ? `-${comp.gapAhead.toFixed(2)}s`
                      : `+${comp.gapBehind.toFixed(2)}s`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
