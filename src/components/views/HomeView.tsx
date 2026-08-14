/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Dashboard Mobile Moderno & Interativo (Conexão Humanizada com o Usuário)
 */

import React, { useState } from 'react';
import { 
  UserProfile, 
  BloodPressureReading, 
  GlucoseReading, 
  Appointment, 
  SilenceMonitorStatus, 
  NavigationTab, 
  AppAccessibilitySettings,
  UserRole
} from '../../types';
import { audioVoice } from '../../utils/audioVoice';
import { DailyCareStories } from '../mobile/DailyCareStories';
import { EmotionalStateSelector } from '../mobile/EmotionalStateSelector';
import { 
  Mic, 
  Activity, 
  CalendarCheck, 
  HeartPulse, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  Volume2, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  ChevronRight,
  User,
  CreditCard,
  Plus,
  RefreshCw,
  BellRing
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HomeViewProps {
  profile: UserProfile;
  latestBP?: BloodPressureReading;
  latestGlucose?: GlucoseReading;
  nextAppointment?: Appointment;
  silenceStatus: SilenceMonitorStatus;
  settings: AppAccessibilitySettings;
  onNavigate: (tab: NavigationTab) => void;
  onOpenEmergency: () => void;
  onSimulateVoiceDiary: () => void;
  onOpenSusCard: () => void;
  onOpenAuth: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  latestBP,
  latestGlucose,
  nextAppointment,
  silenceStatus,
  settings,
  onNavigate,
  onOpenEmergency,
  onSimulateVoiceDiary,
  onOpenSusCard,
  onOpenAuth,
}) => {
  const isSimplified = settings.simplifiedIdosoMode;
  const [pulseBeating, setPulseBeating] = useState(false);

  const handleSimulateHeartbeat = () => {
    setPulseBeating(true);
    audioVoice.playTone('click', settings.audioFeedbackEnabled);
    audioVoice.speakText(
      `Frequência cardíaca atual: ${latestBP?.pulse || 72} batimentos por minuto. Ritmo sinusal regular.`
    );
    setTimeout(() => setPulseBeating(false), 3000);
  };

  const handleQuickGreeting = () => {
    audioVoice.speakText(
      `Olá, ${profile.name.split(' ')[0]}! Você está no SEDA. Sua pressão está estável em ${
        latestBP ? `${latestBP.systolic} por ${latestBP.diastolic}` : '12 por 8'
      }, e sua próxima consulta na UBS é em ${nextAppointment ? nextAppointment.date : 'breve'}.`
    );
  };

  return (
    <div id="mobile-home-dashboard" className="space-y-5 animate-fadeIn pb-24">
      {/* 1. Mobile Top Welcome Card with SUS Card Action & Quick Voice Read */}
      <div className="bg-gradient-to-br from-blue-900/90 via-slate-900 to-indigo-950/90 border border-blue-800/60 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            {/* User Avatar with role ring */}
            <button
              onClick={onOpenAuth}
              className="relative group transition-transform active:scale-95"
              title="Ver Perfil / Trocar Usuário"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                  <User className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-300 font-semibold">
                  {profile.role === 'PACIENTE'
                    ? 'Cidadão / Paciente'
                    : profile.role === 'CUIDADOR'
                    ? 'Cuidadora Familiar'
                    : profile.role === 'ACS'
                    ? 'Agente Comunitária (ACS)'
                    : 'Médico da Família'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  {profile.ubsReference.split(' ')[1] || 'UBS'}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight line-clamp-1">
                {profile.name}
              </h2>

              <p className="text-xs text-slate-300 line-clamp-1">
                {profile.conditions.join(' • ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Voice speak intro */}
            <button
              onClick={handleQuickGreeting}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors active:scale-95"
              title="Ouvir resumo do seu dia"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* View Digital SUS Card */}
            <button
              onClick={onOpenSusCard}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-950/40 border border-emerald-400/50 transition-transform active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Cartão SUS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Daily Care Stories (Water tracker, meds, diet tip) */}
      <DailyCareStories
        soundEnabled={settings.audioFeedbackEnabled}
        onOpenVoiceDiary={() => onNavigate('DIARIO_SENTIDOS')}
      />

      {/* 3. Emotional State Selector Widget (Touch & Voice Instant AI Response) */}
      <EmotionalStateSelector
        soundEnabled={settings.audioFeedbackEnabled}
        onOpenVoiceDiary={() => onNavigate('DIARIO_SENTIDOS')}
      />

      {/* 4. Giant Voice Diary AI Banner (Zero-Text Innovation) */}
      <div
        id="voice-diary-hero-card"
        onClick={() => onNavigate('DIARIO_SENTIDOS')}
        className="bg-gradient-to-r from-purple-950/90 via-indigo-950 to-slate-900 border-2 border-purple-500/70 rounded-3xl p-5 shadow-xl shadow-purple-950/40 cursor-pointer transition-all hover:scale-[1.01] active:scale-98 relative overflow-hidden group"
      >
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/60 group-hover:scale-110 transition-transform">
              <Mic className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-800 text-purple-200 border border-purple-400">
                  Zero-Text Interface
                </span>
                <span className="text-xs text-purple-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  IA Clínica SEDA
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Como você está se sentindo hoje?
              </h3>
              <p className="text-xs text-purple-200/90">
                Toque aqui e fale sem precisar digitar nada no teclado.
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-purple-800/60 text-purple-200 group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 5. Live Interactive Health Cards: Blood Pressure & Glucose */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Blood Pressure Live Card */}
        <div
          id="card-live-bp"
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-rose-950/80 text-rose-400 border border-rose-800/60 rounded-2xl">
                <HeartPulse className={`w-6 h-6 ${pulseBeating ? 'animate-ping' : ''}`} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Pressão Arterial</h4>
                <span className="text-[11px] text-slate-400">Última Aferição</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('MEDICOES')}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 px-3 py-1.5 bg-rose-950/50 border border-rose-800/50 rounded-xl transition-colors"
            >
              + Medir
            </button>
          </div>

          {latestBP ? (
            <div className="my-4 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {latestBP.systolic}
                  <span className="text-slate-400 font-semibold text-2xl">/</span>
                  {latestBP.diastolic}
                </span>
                <span className="text-xs text-slate-400 font-semibold">mmHg</span>

                <button
                  onClick={handleSimulateHeartbeat}
                  className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-[11px] text-slate-300 hover:text-white"
                  title="Ver pulso"
                >
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span>{latestBP.pulse || 72} BPM</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {latestBP.classification.replace(/_/g, ' ')}
                </span>
                <span className="text-slate-400 text-[11px]">
                  Peso: {latestBP.weightPercentage}%
                </span>
              </div>
            </div>
          ) : (
            <div className="my-4 text-xs text-slate-400">
              Nenhuma aferição recente cadastrada.
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Classificação SBC/SBH</span>
            <span className="text-rose-400 font-semibold">Meta &lt; 130/80</span>
          </div>
        </div>

        {/* Glucose Live Card */}
        <div
          id="card-live-glucose"
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-2xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Glicemia Capilar</h4>
                <span className="text-[11px] text-slate-400">Ponta de Dedo</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('MEDICOES')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 bg-emerald-950/50 border border-emerald-800/50 rounded-xl transition-colors"
            >
              + Medir
            </button>
          </div>

          {latestGlucose ? (
            <div className="my-4 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {latestGlucose.value}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  mg/dL ({latestGlucose.context})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="inline-flex items-center gap-1 font-bold text-teal-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {latestGlucose.classification.replace(/_/g, ' ')}
                </span>
                <span className="text-slate-400 text-[11px]">
                  Peso: {latestGlucose.weightPercentage}%
                </span>
              </div>
            </div>
          ) : (
            <div className="my-4 text-xs text-slate-400">
              Nenhuma glicemia cadastrada hoje.
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Classificação SBD</span>
            <span className="text-emerald-400 font-semibold">Alvo Jejum 70-99</span>
          </div>
        </div>
      </div>

      {/* 6. Upcoming Appointment & Silence Prevention Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Next Appointment Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-blue-950/80 text-blue-400 border border-blue-800/60 rounded-2xl">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Próxima Consulta UBS</h4>
                <span className="text-[11px] text-slate-400">{profile.ubsReference}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('CONSULTAS_SUS')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              Ver Agenda
            </button>
          </div>

          {nextAppointment ? (
            <div className="space-y-2 py-1">
              <h5 className="font-black text-white text-sm line-clamp-1">
                {nextAppointment.professionalName}
              </h5>
              <p className="text-xs text-slate-300">
                {nextAppointment.specialty.replace(/_/g, ' ')} • {nextAppointment.date} às {nextAppointment.timeSlot}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">
                  Status: {nextAppointment.status}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {profile.esfTeam}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-2">
              <p className="text-xs text-slate-400">Nenhum horário marcado no momento.</p>
              <button
                onClick={() => onNavigate('CONSULTAS_SUS')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
              >
                Agendar com Médico ou Enfermagem
              </button>
            </div>
          )}
        </div>

        {/* Silence Prevention / Active Search Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2.5 rounded-2xl border ${
                  silenceStatus.daysWithoutRecord >= 5
                    ? 'bg-red-950 border-red-700 text-red-400 animate-pulse'
                    : silenceStatus.daysWithoutRecord >= 3
                    ? 'bg-amber-950 border-amber-700 text-amber-400'
                    : 'bg-emerald-950 border-emerald-700 text-emerald-400'
                }`}
              >
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Alerta de Silêncio</h4>
                <span className="text-[11px] text-slate-400">Prevenção de Abandono</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('SILENCIO_RISCO')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              Ver Régua
            </button>
          </div>

          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Dias sem registro:</span>
              <span
                className={`font-black px-2 py-0.5 rounded-full text-xs ${
                  silenceStatus.daysWithoutRecord >= 5
                    ? 'bg-red-600 text-white'
                    : silenceStatus.daysWithoutRecord >= 3
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {silenceStatus.daysWithoutRecord === 0
                  ? 'Em dia'
                  : `${silenceStatus.daysWithoutRecord} dias`}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              {silenceStatus.daysWithoutRecord >= 5
                ? 'Alerta crítico na UBS: ACS Márcia fará visita domiciliar prioritária.'
                : silenceStatus.daysWithoutRecord >= 3
                ? 'Notificação enviada para a cuidadora Juliana para suporte.'
                : 'Você está protegido e em acompanhamento contínuo pela equipe.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
