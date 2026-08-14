/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Barra de Navegação Inferior Mobile Nativa (Floating Dock & FAB)
 */

import React from 'react';
import { NavigationTab, UserRole } from '../../types';
import { audioVoice } from '../../utils/audioVoice';
import { 
  Home, 
  Mic, 
  Activity, 
  CalendarCheck, 
  Users, 
  Plus, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentRole: UserRole;
  soundEnabled: boolean;
  onOpenQuickAction: () => void;
  upcomingAppointmentsCount: number;
  criticalAlertsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  soundEnabled,
  onOpenQuickAction,
  upcomingAppointmentsCount,
  criticalAlertsCount,
}) => {
  const navItems = [
    {
      id: 'INICIO' as NavigationTab,
      label: 'Início',
      icon: Home,
    },
    {
      id: 'MEDICOES' as NavigationTab,
      label: 'Pressão/Glico',
      icon: Activity,
    },
    // Floating action button goes in between
    {
      id: 'CONSULTAS_SUS' as NavigationTab,
      label: 'Consultas',
      icon: CalendarCheck,
      badge: upcomingAppointmentsCount > 0 ? upcomingAppointmentsCount : undefined,
    },
    {
      id: (currentRole === 'ACS' || currentRole === 'MEDICO_UBS' ? 'PAINEL_ACS' : 'SILENCIO_RISCO') as NavigationTab,
      label: currentRole === 'ACS' || currentRole === 'MEDICO_UBS' ? 'UBS / ACS' : 'Silêncio',
      icon: Users,
    },
  ];

  return (
    <div
      id="mobile-bottom-dock"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-3 py-2 pb-safe"
    >
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* First 2 nav items */}
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                audioVoice.playTone('click', soundEnabled);
                onSelectTab(item.id);
              }}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 min-h-[50px] ${
                isActive ? 'text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-blue-600/20 text-blue-400' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Central Floating Action Button (FAB) for Voice & Fast Actions */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            id="mobile-fab-center-btn"
            onClick={() => {
              audioVoice.playTone('click', soundEnabled);
              onOpenQuickAction();
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-400 text-white flex items-center justify-center shadow-xl shadow-indigo-950/60 border-4 border-slate-950 transition-transform active:scale-90 hover:scale-105 animate-pulse"
            title="Ação Rápida ou Falar por Voz"
          >
            <Mic className="w-6 h-6 fill-white/20" />
          </button>
          <span className="text-[9px] font-black text-purple-300 uppercase tracking-wider mt-0.5">
            Diário IA
          </span>
        </div>

        {/* Last 2 nav items */}
        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                audioVoice.playTone('click', soundEnabled);
                onSelectTab(item.id);
              }}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 min-h-[50px] relative ${
                isActive ? 'text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-blue-600/20 text-blue-400' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>

              {item.badge && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center border border-slate-900">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
