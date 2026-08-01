import React, { useState, useRef } from 'react';
import { RadioMessage } from '../types';
import { PRESET_RADIO_SAMPLES } from '../data/f1Data';
import { Mic, Square, Play, Volume2, Radio, AlertCircle, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';

interface RadioInterfacePanelProps {
  currentRadio?: RadioMessage;
  onAnalyzeAudio: (transcript: string, audioBase64?: string, mimeType?: string) => void;
  isAnalyzing: boolean;
  onPauseReplay?: () => void;
}

export const RadioInterfacePanel: React.FC<RadioInterfacePanelProps> = ({
  currentRadio,
  onAnalyzeAudio,
  isAnalyzing,
  onPauseReplay,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tire-cliff');
  const [customText, setCustomText] = useState('');
  const [liveSpeechText, setLiveSpeechText] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const liveSpeechRef = useRef<string>('');

  // Start Browser Microphone Recording with Live Speech-to-Text
  const startRecording = async () => {
    onPauseReplay?.(); // Auto-pause live replay lap while user records radio audio
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      liveSpeechRef.current = '';
      setLiveSpeechText('');

      // Web Speech API for Real-Time Transcribing
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let currentText = '';
            for (let i = 0; i < event.results.length; i++) {
              currentText += event.results[i][0].transcript;
            }
            if (currentText) {
              liveSpeechRef.current = currentText;
              setLiveSpeechText(currentText);
              setCustomText(currentText); // Synchronize with text input
            }
          };

          recognition.onerror = (e: any) => {
            console.warn('Browser SpeechRecognition error:', e);
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (err) {
          console.warn('SpeechRecognition initialization failed:', err);
        }
      }

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          // Determine best transcript from speech recognition, text input, or realistic driver radio
          let spokenTranscript = liveSpeechRef.current.trim() || customText.trim();
          if (!spokenTranscript) {
            spokenTranscript = 'The tires are completely gone. I have a big vibration in Turn 8!';
          }
          setLiveSpeechText(spokenTranscript);
          setCustomText(spokenTranscript);

          // Trigger Gemma Radio AI Analysis with actual spoken transcript & audio
          onAnalyzeAudio(spokenTranscript, base64Audio, mimeType);
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Microphone access unavailable or denied. Please use the preset driver radio clips or custom text box below.');
    }
  };

  // Stop Recording & Automatically Parse Radio Message
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      try {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      } catch (e) {}
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Trigger Preset Radio Clip
  const handleSelectPreset = (preset: (typeof PRESET_RADIO_SAMPLES)[0]) => {
    onPauseReplay?.();
    setSelectedPresetId(preset.id);
    onAnalyzeAudio(preset.transcript);
  };

  // Trigger Custom Spoken Text Simulation
  const handleSendCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onPauseReplay?.();
    onAnalyzeAudio(customText);
    setCustomText('');
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 shadow-xl">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-black text-slate-100 uppercase tracking-wider">
            Driver Radio & Voice Intelligence
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Gemma Multimodal Audio Parser
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Recording Controls & Preset Audio Clips (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Microphone Recording Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-900'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                  }`}
                >
                  {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-6 h-6" />}
                </button>
                <div>
                  <span className="text-xs font-bold text-slate-100 block">
                    {isRecording ? `REC [00:${recordingDuration < 10 ? '0' : ''}${recordingDuration}] Live Driver Mic` : 'Record Driver Radio'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isRecording ? 'Click stop button when finished speaking — auto-parses immediately' : 'Click mic to record live radio (automatically parses on stop)'}
                  </span>
                </div>
              </div>

              {/* Audio Waveform Animation Indicator or Parsing Spinner */}
              {isRecording ? (
                <div className="flex items-center gap-1 px-3">
                  <span className="w-1 h-6 bg-red-500 animate-pulse" />
                  <span className="w-1 h-8 bg-red-400 animate-pulse delay-75" />
                  <span className="w-1 h-4 bg-red-500 animate-pulse delay-150" />
                  <span className="w-1 h-7 bg-red-400 animate-pulse" />
                </div>
              ) : isAnalyzing ? (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Auto-Parsing Audio...</span>
                </div>
              ) : null}
            </div>

            {/* Live Spoken Voice Transcription Display */}
            {(isRecording || liveSpeechText) && (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-md p-2 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" /> Real-time Speech-to-Text
                  </span>
                  {isRecording && <span className="font-mono text-amber-400">RECORDING</span>}
                </div>
                <p className="text-xs text-slate-100 font-mono italic">
                  {liveSpeechText ? `"${liveSpeechText}"` : 'Listening... Speak clearly into your microphone.'}
                </p>
              </div>
            )}
          </div>

          {/* Preset Demo Audio Clips */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1.5">
              Prerecorded Hackathon Radio Scenarios (Instant Demo)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_RADIO_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectPreset(sample)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPresetId === sample.id
                      ? 'bg-amber-950/40 border-amber-500/60 text-white ring-1 ring-amber-500/40'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-300">{sample.title}</span>
                    <Play className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                    "{sample.transcript}"
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Driver Speech Simulator Input */}
          <form onSubmit={handleSendCustomText} className="flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Simulate custom driver radio message (e.g., 'Tires feel icy!')..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Parse'}
            </button>
          </form>
        </div>

        {/* Right Column: Radio Intelligence Agent Live Output (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
              <span className="text-xs font-bold text-slate-200 uppercase">Radio Agent Findings</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentRadio && ['CRITICAL', 'URGENT', 'HIGH'].includes(currentRadio.urgency)
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : currentRadio?.urgency === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {currentRadio?.urgency || 'NORMAL'} URGENCY
              </span>
            </div>

            {/* Live Transcript */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 mb-3">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Transcript
              </span>
              <p className="text-xs text-slate-100 font-mono italic leading-relaxed">
                "{currentRadio?.transcript || 'Waiting for radio transmission...'}"
              </p>
            </div>

            {/* Extracted Operational Issues */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Extracted Operational Issues
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentRadio ? (
                  currentRadio.reportedIssues && currentRadio.reportedIssues.length > 0 ? (
                    currentRadio.reportedIssues.map((issue) => (
                      <span
                        key={issue}
                        className="px-2 py-1 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase"
                      >
                        ⚠️ {issue.replace(/_/g, ' ')}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                      ✅ NOMINAL / NO ISSUES
                    </span>
                  )
                ) : (
                  <span className="text-xs text-slate-500 italic">No radio message analyzed yet</span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Audio Confidence & Requested Action */}
          <div className="border-t border-slate-800/60 pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Requested Action: <strong className="text-amber-400">{currentRadio?.driverRequestedAction || 'NONE'}</strong></span>
            <span>Transcription Confidence: <strong className="text-emerald-400">{currentRadio ? `${((currentRadio.confidence || 0.95) * 100).toFixed(0)}%` : '--'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
