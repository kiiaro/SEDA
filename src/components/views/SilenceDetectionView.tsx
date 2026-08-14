/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Mecanismo de Detecção de Silêncio (Prevenção de Abandono Terapêutico)
 */

import React, { useState } from 'react';
import { 
  SilenceMonitorStatus, 
  SilenceStage, 
  UserProfile, 
  AppAccessibilitySettings, 
  NavigationTab 
} from '../../types';
import { evaluateSilenceStage } from '../../utils/clinicalRules';
import { audioVoice } from '../../utils/audioVoice';
import { 
  BellRing, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  ShieldAlert, 
  Smartphone, 
  Send, 
  RotateCcw, 
  Activity, 
  Volume2, 
  HeartHandshake 
} from 'lucide-react';

interface SilenceDetectionViewProps {
  profile: UserProfile;
  silenceStatus: SilenceMonitorStatus;
  settings: AppAccessibilitySettings;
  onUpdateSilenceStatus: (status: SilenceMonitorStatus) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const SilenceDetectionView: React.FC<SilenceDetectionViewProps> = ({
  profile,
  silenceStatus,
  settings,
  onUpdateSilenceStatus,
  onNavigate,
}) => {
  const [simulationDays, setSimulationDays] = useState<number>(silenceStatus.daysWithoutRecord);

  const handleSimulateDays = (days: number) => {
    setSimulationDays(days);
    const stage = evaluateSilenceStage(days);

    let newLog = [...silenceStatus.notificationsLog];

    if (days >= 1 && days <= 2) {
      newLog.unshift({
        timestamp: new Date().toISOString(),
        target: 'PACIENTE',
        channel: 'PUSH',
        message: `Lembrete Preventivo: "Olá, Sr. ${profile.name}! Sentimos sua falta. Que tal registrar sua pressão hoje?"`,
      });
    } else if (days >= 3 && days <= 4) {
      newLog.unshift({
        timestamp: new Date().toISOString(),
        target: 'CUIDADOR',
        channel: 'WHATSAPP',
        message: `Alerta Cuidador (${profile.caregiverName}): "Atenção: ${profile.name} está há ${days} dias sem registros de pressão/glicose no SEDA."`,
      });
    } else if (days >= 5) {
      newLog.unshift({
        timestamp: new Date().toISOString(),
        target: 'UBS_ACS',
        channel: 'PAINEL_UBS',
        message: `🚨 Inclusão no Painel de Risco da UBS: Paciente ${profile.name} há ${days} dias sem registros. Priorizada busca ativa da ACS ${profile.acsName}.`,
      });
    }

    const updated: SilenceMonitorStatus = {
      daysWithoutRecord: days,
      lastRecordDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
      currentStage: stage,
      notificationsLog: newLog.slice(0, 8),
    };

    onUpdateSilenceStatus(updated);
    audioVoice.playTone(days >= 5 ? 'alert' : days >= 3 ? 'warning' : 'click', settings.audioFeedbackEnabled);

    if (settings.voiceReaderEnabled) {
      if (days >= 5) {
        audioVoice.speakText(
          `Atenção: 5 ou mais dias sem medições. O paciente foi incluído no Painel de Risco da Unidade Básica de Saúde para visita prioritária da Agente Comunitária.`
        );
      } else if (days >= 3) {
        audioVoice.speakText(
          `Alerta preventivo: 3 a 4 dias sem medições. Alerta automático enviado para a cuidadora.`
        );
      }
    }
  };

  const handleBreakSilence = () => {
    handleSimulateDays(0);
    onNavigate('MEDICOES');
  };

  return (
    <div id="silence-detection-view" className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-rose-950/80 border border-amber-900/50 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span>Combate ao Abandono Terapêutico (55-58% dos Pacientes Crônicos)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Mecanismo de Detecção de Silêncio
            </h2>
            <p className="text-amber-200/90 text-sm sm:text-base max-w-2xl mt-1 leading-relaxed">
              O SEDA monitora a inatividade de registros clínicos e ativa uma régua de escalada preventiva progressiva para garantir a continuidade do tratamento no SUS.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioVoice.speakText(
                  'Mecanismo de detecção de silêncio. Se você passar dias sem medir, o sistema avisa você, depois avisa seu familiar, e a partir do quinto dia avisa o posto de saúde para fazer uma visita.'
                );
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-900/50 hover:bg-amber-800 border border-amber-600/60 text-amber-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>Ouvir Explicação</span>
            </button>
          </div>
        </div>
      </div>

      {/* CURRENT STATUS HERO CARD */}
      <div
        className={`border-2 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 ${
          silenceStatus.daysWithoutRecord >= 5
            ? 'bg-red-950/90 border-red-500 shadow-red-950/50'
            : silenceStatus.daysWithoutRecord >= 3
            ? 'bg-amber-950/90 border-amber-500 shadow-amber-950/50'
            : silenceStatus.daysWithoutRecord >= 1
            ? 'bg-blue-950/90 border-blue-500 shadow-blue-950/50'
            : 'bg-emerald-950/90 border-emerald-500 shadow-emerald-950/50'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-950/80 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
              <Clock className="w-8 h-8 text-amber-400" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Status Atual do Monitoramento
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {silenceStatus.daysWithoutRecord === 0
                  ? 'Medições em Dia (Ativo)'
                  : `${silenceStatus.daysWithoutRecord} Dias sem Registros`}
              </h3>
            </div>
          </div>

          <button
            id="btn-break-silence"
            onClick={handleBreakSilence}
            className="px-5 py-3 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-black text-xs sm:text-sm min-h-[48px] shadow-lg flex items-center gap-2 transition-transform active:scale-95 flex-shrink-0"
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Registrar Medição Agora</span>
          </button>
        </div>

        {/* PROGRESSIVE ESCALATION TIMELINE (1-2d, 3-4d, 5+d) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          {/* Stage 1 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              silenceStatus.daysWithoutRecord >= 1 && silenceStatus.daysWithoutRecord <= 2
                ? 'bg-blue-900/80 border-blue-400 text-white ring-2 ring-blue-400/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase">1 a 2 Dias</span>
              {silenceStatus.daysWithoutRecord >= 1 && silenceStatus.daysWithoutRecord <= 2 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500 text-white">
                  ESTÁGIO ATUAL
                </span>
              )}
            </div>
            <h4 className="font-bold text-sm text-white mb-1">
              📱 Notificação Preventiva ao Paciente
            </h4>
            <p className="text-xs leading-relaxed">
              Disparo de lembrete carinhoso com linguagem empática estimulando o registro.
            </p>
          </div>

          {/* Stage 2 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              silenceStatus.daysWithoutRecord >= 3 && silenceStatus.daysWithoutRecord <= 4
                ? 'bg-amber-900/80 border-amber-400 text-white ring-2 ring-amber-400/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase">3 a 4 Dias</span>
              {silenceStatus.daysWithoutRecord >= 3 && silenceStatus.daysWithoutRecord <= 4 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white">
                  ESTÁGIO ATUAL
                </span>
              )}
            </div>
            <h4 className="font-bold text-sm text-white mb-1">
              👩‍👧 Alerta Imediato ao Cuidador
            </h4>
            <p className="text-xs leading-relaxed">
              Mensagem instantânea via SMS/WhatsApp para a familiar cadastrada ({profile.caregiverName}).
            </p>
          </div>

          {/* Stage 3 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              silenceStatus.daysWithoutRecord >= 5
                ? 'bg-red-900/80 border-red-400 text-white ring-2 ring-red-400/40 animate-pulse'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase">5+ Dias</span>
              {silenceStatus.daysWithoutRecord >= 5 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500 text-white">
                  RISCO CRÍTICO
                </span>
              )}
            </div>
            <h4 className="font-bold text-sm text-white mb-1">
              🚨 Inclusão no Painel de Risco UBS
            </h4>
            <p className="text-xs leading-relaxed">
              Acionamento compulsório da ACS ({profile.acsName}) para busca ativa ou encaixe prioritário.
            </p>
          </div>
        </div>
      </div>

      {/* SIMULATOR CONTROLS (TEST ESCALATION) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <span>Simulador Interativo da Régua do Silêncio</span>
          </h3>
          <span className="text-xs text-slate-400">Teste o comportamento do sistema</span>
        </div>

        <p className="text-xs text-slate-300">
          Altere os dias sem registros para verificar em tempo real como o SEDA escalona as mensagens de prevenção de abandono terapêutico:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleSimulateDays(0)}
            className={`p-3.5 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
              simulationDays === 0
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>0 Dias (Em Dia)</span>
          </button>

          <button
            onClick={() => handleSimulateDays(2)}
            className={`p-3.5 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
              simulationDays === 2
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-5 h-5 text-blue-300" />
            <span>2 Dias (Aviso Paciente)</span>
          </button>

          <button
            onClick={() => handleSimulateDays(4)}
            className={`p-3.5 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
              simulationDays === 4
                ? 'bg-amber-600 text-white border-amber-400 shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5 text-amber-300" />
            <span>4 Dias (Alerta Familiar)</span>
          </button>

          <button
            onClick={() => handleSimulateDays(6)}
            className={`p-3.5 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
              simulationDays === 6
                ? 'bg-red-600 text-white border-red-400 shadow-lg animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-red-300" />
            <span>6 Dias (Risco UBS / ACS)</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS LOG */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-400" />
          <span>Histórico de Notificações Preventivas Disparadas</span>
        </h3>

        <div className="space-y-2.5">
          {silenceStatus.notificationsLog.map((log, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-black px-2 py-0.5 rounded text-[10px] ${
                      log.target === 'UBS_ACS'
                        ? 'bg-red-950 text-red-300 border border-red-700'
                        : log.target === 'CUIDADOR'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700'
                        : 'bg-blue-950 text-blue-300 border border-blue-700'
                    }`}
                  >
                    Canal: {log.channel} • Destino: {log.target}
                  </span>
                  <span className="text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-slate-200 font-medium">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
