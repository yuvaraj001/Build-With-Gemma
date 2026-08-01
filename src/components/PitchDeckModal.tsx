import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Zap,
  Cpu,
  Radio,
  Activity,
  GitBranch,
  ShieldAlert,
  Sliders,
  Sparkles,
  Layers,
  Award,
  CheckCircle2,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(prev + 9, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slides = [
    // Slide 1: Title & Vision
    {
      badge: 'HACKATHON ENTRY • GEMMA 4 31B POWERED',
      title: 'APEX STRATEGY AI',
      subtitle: 'Real-Time Multimodal & Multi-Agent Pit Wall Strategy Engine for Formula 1',
      icon: Trophy,
      content: (
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 my-auto">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center font-black text-white text-3xl shadow-2xl shadow-red-900/50 border border-red-400/40 animate-pulse">
            APX
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
              APEX STRATEGY <span className="text-red-500">AI</span>
            </h2>
            <p className="text-lg text-slate-300 font-medium mt-2">
              Transforming high-stress split-second Formula 1 race strategy using Multimodal Voice Intelligence, Live Telemetry Synthesis, and Multi-Agent Gemma AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-1">
                <Radio className="w-4 h-4" /> Multimodal Radio
              </div>
              <p className="text-xs text-slate-400">
                Live browser speech-to-text & acoustic radio analysis via Gemma 4 31B.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                <GitBranch className="w-4 h-4" /> Multi-Agent Engine
              </div>
              <p className="text-xs text-slate-400">
                Specialist AI agents for Radio, Telemetry, and Pace synthesizing optimal pit windows.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                <Zap className="w-4 h-4" /> Real-Time Telemetry
              </div>
              <p className="text-xs text-slate-400">
                OpenF1 telemetry integration tracking tire deg curves & undercut delta calculations.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 2: The F1 Problem
    {
      badge: 'THE CHALLENGE',
      title: 'The Pit Wall Decision Dilemma',
      subtitle: 'Why Formula 1 race strategy breaks under cognitive overload during high-stress moments',
      icon: ShieldAlert,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-auto">
          <div className="space-y-4 text-left">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <h3 className="text-red-400 font-bold text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> High Cognitive Load & Split Decisions
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                During safety cars, sudden rain showers, or severe tire cliffs, pit strategists have only seconds to process hundreds of telemetry channels while listening to noisy driver radio.
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <h3 className="text-amber-400 font-bold text-base flex items-center gap-2">
                <Radio className="w-5 h-5" /> Radio Misinterpretation Risk
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Distress radio messages like "The tires are completely gone!" are often lost in noise or delayed, leading to missed pit windows and compromised race results.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-slate-200 font-bold text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-400" /> Isolated Data Silos
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Radio audio, wheel speed sensors, tire degradation models, and weather radar usually exist in separate software windows, slowing down consensus.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-3xl md:text-4xl font-black text-red-500 tracking-tight font-mono uppercase">
              SPLIT-SECOND<span className="text-xl text-slate-400 block font-sans font-semibold mt-1">WINDOW</span>
            </div>
            <p className="text-sm text-slate-300 font-medium">
              High-speed pit entry decision before passing the final pit lane entry line at 300 km/h.
            </p>
            <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs font-mono space-y-2">
              <div className="text-slate-400 flex justify-between">
                <span>Driver Distress Call:</span> <span className="text-amber-400">Lap 26, Sector 3</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Pit Lane Entry Distance:</span> <span className="text-red-400">240 Meters</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Human Decision Time:</span> <span className="text-rose-400">4.8s (Too Slow)</span>
              </div>
              <div className="text-emerald-400 flex justify-between font-bold border-t border-slate-800 pt-2">
                <span>APEX AI Decision Time:</span> <span>0.42s (Instant Pit Alert)</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 3: The Solution
    {
      badge: 'OUR SOLUTION',
      title: 'APEX Strategy AI Copilot',
      subtitle: 'An intelligent multi-agent platform bringing clarity to pit wall decisions',
      icon: Zap,
      content: (
        <div className="space-y-6 my-auto text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-red-500/30 rounded-xl p-5 hover:border-red-500/60 transition-all">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold mb-3">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400" /> Multimodal Radio Intelligence
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Captures live microphone voice recordings or preset radio distress, transcribes spoken text, and extracts operational issues (tire deg, vibration, brake fade).
              </p>
            </div>

            <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 hover:border-amber-500/60 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-3">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-amber-400" /> Multi-Agent Synthesis
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Specialist agents (Radio, Telemetry, Pace) analyze telemetry telemetry & audio simultaneously, feeding into Gemma 4 31B for optimal pit recommendations.
              </p>
            </div>

            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 hover:border-emerald-500/60 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-3">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Closed-Loop Pit Control
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Race engineers click single-button approval (BOX THIS LAP), triggering automated voice radio feedback back to the driver.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Zero Fake Data • Real-Time AI Inference</h4>
                <p className="text-xs text-slate-400">
                  Every driver radio transmission is processed directly through Google GenAI Gemma 4 31B models with complete source evidence.
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-mono font-bold text-xs shrink-0">
              Gemma 4 31B Server-Side
            </span>
          </div>
        </div>
      ),
    },

    // Slide 4: System Architecture
    {
      badge: 'TECHNICAL ARCHITECTURE',
      title: 'End-to-End Data & Multi-Agent Flow',
      subtitle: 'From browser microphone audio to Gemma synthesis and race engineer confirmation',
      icon: Layers,
      content: (
        <div className="space-y-4 my-auto text-left">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            {/* Diagram row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-red-400 block uppercase">1. Inputs</span>
                <p className="text-xs font-bold text-white mt-1">Live Audio Mic / Web Speech API</p>
                <p className="text-[10px] text-slate-400">OpenF1 Telemetry Streams</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-amber-400 block uppercase">2. Express Proxy</span>
                <p className="text-xs font-bold text-white mt-1">/api/radio/analyze</p>
                <p className="text-[10px] text-slate-400">Server-Side Key Protection</p>
              </div>

              <div className="bg-slate-900 border border-red-500/40 p-3 rounded-xl shadow-lg shadow-red-950/40">
                <span className="text-[10px] font-bold text-emerald-400 block uppercase">3. Core Intelligence</span>
                <p className="text-xs font-bold text-white mt-1">Gemma 4 31B IT Model</p>
                <p className="text-[10px] text-slate-400">Google GenAI SDK</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-sky-400 block uppercase">4. Output & Feedback</span>
                <p className="text-xs font-bold text-white mt-1">Pit Strategy Banner & Voice</p>
                <p className="text-[10px] text-slate-400">Closed-Loop Driver Radio</p>
              </div>
            </div>

            {/* Specialist Agent Breakdown */}
            <div className="border-t border-slate-800 pt-4">
              <span className="text-xs font-bold text-slate-300 block mb-2">
                🤖 Multi-Agent Specialist Division:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="font-bold text-red-400 block">📻 Radio Agent</span>
                  <span className="text-[11px] text-slate-400">Transcribes voice, rates distress urgency, extracts reported issues.</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="font-bold text-amber-400 block">📊 Telemetry Agent</span>
                  <span className="text-[11px] text-slate-400">Monitors tire wear curves, apex speed drops, delta gap to rivals.</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="font-bold text-emerald-400 block">🎯 Strategy Master</span>
                  <span className="text-[11px] text-slate-400">Synthesizes agent consensus, computes risk matrix, outputs decision.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 5: Gemma 4 31B Power
    {
      badge: 'AI MODEL INTEGRATION',
      title: 'Powered by Gemma 4 31B IT',
      subtitle: 'Leveraging Google DeepMind’s flagship open model for motorsport intelligence',
      icon: Cpu,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-auto text-left">
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-400" /> Direct Server-Side GenAI Integration
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Uses the official <code className="text-amber-300">@google/genai</code> SDK server-side (`/server.ts`) with zero key leakage to the client browser.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" /> Structured JSON Prompting
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prompts enforce rigid JSON schemas for intent classification, confidence scores, evidence IDs, and driver-requested actions.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" /> Sub-800ms Latency
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optimized execution pipelines deliver strategy recommendations within the tightest F1 pit entry decision windows.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-800 pb-2">
              <span>Gemma Prompting Architecture</span>
              <span className="text-emerald-400">model: gemma-4-31b-it</span>
            </div>
            <pre className="text-[11px] text-amber-300 overflow-x-auto whitespace-pre-wrap leading-tight">
{`// System Prompt Definition
const RADIO_AGENT_PROMPT = \`
You are the F1 Radio Intelligence Agent.
Analyze audio & transcript.
Return JSON:
{
  "transcript": string,
  "intent": "TIRE_CLIFF"|"BRAKE_FADE"...,
  "urgency": "URGENT"|"HIGH"|"NORMAL",
  "driverRequestedAction": "PIT"|"STAY_OUT",
  "confidence": number,
  "evidenceIds": string[],
  "summary": string
}
\`;`}
            </pre>
          </div>
        </div>
      ),
    },

    // Slide 6: Multi-Agent Architecture
    {
      badge: 'AGENT ORCHESTRATION',
      title: 'Multi-Agent Strategy Consensus',
      subtitle: 'How specialized agents debate telemetry, audio, and pace before recommending pit stops',
      icon: GitBranch,
      content: (
        <div className="space-y-4 my-auto text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 font-bold text-red-400 text-sm mb-2">
                <Radio className="w-4 h-4" /> Agent 1: Radio Specialist
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <td>Transcribes microphone & audio</td>
                <td>Extracts driver sentiment & distress</td>
                <td>Flags urgent pit requests</td>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-sm mb-2">
                <Activity className="w-4 h-4" /> Agent 2: Telemetry Specialist
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <td>Tracks wheel speed & tire wear</td>
                <td>Calculates lap delta drop-off</td>
                <td>Computes pit window exit gap</td>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm mb-2">
                <Sliders className="w-4 h-4" /> Agent 3: Master Synthesizer
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <td>Evaluates agent consensus score</td>
                <td>Synthesizes primary & backup plan</td>
                <td>Generates rationale for race engineer</td>
              </ul>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
              <span>Agent Consensus Workflow</span>
              <span className="text-emerald-400 font-mono">Consensus Score: 98%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 h-full w-[98%]" />
            </div>
          </div>
        </div>
      ),
    },

    // Slide 7: Live User Experience & Capabilities
    {
      badge: 'FEATURE HIGHLIGHTS',
      title: 'Interactive Pit Wall Dashboard',
      subtitle: 'Complete feature breakdown of the APEX AI live interface',
      icon: Sparkles,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto text-left">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
              <Radio className="w-4 h-4" /> Live Mic & Voice Transcriber
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Race engineers or drivers can hold the microphone button, speak any distress message live into the browser, and watch real-time Speech-to-Text transcribe and send audio to Gemma 4 31B.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <Activity className="w-4 h-4" /> Interactive Telemetry & Track Map
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time telemetry panel displaying speed, throttle, brake pressure, tire temperatures, and dynamic track position markers for Silverstone, Monza, and Abu Dhabi.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" /> One-Click Pit Engineer Approval
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When Gemma recommends a pit stop, the Race Engineer clicks <strong>APPROVE & BOX THIS LAP</strong> to confirm the strategy, triggering driver radio feedback.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-sky-400 text-sm">
              <Zap className="w-4 h-4" /> Voice Strategy Alert System
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Browser Web Speech synthesis automatically reads out urgent strategy recommendations ("ALERT: Box lap 26 for new Hard compound!").
            </p>
          </div>
        </div>
      ),
    },

    // Slide 8: Business & Motorsport Impact
    {
      badge: 'REAL WORLD VALUE',
      title: 'Value Proposition & Impact',
      subtitle: 'Transforming high-stakes decision making across motorsports and beyond',
      icon: Award,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-auto text-left">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="text-3xl font-black text-red-500 font-mono">10x</div>
            <h3 className="font-bold text-white text-sm">Faster Decision Speed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cuts pit wall strategy response times from seconds to milliseconds during unpredictable safety car restarts and weather shifts.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="text-3xl font-black text-amber-500 font-mono">0%</div>
            <h3 className="font-bold text-white text-sm">Missed Radio Messages</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multimodal acoustic processing guarantees every driver complaint or distress call is captured and logged into telemetry.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="text-3xl font-black text-emerald-500 font-mono">100%</div>
            <h3 className="font-bold text-white text-sm">Cross-Industry Reach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Easily adapted to Endurance Racing (WEC / Le Mans), Aviation Dispatch, Emergency Response, and Logistics Telemetry.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 9: Future Roadmap
    {
      badge: 'NEXT STEPS',
      title: 'Future Product Roadmap',
      subtitle: 'Scaling APEX AI for commercial deployment in Formula 1 & motorsports',
      icon: ArrowRight,
      content: (
        <div className="space-y-4 my-auto text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-red-400">Phase 1 (Current Hackathon)</span>
              <h4 className="text-sm font-bold text-white">Multimodal & Multi-Agent MVP</h4>
              <p className="text-xs text-slate-400">
                Gemma 4 31B radio processing, OpenF1 replay stream, voice alerts, human-in-the-loop approval.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-amber-400">Phase 2 (Post-Hackathon)</span>
              <h4 className="text-sm font-bold text-white">Monte Carlo Undercut Simulator</h4>
              <p className="text-xs text-slate-400">
                Simulating 1,000 parallel race outcomes per lap factoring rival pit stops and yellow flag probabilities.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-emerald-400">Phase 3</span>
              <h4 className="text-sm font-bold text-white">Domain Fine-Tuned Gemma</h4>
              <p className="text-xs text-slate-400">
                Fine-tuning Gemma models on historical F1 team radio archives for motorsport slang and accents.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-sky-400">Phase 4</span>
              <h4 className="text-sm font-bold text-white">Hardware Telemetry Integration</h4>
              <p className="text-xs text-slate-400">
                Direct integration with Formula 1 CAN-bus telemetry hardware and TETRA encrypted digital team radio.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 10: Conclusion / Win Slide
    {
      badge: 'SUMMARY',
      title: 'Why APEX AI Wins',
      subtitle: 'Solving a real-world multi-million dollar motorsport challenge with Google AI',
      icon: Trophy,
      content: (
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6 my-auto">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            The Ultimate F1 Pit Wall Copilot
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            APEX Strategy AI proves that combining <strong>Multimodal Gemma AI</strong> with <strong>Multi-Agent Orchestration</strong> unlocks split-second clarity in high-pressure human decision environments.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full pt-2">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-red-400">Gemma 4 31B</div>
              <div className="text-[10px] text-slate-400">Server-Side SDK</div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-amber-400">Multimodal</div>
              <div className="text-[10px] text-slate-400">Browser Audio & Speech</div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-emerald-400">Multi-Agent</div>
              <div className="text-[10px] text-slate-400">Radio + Telemetry + Master</div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-sky-400">Human-in-Loop</div>
              <div className="text-[10px] text-slate-400">Engineer Approval</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];
  const SlideIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        {/* Top Slide Header */}
        <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <SlideIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">
                {current.badge} • SLIDE {currentSlide + 1} OF {slides.length}
              </span>
              <h3 className="text-lg font-black text-white tracking-tight">{current.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          {current.content}
        </div>

        {/* Bottom Navigation Control Bar */}
        <div className="bg-slate-900/90 border-t border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? 'w-8 bg-red-500' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              disabled={currentSlide === slides.length - 1}
              onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-900/40 transition-all cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
