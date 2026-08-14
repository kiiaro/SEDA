/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Barra de Acessibilidade Rápida (WCAG 2.2 AA)
 */

import React from 'react';
import { 
  AppAccessibilitySettings, 
  FontSizeOption, 
  UserRole, 
  AutonomyLevel 
} from '../types';
import { audioVoice } from '../utils/audioVoice';
import { 
  Type, 
  Contrast, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  UserCheck, 
  Wifi, 
  WifiOff 
} from 'lucide-react';

interface AccessibilityBarProps {
  settings: AppAccessibilitySettings;
  onUpdateSettings: (partial: Partial<AppAccessibilitySettings>) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  autonomyLevel: AutonomyLevel;
  onChangeAutonomy: (autonomy: AutonomyLevel) => void;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
  pendingSyncCount: number;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  settings,
  onUpdateSettings,
  currentRole,
  onChangeRole,
  autonomyLevel,
  onChangeAutonomy,
  isOfflineMode,
  onToggleOffline,
  pendingSyncCount,
}) => {
  const cycleFontSize = () => {
    let next: FontSizeOption = 'GRANDE';
    if (settings.fontSize === 'NORMAL') next = 'GRANDE';
    else if (settings.fontSize === 'GRANDE') next = 'EXTRA_GRANDE';
    else next = 'NORMAL';

    onUpdateSettings({ fontSize: next });
    audioVoice.playTone('click', settings.audioFeedbackEnabled);
  };

  const toggleContrast = () => {
    onUpdateSettings({ highContrast: !settings.highContrast });
    audioVoice.playTone('click', settings.audioFeedbackEnabled);
  };

  const toggleVoiceReader = () => {
    const next = !settings.voiceReaderEnabled;
    onUpdateSettings({ voiceReaderEnabled: next });
    audioVoice.playTone('click', settings.audioFeedbackEnabled);
    if (next) {
      audioVoice.speakText('Leitor de voz ativado. O SEDA lerá instruções e alertas para você.');
    } else {
      audioVoice.stopSpeaking();
    }
  };

  const toggleIdosoMode = () => {
    const next = !settings.simplifiedIdosoMode;
    onUpdateSettings({ simplifiedIdosoMode: next });
    audioVoice.playTone('success', settings.audioFeedbackEnabled);
    if (next) {
      audioVoice.speakText('Modo Idoso Fácil ativado com botões ampliados e navegação facilitada.');
    }
  };

  return (
    <div
      id="accessibility-bar"
      className="bg-slate-900 border-b border-slate-800 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm"
    >
      {/* Role & Profile Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-400 font-medium hidden sm:inline-flex items-center gap-1">
          <UserCheck className="w-4 h-4 text-emerald-400" /> Perfil Ativo:
        </span>
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            id="role-btn-paciente"
            onClick={() => {
              onChangeRole('PACIENTE');
              audioVoice.playTone('click', settings.audioFeedbackEnabled);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all min-h-[36px] flex items-center gap-1 ${
              currentRole === 'PACIENTE'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Perfil do Paciente Idoso"
          >
            <span>👴 Paciente</span>
          </button>

          <button
            id="role-btn-cuidador"
            onClick={() => {
              onChangeRole('CUIDADOR');
              audioVoice.playTone('click', settings.audioFeedbackEnabled);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all min-h-[36px] flex items-center gap-1 ${
              currentRole === 'CUIDADOR'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Perfil da Filha / Cuidadora"
          >
            <span>👩‍👧 Cuidador</span>
          </button>

          <button
            id="role-btn-acs"
            onClick={() => {
              onChangeRole('ACS');
              audioVoice.playTone('click', settings.audioFeedbackEnabled);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all min-h-[36px] flex items-center gap-1 ${
              currentRole === 'ACS'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Agente Comunitária de Saúde (Campo / Visita)"
          >
            <span>📋 ACS (SUS)</span>
          </button>

          <button
            id="role-btn-medico"
            onClick={() => {
              onChangeRole('MEDICO_UBS');
              audioVoice.playTone('click', settings.audioFeedbackEnabled);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all min-h-[36px] flex items-center gap-1 hidden md:flex ${
              currentRole === 'MEDICO_UBS'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Médico da Família / UBS"
          >
            <span>🩺 Médico UBS</span>
          </button>
        </div>

        {/* Autonomy Level */}
        <select
          id="autonomy-selector"
          value={autonomyLevel}
          onChange={(e) => {
            const next = e.target.value as AutonomyLevel;
            onChangeAutonomy(next);
            if (next === 'ASSISTIDO') {
              onUpdateSettings({ simplifiedIdosoMode: true });
            }
            audioVoice.playTone('click', settings.audioFeedbackEnabled);
          }}
          className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 min-h-[36px]"
          title="Nível de Autonomia no 1º Acesso"
        >
          <option value="ASSISTIDO">Nível: Assistido (Idoso Fácil)</option>
          <option value="AUTONOMO">Nível: Autônomo (Independente)</option>
          <option value="COMPARTILHADO">Nível: Compartilhado (Co-gestão)</option>
        </select>
      </div>

      {/* Accessibility & Offline Toggles */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {/* Offline Simulator */}
        <button
          id="toggle-offline-btn"
          onClick={onToggleOffline}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold min-h-[36px] transition-colors ${
            isOfflineMode
              ? 'bg-amber-950/80 border-amber-600 text-amber-300 animate-pulse'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title={isOfflineMode ? 'Trabalhando em Modo Offline (ACS em campo)' : 'Conectado à Rede da UBS'}
        >
          {isOfflineMode ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline {pendingSyncCount > 0 && `(${pendingSyncCount} na fila)`}</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Online (SUS)</span>
            </>
          )}
        </button>

        {/* Font Size Toggle */}
        <button
          id="btn-font-size"
          onClick={cycleFontSize}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg min-h-[36px] transition-colors"
          title="Alternar Tamanho da Letra (Normal / Grande / Extra Grande)"
        >
          <Type className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold">
            {settings.fontSize === 'NORMAL' && 'A'}
            {settings.fontSize === 'GRANDE' && 'A+'}
            {settings.fontSize === 'EXTRA_GRANDE' && 'A++'}
          </span>
        </button>

        {/* High Contrast */}
        <button
          id="btn-high-contrast"
          onClick={toggleContrast}
          className={`p-2 rounded-lg border min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors ${
            settings.highContrast
              ? 'bg-yellow-400 text-slate-950 border-yellow-300 font-bold'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="Alto Contraste WCAG 2.2 AA"
          aria-label="Alto Contraste"
        >
          <Contrast className="w-4 h-4" />
        </button>

        {/* Voice Reader TTS */}
        <button
          id="btn-voice-reader"
          onClick={toggleVoiceReader}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium min-h-[36px] flex items-center gap-1.5 transition-colors ${
            settings.voiceReaderEnabled
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
          title="Leitor de Tela por Voz (Áudio em Português)"
        >
          {settings.voiceReaderEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Voz Ativa</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Voz Desligada</span>
            </>
          )}
        </button>

        {/* Simplified Idoso Mode Toggle */}
        <button
          id="btn-modo-idoso"
          onClick={toggleIdosoMode}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold min-h-[36px] flex items-center gap-1.5 transition-all ${
            settings.simplifiedIdosoMode
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white shadow-md'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="Alternar Modo Idoso Fácil"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Modo Fácil</span>
        </button>
      </div>
    </div>
  );
};
