/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Barra de Status Mobile Nativa
 */

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, ShieldCheck, Sparkles, CloudOff, CloudCheck } from 'lucide-react';

interface MobileStatusBarProps {
  isOfflineMode: boolean;
  onToggleAuth: () => void;
  userName: string;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({
  isOfflineMode,
  onToggleAuth,
  userName,
}) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    update();
    const timer = setInterval(update, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="mobile-status-bar"
      className="w-full px-5 py-2 flex items-center justify-between text-xs font-semibold text-slate-300 bg-slate-950/80 backdrop-blur-md select-none border-b border-slate-800/40"
    >
      {/* Dynamic Clock */}
      <div className="flex items-center gap-1.5 font-bold tracking-tight text-white">
        <span>{currentTime || '09:41'}</span>
        <span className="text-[10px] text-emerald-400 font-bold px-1 py-0.2 bg-emerald-950/80 rounded border border-emerald-600/40">
          5G SUS
        </span>
      </div>

      {/* Dynamic Notch / Island Accent */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-[11px] text-slate-300 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium text-slate-200">SEDA • Atenção Primária</span>
      </div>

      {/* Right Icons: Network, Offline Status & Battery */}
      <div className="flex items-center gap-2.5">
        {isOfflineMode ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/50">
            <CloudOff className="w-3 h-3 text-amber-400" />
            <span>Off</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          </span>
        )}

        <div className="flex items-center gap-1 text-slate-200">
          <span className="text-[10px] font-mono">98%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
