import React from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface ReplayControlsProps {
  currentLap: number;
  totalLaps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  onSeekLap: (lap: number) => void;
}

export const ReplayControls: React.FC<ReplayControlsProps> = ({
  currentLap,
  totalLaps,
  isPlaying,
  onTogglePlay,
  onReset,
  speed,
  onChangeSpeed,
  onSeekLap,
}) => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-xl">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Play / Reset / Speed */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Reset to Lap 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <FastForward className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-0.5 rounded font-mono font-bold transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Lap Display Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 uppercase font-semibold">Race Progress:</span>
          <span className="text-lg font-mono font-black text-cyan-400">
            Lap {currentLap} / {totalLaps}
          </span>
        </div>
      </div>

      {/* Timeline Scrubber Slider */}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={totalLaps}
          value={currentLap}
          onChange={(e) => onSeekLap(Number(e.target.value))}
          className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500 border border-slate-800"
        />
      </div>
    </div>
  );
};

