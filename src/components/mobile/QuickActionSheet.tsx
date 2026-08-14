/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Gaveta de Ações Rápidas (Bottom Action Sheet)
 */

import React from 'react';
import { audioVoice } from '../../utils/audioVoice';
import { 
  Mic, 
  Activity, 
  HeartPulse, 
  CalendarCheck, 
  PhoneCall, 
  X, 
  HeartHandshake, 
  Sparkles, 
  Plus 
} from 'lucide-react';

interface QuickActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
  soundEnabled: boolean;
  caregiverPhone?: string;
}

export const QuickActionSheet: React.FC<QuickActionSheetProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  soundEnabled,
  caregiverPhone = '(11) 99123-8877',
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'VOICE_DIARY',
      title: 'Falar no Diário dos Sentidos (IA)',
      subtitle: 'Grave como se sente sem digitar nada',
      icon: Mic,
      color: 'bg-purple-600 text-white',
      border: 'border-purple-500/50 hover:bg-purple-950/40',
    },
    {
      id: 'MEASURE_BP',
      title: 'Registrar Pressão Arterial',
      subtitle: 'Anotar valores do seu aparelho (ex: 120/80)',
      icon: HeartPulse,
      color: 'bg-rose-600 text-white',
      border: 'border-rose-500/50 hover:bg-rose-950/40',
    },
    {
      id: 'MEASURE_GLUCOSE',
      title: 'Registrar Glicemia Capilar',
      subtitle: 'Anotar ponta de dedo (em jejum ou pós-refeição)',
      icon: Activity,
      color: 'bg-emerald-600 text-white',
      border: 'border-emerald-500/50 hover:bg-emerald-950/40',
    },
    {
      id: 'BOOK_APPOINTMENT',
      title: 'Pedir Consulta / Encaixe UBS',
      subtitle: 'Agendar com Médico ou Enfermagem da Família',
      icon: CalendarCheck,
      color: 'bg-blue-600 text-white',
      border: 'border-blue-500/50 hover:bg-blue-950/40',
    },
    {
      id: 'CALL_CAREGIVER',
      title: `Avisar Cuidadora Familiar`,
      subtitle: `Ligar ou enviar mensagem imediata (${caregiverPhone})`,
      icon: HeartHandshake,
      color: 'bg-indigo-600 text-white',
      border: 'border-indigo-500/50 hover:bg-indigo-950/40',
    },
    {
      id: 'EMERGENCY_192',
      title: 'SOS SAMU 192 (Urgência Imediata)',
      subtitle: 'Em caso de dor no peito, desmaio ou crise grave',
      icon: PhoneCall,
      color: 'bg-red-600 text-white',
      border: 'border-red-500/80 bg-red-950/40 hover:bg-red-900/50',
    },
  ];

  return (
    <div
      id="quick-action-sheet-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="quick-action-sheet-content"
        className="w-full max-w-lg bg-slate-900 border-t border-slate-700 rounded-t-[32px] p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top grab bar & header */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto" />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">Ações Rápidas SEDA</h3>
              <p className="text-xs text-slate-400">O que você gostaria de fazer agora?</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action items list */}
        <div className="space-y-2.5 pt-2">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  audioVoice.playTone('click', soundEnabled);
                  onSelectAction(act.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all active:scale-98 ${act.border} bg-slate-950/60`}
              >
                <div className={`w-11 h-11 rounded-2xl ${act.color} flex items-center justify-center flex-shrink-0 shadow`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{act.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-1">{act.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
