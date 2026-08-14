/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Diário dos Sentidos & Inteligência Artificial (Zero-Text Interface)
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  SenseDiaryEntry, 
  UserProfile, 
  BloodPressureReading, 
  GlucoseReading, 
  AppAccessibilitySettings, 
  Appointment 
} from '../../types';
import { audioVoice } from '../../utils/audioVoice';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  HeartHandshake, 
  CalendarPlus, 
  RotateCcw, 
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';

interface SenseDiaryViewProps {
  profile: UserProfile;
  latestBP?: BloodPressureReading;
  latestGlucose?: GlucoseReading;
  diaryEntries: SenseDiaryEntry[];
  settings: AppAccessibilitySettings;
  onSaveDiaryEntry: (entry: SenseDiaryEntry) => void;
  onRequestAppointmentBooking?: (reason: string, isPriority: boolean) => void;
}

export const SenseDiaryView: React.FC<SenseDiaryViewProps> = ({
  profile,
  latestBP,
  latestGlucose,
  diaryEntries,
  settings,
  onSaveDiaryEntry,
  onRequestAppointmentBooking,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<SenseDiaryEntry | null>(
    diaryEntries.length > 0 ? diaryEntries[0] : null
  );
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
    }
  }, []);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startVoiceRecording = () => {
    audioVoice.playTone('startRecord', settings.audioFeedbackEnabled);
    setIsRecording(true);
    setTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          if (current) {
            setTranscript(current);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
        };

        recognition.onend = () => {
          // If still marked as recording, restart or finish
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Could not start speech recognition:', err);
      }
    }
  };

  const stopVoiceRecording = () => {
    audioVoice.playTone('stopRecord', settings.audioFeedbackEnabled);
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }

    // If transcript is populated or user pressed stop, analyze immediately
    if (transcript.trim()) {
      handleAnalyzeTranscript(transcript);
    }
  };

  const handleAnalyzeTranscript = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;

    setIsProcessing(true);
    try {
      // Call server endpoint with Gemini 3.7 Flash
      const response = await fetch('/api/ai/diario-sentidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textReport: textToAnalyze,
          patientContext: {
            name: profile.name,
            age: profile.age,
            conditions: profile.conditions,
            lastBP: latestBP ? { systolic: latestBP.systolic, diastolic: latestBP.diastolic } : null,
            lastGlucose: latestGlucose ? { value: latestGlucose.value, context: latestGlucose.context } : null,
            daysSilent: 0,
          },
        }),
      });

      const data = await response.json();

      const newEntry: SenseDiaryEntry = {
        id: `diary-${Date.now()}`,
        patientId: profile.id,
        timestamp: new Date().toISOString(),
        audioDurationSeconds: recordingSeconds || 10,
        textTranscript: textToAnalyze,
        detectedSymptoms: data.detectedSymptoms || ['Sem queixas expressivas'],
        emotionalState: data.emotionalState || 'Estável',
        riskLevel: data.riskLevel || 'BAIXO',
        aiFeedback: data.friendlyMessage || 'Relato registrado com sucesso.',
        practicalAction: data.practicalAction || 'Mantenha suas medições em dia.',
        recommendAppointment: !!data.recommendAppointment,
        appointmentUrgency: data.appointmentUrgency || 'ROTINA',
        clinicalNoteForTeam: data.clinicalNoteForTeam || 'Relato diário processado por IA.',
        analyzedByAI: true,
      };

      setLatestAnalysis(newEntry);
      onSaveDiaryEntry(newEntry);
      audioVoice.playTone('success', settings.audioFeedbackEnabled);

      // Speak feedback automatically if voice reader is enabled
      if (settings.voiceReaderEnabled) {
        audioVoice.speakText(newEntry.aiFeedback);
      }
    } catch (error) {
      console.error('Error analyzing diary entry:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Sample quick templates for testing without microphone
  const applyQuickTemplate = (text: string) => {
    setTranscript(text);
    handleAnalyzeTranscript(text);
  };

  return (
    <div id="sense-diary-view" className="space-y-6 animate-fadeIn pb-12">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-900/50 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Zero-Text Interface • IA Clínica Gemini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Diário dos Sentidos
            </h2>
            <p className="text-purple-200/90 text-sm sm:text-base max-w-2xl mt-1 leading-relaxed">
              Você não precisa digitar. Apenas aperte o microfone roxo e conte como acordou, como se sente hoje, se teve tontura, dor de cabeça ou cansaço.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioVoice.speakText(
                  'Esta é a tela do Diário dos Sentidos. Toque no microfone grande no centro para gravar sua voz e relatar como está se sentindo hoje.'
                );
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-900/50 hover:bg-purple-800 border border-purple-600/60 text-purple-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Volume2 className="w-4 h-4 text-purple-300" />
              <span>Ouvir Instruções</span>
            </button>
          </div>
        </div>
      </div>

      {/* BIG MICROPHONE INTERACTION HERO */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 via-transparent to-transparent pointer-events-none" />

        <div className="space-y-2">
          <span className="text-xs font-black tracking-wider uppercase text-purple-400">
            {isRecording ? 'Gravando sua voz agora...' : 'Toque para falar'}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {isRecording ? `Ouvindo atentamente (${recordingSeconds}s)` : 'Como você está se sentindo hoje?'}
          </h3>
        </div>

        {/* Central Giant Pulsing Mic Button */}
        <div className="flex justify-center my-4">
          <button
            id="voice-diary-mic-main-btn"
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={isProcessing}
            aria-label={isRecording ? 'Parar gravação de voz' : 'Iniciar gravação de voz'}
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl relative select-none ${
              isRecording
                ? 'bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 scale-110 shadow-rose-900/60 animate-pulse ring-8 ring-rose-500/30'
                : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 hover:scale-105 shadow-purple-900/50 hover:shadow-purple-700/60 ring-4 ring-purple-400/20 active:scale-95'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-12 h-12 text-white animate-bounce" />
                <span className="text-xs font-black text-white mt-1 uppercase tracking-wide">
                  Toque p/ Concluir
                </span>
              </>
            ) : (
              <>
                <Mic className="w-14 h-14 text-white" />
                <span className="text-xs font-black text-white mt-1 uppercase tracking-wide">
                  Falar no Microfone
                </span>
              </>
            )}
          </button>
        </div>

        {/* Real-time transcript preview or manual input */}
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {isRecording ? 'Transcrição em tempo real:' : 'Seu relato de hoje:'}
            </label>
            <textarea
              id="diary-transcript-input"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Exemplo: 'Hoje acordei com um pouco de dor na nuca e tontura ao levantar da cama após o café...'"
              rows={3}
              className="w-full bg-transparent text-white text-sm sm:text-base border-0 focus:ring-0 p-0 placeholder-slate-500 resize-none font-medium leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>A IA analisa sintomas e cruza com sua pressão e glicemia</span>
            </div>

            {transcript.trim() && !isRecording && (
              <button
                id="btn-process-transcript"
                onClick={() => handleAnalyzeTranscript(transcript)}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black min-h-[44px] flex items-center gap-2 shadow-lg shadow-purple-950/50 transition-transform active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analisando com IA...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Processar Relato</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Quick test templates (Helpful for simulation or demo) */}
        <div className="pt-4 border-t border-slate-800 text-left max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-slate-400">
            Exemplos rápidos para testar o processador clínico:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                applyQuickTemplate(
                  'Acordei muito bem hoje, fiz uma caminhada leve e tomei a medicação certinho.'
                )
              }
              className="text-xs px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-lg transition-colors"
            >
              😊 Relato Positivo (Estável)
            </button>

            <button
              onClick={() =>
                applyQuickTemplate(
                  'Estou com dor de cabeça forte na nuca, tontura e a vista um pouco escura.'
                )
              }
              className="text-xs px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900 border border-amber-700/60 text-amber-300 rounded-lg transition-colors"
            >
              ⚠️ Suspeita de Pressão Alta
            </button>

            <button
              onClick={() =>
                applyQuickTemplate(
                  'Senti muita tremedeira, suor frio e fraqueza nas pernas antes do almoço.'
                )
              }
              className="text-xs px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 rounded-lg transition-colors"
            >
              🚨 Suspeita de Hipoglicemia
            </button>
          </div>
        </div>
      </div>

      {/* LATEST AI CLINICAL ANALYSIS CARD */}
      {latestAnalysis && (
        <div className="bg-slate-900/90 border border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-950 border border-purple-700 text-purple-400 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Parecer Clínico do Diário (IA SEDA)
                </h3>
                <span className="text-xs text-slate-400">
                  Registrado em {new Date(latestAnalysis.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-speak-ai-feedback"
                onClick={() => audioVoice.speakText(latestAnalysis.aiFeedback)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-900/60 hover:bg-purple-800 border border-purple-600 text-purple-200 rounded-xl text-xs font-bold min-h-[40px] transition-colors"
                title="Ouvir a mensagem de retorno"
              >
                <Volume2 className="w-4 h-4 text-purple-300" />
                <span>Ouvir Mensagem</span>
              </button>

              <span
                className={`text-xs font-black px-3 py-1.5 rounded-xl border ${
                  latestAnalysis.riskLevel === 'CRITICO_URGENCIA'
                    ? 'bg-red-950 text-red-300 border-red-600 animate-pulse'
                    : latestAnalysis.riskLevel === 'ALTO'
                    ? 'bg-rose-950 text-rose-300 border-rose-600'
                    : latestAnalysis.riskLevel === 'MODERADO'
                    ? 'bg-amber-950 text-amber-300 border-amber-600'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                }`}
              >
                Risco: {latestAnalysis.riskLevel.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Friendly empathetic message */}
          <div className="bg-purple-950/30 border border-purple-800/40 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-purple-400" />
              <span>Mensagem Acolhedora ao Paciente:</span>
            </h4>
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              "{latestAnalysis.aiFeedback}"
            </p>
          </div>

          {/* Actionable guidance & Symptoms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Practical Action */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Conduta Prática Imediata:
              </h5>
              <p className="text-sm font-semibold text-emerald-300">
                {latestAnalysis.practicalAction}
              </p>
            </div>

            {/* Symptoms Detected */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sintomas Subjetivos Detectados:
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {latestAnalysis.detectedSymptoms.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Triage & Recommendation to Book Appointment */}
          {latestAnalysis.recommendAppointment && (
            <div className="bg-blue-950/50 border border-blue-600 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-blue-400" />
                  <h5 className="font-bold text-white text-sm">
                    Recomendação de Marcação / Encaixe na UBS
                  </h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-800 text-blue-200">
                    Urgência: {latestAnalysis.appointmentUrgency}
                  </span>
                </div>
                <p className="text-xs text-blue-200">
                  Os sintomas relatados merecem avaliação presencial ou visita domiciliar com a equipe de Saúde da Família.
                </p>
              </div>

              {onRequestAppointmentBooking && (
                <button
                  onClick={() =>
                    onRequestAppointmentBooking(
                      `Sintomas no Diário: ${latestAnalysis.detectedSymptoms.join(', ')}`,
                      latestAnalysis.riskLevel === 'ALTO' || latestAnalysis.riskLevel === 'CRITICO_URGENCIA'
                    )
                  }
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-2 min-h-[44px] transition-transform active:scale-95 shadow-lg shadow-blue-950/50 flex-shrink-0"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Agendar na UBS</span>
                </button>
              )}
            </div>
          )}

          {/* Clinical note for ESF / ACS Prontuário */}
          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
            <FileText className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Nota para Prontuário UBS / e-SUS:</strong>{' '}
              {latestAnalysis.clinicalNoteForTeam}
            </div>
          </div>
        </div>
      )}

      {/* HISTORIC OF RECENT DIARY ENTRIES */}
      {diaryEntries.length > 1 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <span>Histórico de Relatos Anteriores</span>
          </h4>

          <div className="space-y-3">
            {diaryEntries.slice(1, 5).map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">
                    {new Date(entry.timestamp).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(entry.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    Risco: {entry.riskLevel}
                  </span>
                </div>
                <p className="text-slate-200 italic font-normal">"{entry.textTranscript}"</p>
                <div className="text-purple-300 font-medium">
                  <strong>Resposta:</strong> {entry.aiFeedback}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
