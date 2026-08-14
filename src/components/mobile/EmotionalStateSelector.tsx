/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Seletor Sensorial de Humor & Sintomas (Interatividade Tátil com IA)
 */

import React, { useState } from 'react';
import { audioVoice } from '../../utils/audioVoice';
import { 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  HeartHandshake, 
  Mic, 
  Volume2 
} from 'lucide-react';

interface EmotionalStateSelectorProps {
  soundEnabled: boolean;
  onOpenVoiceDiary: () => void;
}

export const EmotionalStateSelector: React.FC<EmotionalStateSelectorProps> = ({
  soundEnabled,
  onOpenVoiceDiary,
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const moods = [
    {
      id: 'BEM',
      emoji: '😊',
      label: 'Bem & Disposto',
      color: 'hover:bg-emerald-950/70 border-emerald-500/50 text-emerald-300',
      activeColor: 'bg-emerald-600 text-white border-emerald-400',
      feedback: 'Que ótima notícia! Manter a pressão e glicose equilibradas traz disposição.',
    },
    {
      id: 'CANSADO',
      emoji: '🥱',
      label: 'Cansado / Moleza',
      color: 'hover:bg-blue-950/70 border-blue-500/50 text-blue-300',
      activeColor: 'bg-blue-600 text-white border-blue-400',
      feedback: 'Descanse um pouco e beba água. Se o cansaço persistir, confira sua glicemia.',
    },
    {
      id: 'DOR_CABECA',
      emoji: '🤕',
      label: 'Dor de Cabeça / Nuca',
      color: 'hover:bg-amber-950/70 border-amber-500/50 text-amber-300',
      activeColor: 'bg-amber-600 text-white border-amber-400',
      feedback: 'Atenção: dor na nuca pode ser sinal de pressão alta. Vamos aferir agora?',
    },
    {
      id: 'TONTURAS',
      emoji: '😵',
      label: 'Tontura / Zonzo',
      color: 'hover:bg-rose-950/70 border-rose-500/50 text-rose-300',
      activeColor: 'bg-rose-600 text-white border-rose-400',
      feedback: 'Sente-se imediatamente! Tontura pode ser queda de pressão ou hipoglicemia.',
    },
    {
      id: 'ANSIOSO',
      emoji: '😰',
      label: 'Agitado / Ansioso',
      color: 'hover:bg-purple-950/70 border-purple-500/50 text-purple-300',
      activeColor: 'bg-purple-600 text-white border-purple-400',
      feedback: 'Inspire fundo pelo nariz e solte devagar pela boca. A respiração acalma suas artérias.',
    },
  ];

  const handleSelectMood = (mood: typeof moods[0]) => {
    setSelectedFeeling(mood.id);
    setAiFeedback(mood.feedback);
    audioVoice.playTone('click', soundEnabled);
    audioVoice.speakText(mood.feedback);
  };

  return (
    <div
      id="emotional-feeling-widget"
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg space-y-3.5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
            <span>Como você está se sentindo agora?</span>
          </h3>
          <p className="text-xs text-slate-400">
            Toque no seu estado para receber orientação clínica imediata
          </p>
        </div>

        <button
          onClick={onOpenVoiceDiary}
          className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 px-2.5 py-1.5 bg-purple-950/60 border border-purple-800/60 rounded-xl"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Falar por Voz</span>
        </button>
      </div>

      {/* Grid of feeling emojis */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {moods.map((m) => {
          const isSelected = selectedFeeling === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelectMood(m)}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all active:scale-95 min-h-[76px] ${
                isSelected
                  ? m.activeColor + ' shadow-lg scale-[1.03]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 ' + m.color
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[11px] font-bold leading-tight">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI Immediate Reaction Box */}
      {aiFeedback && (
        <div className="p-3.5 bg-gradient-to-r from-purple-950/70 to-slate-950 border border-purple-800/60 rounded-2xl flex items-start gap-2.5 text-xs text-purple-200 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">Orientação SEDA (IA Clínica):</span>
            <p className="leading-relaxed text-slate-200">{aiFeedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};
