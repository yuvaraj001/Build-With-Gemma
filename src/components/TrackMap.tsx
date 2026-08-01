import React from 'react';
import { CIRCUITS_DATA, SILVERSTONE_LAYOUT } from '../data/f1Data';
import { Driver } from '../types';
import { Compass, Navigation, Gauge, Thermometer, CloudSun } from 'lucide-react';

interface TrackMapProps {
  selectedGP?: string;
  selectedDriver: Driver;
  competitors: Driver[];
  lapCompletionRatio: number; // 0 to 1
  trackTemp: number;
  weather: string;
}

export const TrackMap: React.FC<TrackMapProps> = ({
  selectedGP = 'Silverstone',
  selectedDriver,
  competitors,
  lapCompletionRatio,
  trackTemp,
  weather,
}) => {
  // Resolve circuit layout and metadata
  const circuitKey =
    selectedGP && (selectedGP.includes('Abu') || selectedGP.includes('Yas') ? 'Yas Marina' : selectedGP);
  const circuitInfo = CIRCUITS_DATA[circuitKey] || CIRCUITS_DATA['Silverstone'];
  const circuitLayout = circuitInfo.layout || SILVERSTONE_LAYOUT;

  // Helper to calculate (x,y) point along the circuit array based on distance ratio (0..1)
  const getPositionOnTrack = (ratio: number, offsetDistance = 0) => {
    const totalPoints = circuitLayout.length;
    const effectiveRatio = (ratio + offsetDistance + 1) % 1;
    const floatIndex = effectiveRatio * (totalPoints - 1);
    const index = Math.floor(floatIndex);
    const nextIndex = (index + 1) % totalPoints;
    const fraction = floatIndex - index;

    const p1 = circuitLayout[index];
    const p2 = circuitLayout[nextIndex];

    return {
      x: p1.x + (p2.x - p1.x) * fraction,
      y: p1.y + (p2.y - p1.y) * fraction,
    };
  };

  const selectedPos = getPositionOnTrack(lapCompletionRatio);

  // Competitors positions slightly offset by gap
  const competitorPositions = competitors.map((comp) => {
    const gapOffset = (comp.currentPosition - selectedDriver.currentPosition) * 0.04;
    return {
      driver: comp,
      pos: getPositionOnTrack(lapCompletionRatio, -gapOffset),
    };
  });

  // Construct SVG path string from track points
  const pathD = circuitLayout.reduce((acc, point, index) => {
    return `${acc} ${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[340px]">
      {/* Top Overlay Stats */}
      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-red-500 animate-spin-slow" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {circuitInfo.name}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-900 border border-slate-800 text-cyan-400">
            {circuitInfo.lengthKm}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>Track: <strong className="text-slate-200">{trackTemp}°C</strong></span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
            <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-200 font-semibold">{weather}</span>
          </div>
        </div>
      </div>

      {/* Track SVG Canvas */}
      <div className="relative w-full h-[250px] flex items-center justify-center">
        <svg
          viewBox="0 0 850 500"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(38,198,218,0.15)]"
        >
          <defs>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Outer Track Glow */}
          <path
            d={pathD}
            fill="none"
            stroke="#334155"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40"
          />

          {/* Main Circuit Track Asphalt */}
          <path
            d={pathD}
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Racing Line Guide */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#trackGradient)"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="opacity-70"
          />

          {/* Pit Lane Path */}
          <path
            d={circuitInfo.pitLaneD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <text
            x={circuitInfo.pitLaneTextPos.x}
            y={circuitInfo.pitLaneTextPos.y}
            fill="#f59e0b"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            PIT LANE
          </text>

          {/* Corner Markers & Numbers */}
          {circuitLayout.filter((p) => p.cornerNumber).map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="3" fill="#64748b" />
              <text
                x={p.x + 8}
                y={p.y + 4}
                fill="#94a3b8"
                fontSize="9"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                T{p.cornerNumber}
              </text>
            </g>
          ))}

          {/* Start / Finish Line */}
          <line
            x1={circuitInfo.startFinishLine.x1}
            y1={circuitInfo.startFinishLine.y1}
            x2={circuitInfo.startFinishLine.x2}
            y2={circuitInfo.startFinishLine.y2}
            stroke="#ffffff"
            strokeWidth="4"
          />
          <text
            x={circuitInfo.startFinishTextPos.x}
            y={circuitInfo.startFinishTextPos.y}
            fill="#ffffff"
            fontSize="10"
            fontWeight="extrabold"
            fontFamily="monospace"
          >
            FINISH
          </text>

          {/* Competitor Drivers Markers */}
          {competitorPositions.map(({ driver, pos }) => (
            <g key={driver.code} className="transition-all duration-300 ease-linear">
              <circle cx={pos.x} cy={pos.y} r="6" fill={driver.teamColor} opacity="0.9" />
              <circle cx={pos.x} cy={pos.y} r="8" fill="none" stroke={driver.teamColor} strokeWidth="1" />
              <text
                x={pos.x + 10}
                y={pos.y + 3}
                fill="#cbd5e1"
                fontSize="10"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                P{driver.currentPosition} {driver.code}
              </text>
            </g>
          ))}

          {/* Selected Driver Marker (Glowing & Pulsing) */}
          <g className="transition-all duration-300 ease-linear">
            {/* Pulsing ring */}
            <circle cx={selectedPos.x} cy={selectedPos.y} r="14" fill={selectedDriver.teamColor} opacity="0.25">
              <animate attributeName="r" values="10;18;10" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
            </circle>

            {/* Solid driver marker */}
            <circle
              cx={selectedPos.x}
              cy={selectedPos.y}
              r="8"
              fill={selectedDriver.teamColor}
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#glow-red)"
            />
            {/* Driver Badge Label */}
            <rect
              x={selectedPos.x - 24}
              y={selectedPos.y - 24}
              width="48"
              height="16"
              rx="4"
              fill="#090d16"
              stroke={selectedDriver.teamColor}
              strokeWidth="1.5"
            />
            <text
              x={selectedPos.x}
              y={selectedPos.y - 12}
              fill="#ffffff"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              fontFamily="monospace"
            >
              #{selectedDriver.driverNumber} {selectedDriver.code}
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Track Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 pt-2 z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Sector 1
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Sector 2
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Sector 3
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Gauge className="w-3 h-3" /> DRS Zone 1 Active
          </span>
        </div>
      </div>
    </div>
  );
};
