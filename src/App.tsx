import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { TrackMap } from './components/TrackMap';
import { TelemetryPanel } from './components/TelemetryPanel';
import { MultiAgentPanel } from './components/MultiAgentPanel';
import { RecommendationPanel } from './components/RecommendationPanel';
import { RadioInterfacePanel } from './components/RadioInterfacePanel';
import { ReplayControls } from './components/ReplayControls';
import { PitchDeckModal } from './components/PitchDeckModal';
import {
  INITIAL_DRIVERS,
  CIRCUITS_DATA,
  getSnapshotForLap,
  getStrategyAndRadioForLap,
} from './data/f1Data';
import {
  Driver,
  RadioMessage,
  StrategyRecommendation,
  TelemetrySnapshot,
} from './types';
import { Trophy, ShieldCheck } from 'lucide-react';

export default function App() {
  const [selectedGP, setSelectedGP] = useState<string>('Silverstone');
  const [selectedDriverCode, setSelectedDriverCode] = useState<string>('VER');
  const [currentLap, setCurrentLap] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [audioAlertEnabled, setAudioAlertEnabled] = useState<boolean>(true);
  const [openF1Connected, setOpenF1Connected] = useState<boolean>(true);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);

  const [userDecision, setUserDecision] = useState<'APPROVED' | 'REJECTED' | 'NONE'>('NONE');
  const [pitLap, setPitLap] = useState<number | null>(null);

  const totalLaps = CIRCUITS_DATA[selectedGP]?.totalLaps || 52;

  // Initial strategy for lap 1
  const initialStrat = getStrategyAndRadioForLap(1, selectedDriverCode, userDecision, pitLap);
  const [currentRadio, setCurrentRadio] = useState<RadioMessage | undefined>(undefined);
  const [recommendation, setRecommendation] = useState<StrategyRecommendation>(initialStrat.recommendation);

  const [isAnalyzingRadio, setIsAnalyzingRadio] = useState<boolean>(false);
  const lastSpokenActionRef = useRef<string>('');

  // SpeechSynthesis Web Audio alert for specific recommendation
  const speakStrategyAlert = (recToSpeak?: StrategyRecommendation) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const targetRec = recToSpeak || recommendation;
    let msg = '';
    if (targetRec.action === 'BOX_NOW') {
      msg = `Critical strategy alert. Box now for ${targetRec.targetCompound || 'hard'} tires. ${targetRec.reasoning}`;
    } else if (targetRec.action === 'STAY_OUT') {
      msg = `Strategy update. Stay out. ${targetRec.reasoning}`;
    } else if (targetRec.action === 'MONITOR') {
      msg = `Strategy status: Monitoring telemetry and tire degradation. ${targetRec.reasoning}`;
    } else {
      msg = `Strategy update. Action ${targetRec.action.replace('_', ' ')}. ${targetRec.reasoning}`;
    }

    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Synchronize Strategy Recommendation & Radio Message whenever currentLap, driver, or user decision changes
  useEffect(() => {
    const { recommendation: newRec, radioMessage: newRadio } = getStrategyAndRadioForLap(
      currentLap,
      selectedDriverCode,
      userDecision,
      pitLap
    );
    setRecommendation(newRec);
    setCurrentRadio(newRadio);

    // Speak strategy alert automatically if voice alert enabled and strategy action changed
    if (audioAlertEnabled && lastSpokenActionRef.current !== newRec.action) {
      speakStrategyAlert(newRec);
      lastSpokenActionRef.current = newRec.action;
    }
  }, [currentLap, selectedDriverCode, userDecision, pitLap, audioAlertEnabled]);

  // Derive current telemetry snapshot incorporating pit decision and elapsed lap
  const snapshot: TelemetrySnapshot = getSnapshotForLap(
    currentLap,
    selectedDriverCode,
    userDecision,
    pitLap
  );

  // Replay Animation Loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentLap((prev) => {
          if (prev >= totalLaps) {
            setIsPlaying(false);
            return totalLaps;
          }
          return prev + 1;
        });
      }, 2500 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, totalLaps]);

  // Handle Play/Pause toggle
  const handleTogglePlay = () => {
    if (!isPlaying && currentLap >= totalLaps) {
      setCurrentLap(1);
      setUserDecision('NONE');
      setPitLap(null);
      lastSpokenActionRef.current = '';
    }
    setIsPlaying(!isPlaying);
  };

  // Reset function
  const handleReset = () => {
    setCurrentLap(1);
    setIsPlaying(false);
    setUserDecision('NONE');
    setPitLap(null);
    setCurrentRadio(undefined);
    lastSpokenActionRef.current = '';
  };

  // Handle Strategy Recommendation Approval & Pit Confirmation
  const handleApprove = () => {
    setUserDecision('APPROVED');
    setPitLap(currentLap);
    setIsPlaying(true); // Resume live replay after human decision is made

    const ackRadio: RadioMessage = {
      id: `radio-ack-pit-lap-${currentLap}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      lap: currentLap,
      driverCode: selectedDriverCode,
      transcript: 'Copy that, box box box this lap! Pitting for fresh tires.',
      intent: 'PIT_ACKNOWLEDGEMENT',
      urgency: 'HIGH',
      reportedIssues: [],
      driverRequestedAction: 'PIT',
      confidence: 0.99,
    };
    setCurrentRadio(ackRadio);
  };

  // Handle Strategy Recommendation Rejection & Stay Out Confirmation
  const handleReject = () => {
    setUserDecision('REJECTED');
    setPitLap(null);
    setIsPlaying(true); // Resume live replay after human decision is made

    const ackRadio: RadioMessage = {
      id: `radio-ack-reject-lap-${currentLap}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      lap: currentLap,
      driverCode: selectedDriverCode,
      transcript: 'Understood, staying out! Managing current tire set on track.',
      intent: 'STAY_OUT_ACKNOWLEDGEMENT',
      urgency: 'NORMAL',
      reportedIssues: [],
      driverRequestedAction: 'STAY_OUT',
      confidence: 0.98,
    };
    setCurrentRadio(ackRadio);
  };

  // Call Server-Side Gemini API to analyze radio speech/text
  const handleAnalyzeAudio = async (transcriptText: string, audioBase64?: string, mimeType?: string) => {
    setIsPlaying(false); // Auto-pause live replay lap so human strategist can review & decide
    setIsAnalyzingRadio(true);
    try {
      const res = await fetch('/api/radio/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcriptText,
          audioBase64,
          mimeType,
          driverCode: selectedDriverCode,
          lap: currentLap,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentRadio(data.data);
        triggerSynthesis(currentLap, data.data);
      }
    } catch (err) {
      console.error('Radio AI analysis error:', err);
    } finally {
      setIsAnalyzingRadio(false);
    }
  };

  // Call Server-Side Gemma 4 31B API for Multi-Agent Analysis & Strategy Synthesis
  const triggerSynthesis = async (lap: number, radioObj?: RadioMessage) => {
    try {
      const currentSnap = getSnapshotForLap(lap, selectedDriverCode);

      // Trigger Telemetry, Competitor, and Strategy Coordinator Gemma calls in parallel
      const [telemetryRes, competitorRes, synthRes] = await Promise.allSettled([
        fetch('/api/agent/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telemetrySnapshot: currentSnap }),
        }),
        fetch('/api/agent/competitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telemetrySnapshot: currentSnap }),
        }),
        fetch('/api/strategy/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telemetrySnapshot: currentSnap,
            radioFinding: radioObj || currentRadio,
          }),
        }),
      ]);

      if (synthRes.status === 'fulfilled') {
        const data = await synthRes.value.json();
        if (data.success && data.recommendation) {
          setRecommendation(data.recommendation);
        }
      }
    } catch (err) {
      console.error('Strategy Synthesis error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Pit-Wall Copilot Top Navigation */}
      <Header
        drivers={INITIAL_DRIVERS}
        selectedDriverCode={selectedDriverCode}
        onSelectDriver={(code) => {
          setSelectedDriverCode(code);
          setUserDecision('NONE');
          setCurrentRadio(undefined);
        }}
        selectedGP={selectedGP}
        onSelectGP={(gp) => {
          setSelectedGP(gp);
          setCurrentLap(1);
          setIsPlaying(false);
          setUserDecision('NONE');
          setCurrentRadio(undefined);
        }}
        audioAlertEnabled={audioAlertEnabled}
        onToggleAudioAlert={() => setAudioAlertEnabled(!audioAlertEnabled)}
        openF1Connected={openF1Connected}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
      />

      {/* Main Dashboard Layout Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Replay Scrubber */}
        <ReplayControls
          currentLap={currentLap}
          totalLaps={totalLaps}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onReset={handleReset}
          speed={speed}
          onChangeSpeed={setSpeed}
          onSeekLap={(lap) => {
            setCurrentLap(lap);
            if (pitLap !== null && lap < pitLap) {
              setUserDecision('NONE');
              setPitLap(null);
            }
          }}
        />

        {/* Priority Area: Primary Strategy Recommendation Banner */}
        <RecommendationPanel
          recommendation={recommendation}
          onApprove={handleApprove}
          onReject={handleReject}
          userDecision={userDecision}
          onSpeakAlert={() => speakStrategyAlert()}
        />

        {/* Post-Human Decision Outcome Outcome Card */}
        {userDecision !== 'NONE' && (
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all shadow-xl ${
              userDecision === 'APPROVED'
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500/80 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block text-slate-300">
                  Projected Race Outcome Simulation
                </span>
                <p className="text-sm font-bold text-white">
                  {userDecision === 'APPROVED'
                    ? 'Fresh Hard Compound Pitted: Re-joins in P4, clean air pace projects P2 Podium finish.'
                    : 'Stayed Out: Severe tire degradation forces emergency pit on Lap 29. Projects P5 finish.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-white">
              <span>Expected Net Gain:</span>
              <strong className={userDecision === 'APPROVED' ? 'text-emerald-400' : 'text-rose-400'}>
                {userDecision === 'APPROVED' ? '+2 Positions' : '-3 Positions'}
              </strong>
            </div>
          </div>
        )}

        {/* Core 2-Column Grid: Left Circuit Track Map, Right Vehicle Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: 2D Track Map (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <TrackMap
              selectedGP={selectedGP}
              selectedDriver={snapshot.selectedDriver}
              competitors={snapshot.competitors}
              lapCompletionRatio={(currentLap * 0.17) % 1}
              trackTemp={snapshot.trackTemp}
              weather={snapshot.weather}
            />
          </div>

          {/* Right Column: Telemetry Gauges, Tire Degradation, Gaps (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <TelemetryPanel snapshot={snapshot} />
          </div>
        </div>

        {/* Multi-Agent System Panel (Telemetry, Competitor, Radio, Coordinator) */}
        <MultiAgentPanel
          telemetrySnapshot={snapshot}
          radioMessage={currentRadio}
          recommendation={recommendation}
        />

        {/* Radio Interface & Voice Intelligence Panel */}
        <RadioInterfacePanel
          currentRadio={currentRadio}
          onAnalyzeAudio={handleAnalyzeAudio}
          isAnalyzing={isAnalyzingRadio}
          onPauseReplay={() => setIsPlaying(false)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 py-3 text-center text-xs">
        <p className="font-medium">
          Apex Strategy AI — Every Agent. Every Signal. One Decision. Built for Formula 1 Strategy Teams.
        </p>
      </footer>

      {/* Interactive Pitch Deck Modal */}
      <PitchDeckModal isOpen={isPitchDeckOpen} onClose={() => setIsPitchDeckOpen(false)} />
    </div>
  );
}
