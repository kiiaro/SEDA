/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Protocolo de Alertas Críticos Imediatos & Emergência 192 (SAMU / SUS)
 */

import React, { useState } from 'react';
import { UserProfile, EmergencyAlert, AppAccessibilitySettings } from '../../types';
import { audioVoice } from '../../utils/audioVoice';
import { 
  PhoneCall, 
  AlertTriangle, 
  HeartPulse, 
  Activity, 
  ShieldAlert, 
  Volume2, 
  CheckCircle2, 
  Hospital, 
  Users, 
  Clock 
} from 'lucide-react';

interface EmergencyViewProps {
  profile: UserProfile;
  activeAlerts: EmergencyAlert[];
  settings: AppAccessibilitySettings;
  onClearAlerts?: () => void;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  profile,
  activeAlerts,
  settings,
  onClearAlerts,
}) => {
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<
    'CRISE_HIPERTENSIVA' | 'HIPOGLICEMIA_SEVERA'
  >('CRISE_HIPERTENSIVA');

  const handleSpeakGuidance = () => {
    if (selectedEmergencyType === 'CRISE_HIPERTENSIVA') {
      audioVoice.speakText(
        'Atenção para suspeita de Crise Hipertensiva. Sente-se confortavelmente e permaneça em repouso. Não tome remédios extras por conta própria. Se houver dor no peito, falta de ar ou visão dupla, ligue imediatamente para o SAMU 192.'
      );
    } else {
      audioVoice.speakText(
        'Atenção para Hipoglicemia Severa. Aplique a Regra dos 15: consuma 15 gramas de carboidrato rápido, como um copo de suco ou uma colher de açúcar na água. Aguarde 15 minutos e meça a glicemia novamente.'
      );
    }
  };

  return (
    <div id="emergency-view" className="space-y-6 animate-fadeIn pb-12">
      {/* Critical Alert Warning Header */}
      <div className="bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-center sm:text-left relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-900/60 flex-shrink-0 animate-bounce">
              <PhoneCall className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/80 border border-red-500 text-red-200 text-xs font-black mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-300" />
                <span>Protocolo de Emergência Médica • SUS 192</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Central de Emergência e Suporte
              </h2>
              <p className="text-red-200 text-xs sm:text-sm font-medium">
                Orientação imediata para picos de pressão, hipoglicemia e ligação de 1 toque ao SAMU.
              </p>
            </div>
          </div>

          {/* Big Red SOS Dial Buttons */}
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <a
              id="btn-call-samu-192"
              href="tel:192"
              className="px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl font-black text-base sm:text-lg min-h-[56px] shadow-2xl shadow-red-900/80 flex items-center gap-2 border-2 border-red-400 transition-transform active:scale-95 animate-pulse"
            >
              <PhoneCall className="w-6 h-6" />
              <span>Ligar SAMU 192</span>
            </a>

            <a
              id="btn-call-caregiver"
              href={`tel:${profile.caregiverPhone}`}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl font-bold text-xs sm:text-sm min-h-[48px] flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Ligar Cuidadora ({profile.caregiverName})</span>
            </a>
          </div>
        </div>
      </div>

      {/* Active System Alerts */}
      {activeAlerts.length > 0 && (
        <div className="bg-red-950/90 border-2 border-red-600 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              <span>Alertas Críticos Registrados ({activeAlerts.length})</span>
            </h3>
            {onClearAlerts && (
              <button
                onClick={onClearAlerts}
                className="text-xs text-red-400 hover:text-white font-bold underline"
              >
                Limpar Alertas
              </button>
            )}
          </div>

          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-950/80 border border-red-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-red-300 block text-sm">
                    {alert.type.replace(/_/g, ' ')}: {alert.triggerValue}
                  </span>
                  <span className="text-slate-400">
                    Registrado em {new Date(alert.timestamp).toLocaleTimeString('pt-BR')} • {alert.patientName}
                  </span>
                </div>

                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Encaixe prioritário UBS pré-reservado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Guidance Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedEmergencyType('CRISE_HIPERTENSIVA')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border transition-all min-h-[48px] flex items-center justify-center gap-2 ${
            selectedEmergencyType === 'CRISE_HIPERTENSIVA'
              ? 'bg-rose-950 border-rose-500 text-white shadow-lg'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <HeartPulse className="w-4 h-4 text-rose-400" />
          <span>Crise Hipertensiva (PA &gt; 180x110)</span>
        </button>

        <button
          onClick={() => setSelectedEmergencyType('HIPOGLICEMIA_SEVERA')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border transition-all min-h-[48px] flex items-center justify-center gap-2 ${
            selectedEmergencyType === 'HIPOGLICEMIA_SEVERA'
              ? 'bg-emerald-950 border-emerald-500 text-white shadow-lg'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Hipoglicemia Severa (&lt; 54 mg/dL)</span>
        </button>
      </div>

      {/* DETAILED FIRST AID PROTOCOL */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-black text-white">
              {selectedEmergencyType === 'CRISE_HIPERTENSIVA'
                ? 'Conduta Imediata para Crise Hipertensiva'
                : 'Conduta Imediata: Regra dos 15 para Hipoglicemia'}
            </h3>
            <span className="text-xs text-slate-400">
              Protocolo aprovado pelo Ministério da Saúde e Sociedades Médicas Brasileiras
            </span>
          </div>

          <button
            onClick={handleSpeakGuidance}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Ouvir Orientações em Voz Alta</span>
          </button>
        </div>

        {selectedEmergencyType === 'CRISE_HIPERTENSIVA' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">Repouso Absoluto</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sente-se ou deite-se com as costas levemente elevadas em local silencioso por pelo menos 10 a 15 minutos. Respire fundo e devagar.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">Não Automedique</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Não tome doses dobradas ou remédios sob a língua sem orientação médica. Quedas bruscas de pressão podem ser perigosas.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">Sinais de Alarme (SAMU 192)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Se sentir dor no peito irradiando para o braço, falta de ar severa, fala arrastada, visão turva ou fraqueza em um lado do corpo, <strong>chame o SAMU 192 imediatamente</strong>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">15g de Carboidrato Rápido</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ingerir imediatamente 1 copo (150ml) de suco de laranja natural, 1 copo de água com 1 colher de sopa de açúcar, ou 3 balas mastigáveis.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">Aguardar 15 Minutos</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Permaneça sentado e repita o teste com a fita de glicemia após 15 minutos. Se ainda estiver abaixo de 70 mg/dL, repita a ingestão.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">Refeição Leve / Suporte</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Assim que a glicemia normalizar, faça um lanche com proteína/carboidrato complexo (ex: pão integral ou bolacha com queijo) e avise seu cuidador.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* UBS Reference and Health Unit Emergency Details */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-xs text-slate-300 space-y-2">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Hospital className="w-4 h-4 text-blue-400" />
          <span>Unidade de Saúde de Referência: {profile.ubsReference}</span>
        </h4>
        <p className="text-slate-400">
          Equipe: {profile.esfTeam} • Endereço: Av. das Flores, 450 • Telefone: (11) 3456-7890 • Horário de Funcionamento: Segunda a Sexta, das 07:00 às 19:00.
        </p>
      </div>
    </div>
  );
};
