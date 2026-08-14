/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Barra de Navegação por Abas (WCAG 2.2 AA / Áreas de Toque 48x48dp)
 */

import React from 'react';
import { NavigationTab, UserRole } from '../types';
import { audioVoice } from '../utils/audioVoice';
import { 
  Home, 
  Mic, 
  Activity, 
  CalendarCheck, 
  BellRing, 
  Users, 
  AlertCircle 
} from 'lucide-react';

interface TabNavigationProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentRole: UserRole;
  soundEnabled: boolean;
  silenceDays: number;
  upcomingAppointmentsCount: number;
  criticalAlertsCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  soundEnabled,
  silenceDays,
  upcomingAppointmentsCount,
  criticalAlertsCount,
}) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string; roleVisibility?: UserRole[] }[] = [
    {
      id: 'INICIO',
      label: 'Início',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'DIARIO_SENTIDOS',
      label: 'Diário de Voz (IA)',
      icon: <Mic className="w-5 h-5 text-purple-400" />,
      badge: 'Zero-Text',
      badgeColor: 'bg-purple-900/80 text-purple-200 border-purple-600',
    },
    {
      id: 'MEDICOES',
      label: 'Pressão & Glicemia',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'CONSULTAS_SUS',
      label: 'Consultas UBS',
      icon: <CalendarCheck className="w-5 h-5 text-blue-400" />,
      badge: upcomingAppointmentsCount > 0 ? upcomingAppointmentsCount : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'SILENCIO_RISCO',
      label: 'Alerta de Silêncio',
      icon: <BellRing className="w-5 h-5 text-amber-400" />,
      badge: silenceDays > 0 ? `${silenceDays}d` : undefined,
      badgeColor: silenceDays >= 5 ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-600 text-white',
    },
    {
      id: 'PAINEL_ACS',
      label: 'Painel ACS / UBS',
      icon: <Users className="w-5 h-5 text-teal-400" />,
      badge: currentRole === 'ACS' || currentRole === 'MEDICO_UBS' ? 'ESF' : undefined,
      badgeColor: 'bg-teal-700 text-teal-100',
    },
    {
      id: 'EMERGENCIA',
      label: 'Emergência 192',
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      badge: criticalAlertsCount > 0 ? 'CRÍTICO' : undefined,
      badgeColor: 'bg-red-600 text-white font-black',
    },
  ];

  return (
    <nav
      id="seda-tab-navigation"
      className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-6 py-2 sticky top-[73px] z-30 overflow-x-auto no-scrollbar"
      aria-label="Abas Principais do SEDA"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id.toLowerCase()}`}
              onClick={() => {
                onSelectTab(tab.id);
                audioVoice.playTone('click', soundEnabled);
              }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm min-h-[48px] transition-all relative select-none ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-800/40 border border-slate-800'
              }`}
              aria-selected={isActive}
            >
              <span className="flex-shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 ${
                    tab.badgeColor || 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
