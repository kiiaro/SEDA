/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Pílulas de Cuidado Diário (Stories Interativos & Metas Hápticas)
 */

import React, { useState } from 'react';
import { audioVoice } from '../../utils/audioVoice';
import { 
  Droplet, 
  Pill, 
  Apple, 
  Footprints, 
  Sparkles, 
  Check, 
  Plus, 
  Volume2, 
  Heart, 
  Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyCareStoriesProps {
  soundEnabled: boolean;
  onOpenVoiceDiary: () => void;
}

export const DailyCareStories: React.FC<DailyCareStoriesProps> = ({
  soundEnabled,
  onOpenVoiceDiary,
}) => {
  // Water counter state (Target: 8 glasses)
  const [waterGlasses, setWaterGlasses] = useState(5);
  const targetGlasses = 8;

  // Medicines checklist
  const [meds, setMeds] = useState([
    { id: 1, name: 'Losartana 50mg', time: '08:00', taken: true, period: 'Manhã' },
    { id: 2, name: 'Metformina 850mg', time: '12:30', taken: true, period: 'Almoço' },
    { id: 3, name: 'Metformina 850mg', time: '20:00', taken: false, period: 'Jantar' },
  ]);

  const [activeStoryModal, setActiveStoryModal] = useState<string | null>(null);

  const handleAddWater = () => {
    const next = Math.min(waterGlasses + 1, targetGlasses + 4);
    setWaterGlasses(next);
    audioVoice.playTone('success', soundEnabled);

    if (next === targetGlasses) {
      audioVoice.speakText('Parabéns! Você atingiu a meta de 2 litros de água hoje!');
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
        });
      } catch (_) {}
    } else {
      audioVoice.speakText(`Mais um copo de água registrado! Total: ${next} copos.`);
    }
  };

  const handleToggleMed = (id: number) => {
    setMeds((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextTaken = !m.taken;
          audioVoice.playTone(nextTaken ? 'success' : 'click', soundEnabled);
          if (nextTaken) {
            audioVoice.speakText(`Remédio ${m.name} das ${m.time} marcado como tomado.`);
            try {
              confetti({ particleCount: 25, spread: 45 });
            } catch (_) {}
          }
          return { ...m, taken: nextTaken };
        }
        return m;
      })
    );
  };

  return (
    <div className="space-y-3">
      {/* Section title */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Metas & Pílulas de Cuidado do Dia</span>
        </h3>
        <span className="text-[11px] text-emerald-400 font-semibold">
          {meds.filter((m) => m.taken).length}/{meds.length} Remédios • {waterGlasses}/{targetGlasses} Água
        </span>
      </div>

      {/* Horizontal Story Cards Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
        {/* Card 1: Hidratação Interativa */}
        <div
          id="story-card-water"
          className="flex-shrink-0 w-44 sm:w-48 bg-gradient-to-br from-blue-950/80 to-slate-900 border border-blue-800/50 rounded-2xl p-3.5 shadow-md relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Droplet className="w-5 h-5 fill-blue-400" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-900/80 text-blue-200 border border-blue-700">
              {Math.round((waterGlasses / targetGlasses) * 100)}%
            </span>
          </div>

          <div className="my-2">
            <h4 className="font-bold text-white text-xs">Água (2 Litros)</h4>
            <p className="text-[11px] text-slate-300">
              {waterGlasses} de {targetGlasses} copos (250ml)
            </p>
            {/* Mini progress bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-blue-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (waterGlasses / targetGlasses) * 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleAddWater}
            className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Beber Copo</span>
          </button>
        </div>

        {/* Card 2: Remédios do Dia */}
        <div
          id="story-card-meds"
          className="flex-shrink-0 w-56 sm:w-60 bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-800/50 rounded-2xl p-3.5 shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Pill className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-900/80 text-indigo-200 border border-indigo-700">
              Hiperdia
            </span>
          </div>

          <div className="space-y-1.5 my-1">
            {meds.map((m) => (
              <button
                key={m.id}
                onClick={() => handleToggleMed(m.id)}
                className={`w-full p-1.5 rounded-lg text-left flex items-center justify-between text-[11px] transition-all border ${
                  m.taken
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 line-through opacity-80'
                    : 'bg-slate-900 border-slate-700 text-white hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      m.taken
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-500'
                    }`}
                  >
                    {m.taken && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-semibold line-clamp-1">{m.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{m.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card 3: Dica Alimentar SBD */}
        <div
          id="story-card-food-tip"
          className="flex-shrink-0 w-48 sm:w-52 bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-800/50 rounded-2xl p-3.5 shadow-md flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-colors"
          onClick={() => {
            audioVoice.speakText(
              'Dica da Nutricionista do SUS: coma frutas com casca ou aveia para reduzir o pico de glicemia.'
            );
          }}
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Apple className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-300">Dica SUS</span>
          </div>

          <div className="my-2">
            <h4 className="font-bold text-white text-xs">Frutas & Fibras</h4>
            <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
              Consuma maçã com casca e aveia para evitar picos de açúcar no sangue.
            </p>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Toque para ouvir</span>
          </div>
        </div>

        {/* Card 4: Alongamento Leve */}
        <div
          id="story-card-exercise"
          className="flex-shrink-0 w-44 sm:w-48 bg-gradient-to-br from-purple-950/80 to-slate-900 border border-purple-800/50 rounded-2xl p-3.5 shadow-md flex flex-col justify-between cursor-pointer hover:border-purple-400 transition-colors"
          onClick={() => {
            audioVoice.speakText(
              'Caminhada leve de 15 minutos na praça do bairro ajuda a baixar a pressão arterial sistólica.'
            );
          }}
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Footprints className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-300">Caminhada</span>
          </div>

          <div className="my-2">
            <h4 className="font-bold text-white text-xs">15 Minutos ao Dia</h4>
            <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
              Movimento suave melhora a circulação e alivia o estresse nas artérias.
            </p>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-purple-300 font-bold">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ouvir orientação</span>
          </div>
        </div>
      </div>
    </div>
  );
};
