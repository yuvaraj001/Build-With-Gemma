import React from 'react';
import { Driver } from '../types';
import { Activity, Radio, Volume2, VolumeX, ShieldCheck, Zap, Layers, Trophy } from 'lucide-react';

interface HeaderProps {
  drivers: Driver[];
  selectedDriverCode: string;
  onSelectDriver: (code: string) => void;
  selectedGP: string;
  onSelectGP: (gp: string) => void;
  audioAlertEnabled: boolean;
  onToggleAudioAlert: () => void;
  openF1Connected: boolean;
  onOpenPitchDeck?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  drivers,
  selectedDriverCode,
  onSelectDriver,
  selectedGP,
  onSelectGP,
  audioAlertEnabled,
  onToggleAudioAlert,
  openF1Connected,
  onOpenPitchDeck,
}) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-900/40 tracking-tighter border border-red-400/30">
            APX
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-100 uppercase">
                Apex Strategy <span className="text-red-500">AI</span>
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> GEMMA 4 31B ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Multimodal, Multi-Agent Formula 1 Strategy Copilot
            </p>
          </div>
        </div>

        {/* Controls & Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Pitch Deck Button */}
          {onOpenPitchDeck && (
            <button
              onClick={onOpenPitchDeck}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 border border-amber-400/30 cursor-pointer transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span>Pitch Deck</span>
            </button>
          )}

          {/* GP Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">GP:</span>
            <select
              value={selectedGP}
              onChange={(e) => onSelectGP(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Silverstone" className="bg-slate-900 text-white">
                Silverstone GP 🇬🇧
              </option>
              <option value="Monza" className="bg-slate-900 text-white">
                Monza GP 🇮🇹
              </option>
              <option value="Yas Marina" className="bg-slate-900 text-white">
                Abu Dhabi GP 🇦🇪
              </option>
            </select>
          </div>

          {/* Driver Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Driver:</span>
            <select
              value={selectedDriverCode}
              onChange={(e) => onSelectDriver(e.target.value)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              {drivers.map((d) => (
                <option key={d.code} value={d.code} className="bg-slate-900 text-white">
                  #{d.driverNumber} {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                openF1Connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-300 font-medium text-[11px]">
              {openF1Connected ? 'OpenF1 Replay' : 'Stored Telemetry'}
            </span>
          </div>

          {/* Audio Alert Toggle */}
          <button
            onClick={onToggleAudioAlert}
            title={audioAlertEnabled ? 'Disable Voice Strategy Alert' : 'Enable Voice Strategy Alert'}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              audioAlertEnabled
                ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {audioAlertEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline font-semibold">
              {audioAlertEnabled ? 'Voice Alert ON' : 'Muted'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
