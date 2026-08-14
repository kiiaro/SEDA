/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Cabeçalho do SUS / Atenção Primária & Perfil do Cidadão
 */

import React from 'react';
import { UserProfile, UserRole, EmergencyAlert } from '../types';
import { audioVoice } from '../utils/audioVoice';
import { 
  HeartPulse, 
  PhoneCall, 
  AlertTriangle, 
  Hospital, 
  ShieldCheck, 
  Sparkles, 
  Volume2 
} from 'lucide-react';

interface NavbarTopProps {
  profile: UserProfile;
  currentRole: UserRole;
  activeAlerts: EmergencyAlert[];
  onOpenEmergency: () => void;
  onReadScreen: () => void;
  soundEnabled: boolean;
}

export const NavbarTop: React.FC<NavbarTopProps> = ({
  profile,
  currentRole,
  activeAlerts,
  onOpenEmergency,
  onReadScreen,
  soundEnabled,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'PACIENTE':
        return { label: 'Cidadão / Paciente', color: 'bg-blue-900/60 text-blue-300 border-blue-700' };
      case 'CUIDADOR':
        return { label: 'Cuidadora / Familiar', color: 'bg-indigo-900/60 text-indigo-300 border-indigo-700' };
      case 'ACS':
        return { label: 'Agente de Saúde (ACS)', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-700' };
      case 'MEDICO_UBS':
        return { label: 'Médico da Família (UBS)', color: 'bg-teal-900/60 text-teal-300 border-teal-700' };
    }
  };

  const badge = getRoleBadge(currentRole);
  const hasCritical = activeAlerts.length > 0;

  return (
    <header
      id="seda-navbar-top"
      className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* SEDA SUS Branding & Patient Context */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-900/30 flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <HeartPulse className="w-7 h-7 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>SEDA</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/50">
                  SUS Atenção Primária
                </span>
              </h1>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${badge.color}`}>
                {badge.label}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
              <span className="font-semibold text-slate-200">{profile.name} ({profile.age} anos)</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Hospital className="w-3.5 h-3.5 text-blue-400" /> {profile.ubsReference}
              </span>
              <span className="hidden md:inline">•</span>
              <span className="text-slate-400 hidden md:inline">CNS: {profile.cns}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Emergency Button */}
        <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
          {/* Read Screen Button for Seniors */}
          <button
            id="read-screen-btn"
            onClick={onReadScreen}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold min-h-[44px] transition-colors"
            title="Ouvir explicação desta tela em voz alta"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Ouvir Tela</span>
          </button>

          {/* Critical Alert Indicator */}
          {hasCritical && (
            <button
              id="active-critical-alert-btn"
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-950/90 hover:bg-red-900 border border-red-500 text-red-200 rounded-xl text-xs font-bold min-h-[44px] animate-bounce shadow-lg shadow-red-900/40"
              title="Alerta Crítico Imediato Ativo!"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>ALERTA CRÍTICO ({activeAlerts.length})</span>
            </button>
          )}

          {/* SOS Emergency Button */}
          <button
            id="sos-emergency-btn"
            onClick={() => {
              audioVoice.playTone('alert', soundEnabled);
              onOpenEmergency();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl font-black text-xs sm:text-sm min-h-[44px] shadow-lg shadow-red-900/50 border border-red-400 transition-transform active:scale-95"
            title="Acionar Protocolo de Emergência / SAMU 192"
          >
            <PhoneCall className="w-4 h-4" />
            <span>SOS SAMU 192</span>
          </button>
        </div>
      </div>
    </header>
  );
};
