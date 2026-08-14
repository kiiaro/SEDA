/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Cartão Digital do SUS Holográfico & Prontuário do Cidadão
 */

import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { audioVoice } from '../../utils/audioVoice';
import { 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  Share2, 
  X, 
  Hospital, 
  ShieldCheck, 
  HeartPulse, 
  User, 
  Volume2 
} from 'lucide-react';

interface SusCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  soundEnabled: boolean;
}

export const SusCardModal: React.FC<SusCardModalProps> = ({
  isOpen,
  onClose,
  profile,
  soundEnabled,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCNS = () => {
    navigator.clipboard.writeText(profile.cns);
    setCopied(true);
    audioVoice.playTone('success', soundEnabled);
    audioVoice.speakText(`Número do Cartão SUS copiado: ${profile.cns}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadCard = () => {
    audioVoice.speakText(
      `Cartão Nacional de Saúde de ${profile.name}. Número do CNS: ${profile.cns}. Unidade de Saúde: ${profile.ubsReference}, Equipe ${profile.esfTeam}, Agente de Saúde: ${profile.acsName}.`
    );
  };

  return (
    <div
      id="sus-card-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div
        id="sus-card-container"
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col space-y-4 p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="font-black text-white text-base">Cartão Digital do SUS</h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReadCard}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Ouvir dados do cartão"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HOLOGRAPHIC SUS CARD */}
        <div
          id="holographic-sus-card"
          className="w-full rounded-3xl p-5 bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-800 text-white shadow-xl shadow-teal-950/50 border border-white/20 relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Holographic light effect */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

          {/* Top Brand Bar */}
          <div className="flex items-center justify-between border-b border-white/20 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-white text-xs border border-white/30">
                SUS
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 block">
                  Sistema Único de Saúde
                </span>
                <span className="text-xs font-black text-white">Cartão Nacional de Saúde</span>
              </div>
            </div>
            <ShieldCheck className="w-6 h-6 text-emerald-200" />
          </div>

          {/* Cardholder name & CNS Number */}
          <div className="my-5 space-y-3 relative z-10">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-200/90 font-semibold block">
                Nome do Usuário
              </span>
              <h4 className="text-lg font-black tracking-tight text-white line-clamp-1">
                {profile.name}
              </h4>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-200/90 font-semibold block">
                Número CNS
              </span>
              <div className="text-xl font-mono font-black tracking-widest text-emerald-100">
                {profile.cns}
              </div>
            </div>
          </div>

          {/* Bottom metadata & Micro Barcode */}
          <div className="pt-3 border-t border-white/20 flex items-end justify-between text-xs relative z-10">
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-100 block">
                {profile.ubsReference}
              </span>
              <span className="text-[10px] font-bold text-white block">
                {profile.esfTeam} • {profile.acsName}
              </span>
            </div>

            <div className="p-1.5 bg-white rounded-xl shadow">
              <QrCode className="w-8 h-8 text-slate-950" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleCopyCNS}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copiar CNS</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              audioVoice.speakText('Link seguro do Cartão SUS compartilhado.');
              if (navigator.share) {
                navigator.share({
                  title: `Cartão SUS - ${profile.name}`,
                  text: `Cartão SUS: ${profile.cns} (${profile.ubsReference})`,
                }).catch(() => {});
              }
            }}
            className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
