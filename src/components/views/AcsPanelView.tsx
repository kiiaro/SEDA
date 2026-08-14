/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Painel do ACS (Agente Comunitário de Saúde) & Equipe de Saúde da Família (ESF / UBS)
 */

import React, { useState } from 'react';
import { 
  UserProfile, 
  UserRole, 
  AppAccessibilitySettings, 
  BloodPressureReading, 
  GlucoseReading, 
  Appointment 
} from '../../types';
import { audioVoice } from '../../utils/audioVoice';
import { 
  Users, 
  Hospital, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  CalendarPlus, 
  Activity, 
  Clock, 
  Wifi, 
  WifiOff, 
  RotateCw, 
  Award, 
  UserPlus, 
  Search,
  Volume2
} from 'lucide-react';

interface AcsPanelViewProps {
  currentRole: UserRole;
  profile: UserProfile;
  settings: AppAccessibilitySettings;
  isOfflineMode: boolean;
  onNavigateToMeasurements: () => void;
  onNavigateToAppointments: () => void;
}

interface MicroareaPatient {
  id: string;
  name: string;
  age: number;
  cns: string;
  address: string;
  conditions: string[];
  lastMeasurementDays: number;
  lastBP: string;
  lastGlucose: string;
  riskStatus: 'CRITICO' | 'ALTO' | 'MODERADO' | 'ESTAVEL';
  needsActiveSearch: boolean;
}

export const AcsPanelView: React.FC<AcsPanelViewProps> = ({
  currentRole,
  profile,
  settings,
  isOfflineMode,
  onNavigateToMeasurements,
  onNavigateToAppointments,
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [syncing, setSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Microarea 03 Cohort
  const [patients, setPatients] = useState<MicroareaPatient[]>([
    {
      id: profile.id,
      name: profile.name,
      age: profile.age,
      cns: profile.cns,
      address: profile.address,
      conditions: profile.conditions,
      lastMeasurementDays: 0,
      lastBP: '128/82 mmHg',
      lastGlucose: '98 mg/dL',
      riskStatus: 'MODERADO',
      needsActiveSearch: false,
    },
    {
      id: 'pat-002',
      name: 'Dona Francisca Santos',
      age: 74,
      cns: '702.9912.4410.0091',
      address: 'Rua das Camélias, 104',
      conditions: ['Hipertensão Estágio 2', 'Diabetes Tipo 2'],
      lastMeasurementDays: 6,
      lastBP: '178/104 mmHg',
      lastGlucose: '220 mg/dL',
      riskStatus: 'CRITICO',
      needsActiveSearch: true,
    },
    {
      id: 'pat-003',
      name: 'Seu Sebastião Oliveira',
      age: 81,
      cns: '704.1129.8820.0034',
      address: 'Travessa Primavera, 45',
      conditions: ['Hipertensão Arterial'],
      lastMeasurementDays: 4,
      lastBP: '142/90 mmHg',
      lastGlucose: '110 mg/dL',
      riskStatus: 'ALTO',
      needsActiveSearch: true,
    },
    {
      id: 'pat-004',
      name: 'Dona Lourdes Ferreira',
      age: 68,
      cns: '701.3344.5510.0078',
      address: 'Rua dos Ipês, 890',
      conditions: ['Diabetes Mellitus Tipo 2'],
      lastMeasurementDays: 1,
      lastBP: '120/78 mmHg',
      lastGlucose: '104 mg/dL',
      riskStatus: 'ESTAVEL',
      needsActiveSearch: false,
    },
  ]);

  const handleSyncWithESUS = () => {
    setSyncing(true);
    audioVoice.playTone('click', settings.audioFeedbackEnabled);

    setTimeout(() => {
      setSyncing(false);
      setSyncSuccessMsg(
        'Sincronização com o e-SUS APS e Prontuário Eletrônico da UBS realizada com sucesso! 4 prontuários atualizados em segundo plano.'
      );
      audioVoice.playTone('success', settings.audioFeedbackEnabled);
      setTimeout(() => setSyncSuccessMsg(null), 5000);
    }, 1500);
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cns.includes(searchQuery) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || p.riskStatus === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div id="acs-panel-view" className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-emerald-950/80 border border-teal-900/50 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-2">
              <Hospital className="w-3.5 h-3.5 text-teal-400" />
              <span>Atenção Primária à Saúde • ESF Equipe 04 - Microárea 03</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Painel do Agente de Saúde (ACS) & UBS
            </h2>
            <p className="text-teal-200/90 text-sm sm:text-base max-w-2xl mt-1 leading-relaxed">
              Gestão territorial da Microárea 03. Identifique idosos em <strong>Silêncio Clínico</strong>, lance visitas com <strong>Selo Ouro (100% de peso)</strong> e sincronize dados mesmo sem internet.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-sync-esus"
              onClick={handleSyncWithESUS}
              disabled={syncing}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold min-h-[44px] flex items-center gap-2 transition-transform active:scale-95 shadow-md shadow-teal-950/50"
            >
              <RotateCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Sincronizando...' : 'Sincronizar com e-SUS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Success Message */}
      {syncSuccessMsg && (
        <div className="bg-emerald-950/90 border border-emerald-600 rounded-2xl p-4 text-xs sm:text-sm text-emerald-200 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* Microarea Metrics & Offline Sync Status */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Total na Microárea</span>
          <div className="text-2xl sm:text-3xl font-black text-white">42 Idosos</div>
          <span className="text-[11px] text-teal-400">Hiperdia Ativo</span>
        </div>

        <div className="bg-red-950/60 border border-red-800/80 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-red-300 font-semibold">Busca Ativa (Silêncio &ge; 5d)</span>
          <div className="text-2xl sm:text-3xl font-black text-red-200">2 Idosos</div>
          <span className="text-[11px] text-red-400 font-bold">Prioridade Máxima</span>
        </div>

        <div className="bg-amber-950/60 border border-amber-800/80 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-amber-300 font-semibold">Silêncio Alerta (3-4d)</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-200">1 Idoso</div>
          <span className="text-[11px] text-amber-400">Notificar Cuidador</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Modo de Conexão</span>
          <div className="text-sm font-black text-white flex items-center gap-2 pt-1">
            {isOfflineMode ? (
              <span className="text-amber-400 flex items-center gap-1">
                <WifiOff className="w-4 h-4" /> Offline (Buffer Local)
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Wifi className="w-4 h-4" /> Online (Sincronizado)
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">Fila: 0 pendências</span>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por nome, CNS ou endereço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setFilterRisk('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              filterRisk === 'ALL'
                ? 'bg-teal-600 text-white border-teal-400'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            Todos ({patients.length})
          </button>

          <button
            onClick={() => setFilterRisk('CRITICO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              filterRisk === 'CRITICO'
                ? 'bg-red-600 text-white border-red-400'
                : 'bg-slate-950 text-red-400 border-slate-800'
            }`}
          >
            🚨 Risco Crítico
          </button>

          <button
            onClick={() => setFilterRisk('ALTO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              filterRisk === 'ALTO'
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-slate-950 text-amber-400 border-slate-800'
            }`}
          >
            ⚠️ Risco Alto
          </button>

          <button
            onClick={() => setFilterRisk('MODERADO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              filterRisk === 'MODERADO'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-slate-950 text-blue-400 border-slate-800'
            }`}
          >
            Moderar
          </button>
        </div>
      </div>

      {/* PATIENT LIST CARDS */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className={`bg-slate-900/90 border rounded-3xl p-5 sm:p-6 shadow-xl transition-all ${
              patient.needsActiveSearch
                ? 'border-red-600 shadow-red-950/40 ring-1 ring-red-500/50'
                : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-lg font-black text-white">{patient.name}</h4>
                  <span className="text-xs text-slate-400 font-semibold">({patient.age} anos)</span>
                  <span className="text-xs text-slate-400">CNS: {patient.cns}</span>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      patient.riskStatus === 'CRITICO'
                        ? 'bg-red-950 text-red-300 border-red-600 animate-pulse'
                        : patient.riskStatus === 'ALTO'
                        ? 'bg-amber-950 text-amber-300 border-amber-600'
                        : patient.riskStatus === 'MODERADO'
                        ? 'bg-blue-950 text-blue-300 border-blue-600'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    }`}
                  >
                    Risco: {patient.riskStatus}
                  </span>

                  {patient.needsActiveSearch && (
                    <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full animate-bounce">
                      🚨 BUSCA ATIVA PRIORITÁRIA
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" /> {patient.address}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-300">
                    Condições: {patient.conditions.join(', ')}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs pt-1">
                  <span className="text-slate-400">
                    Última PA: <strong className="text-white">{patient.lastBP}</strong>
                  </span>
                  <span className="text-slate-400">
                    Última Glicemia: <strong className="text-white">{patient.lastGlucose}</strong>
                  </span>
                  <span
                    className={`font-bold ${
                      patient.lastMeasurementDays >= 5
                        ? 'text-red-400'
                        : patient.lastMeasurementDays >= 3
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {patient.lastMeasurementDays === 0
                      ? 'Medições em dia'
                      : `${patient.lastMeasurementDays} dias em silêncio`}
                  </span>
                </div>
              </div>

              {/* Action Buttons for ACS */}
              <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                <button
                  onClick={onNavigateToMeasurements}
                  className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold min-h-[44px] flex items-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-emerald-950/40"
                  title="Registrar medição durante a visita domiciliar com 100% de peso"
                >
                  <Award className="w-4 h-4 text-yellow-300" />
                  <span>Lançar Visita (100%)</span>
                </button>

                <button
                  onClick={onNavigateToAppointments}
                  className="px-3.5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold min-h-[44px] flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Encaixe UBS</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
