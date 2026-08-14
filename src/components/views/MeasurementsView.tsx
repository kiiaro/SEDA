/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Módulo de Medições (Pressão Arterial & Glicemia com Pesos de Confiabilidade)
 */

import React, { useState } from 'react';
import { 
  BloodPressureReading, 
  GlucoseReading, 
  UserProfile, 
  UserRole, 
  GlucoseContext, 
  AppAccessibilitySettings, 
  BPClassification, 
  GlucoseClassification 
} from '../../types';
import { 
  classifyBloodPressure, 
  classifyGlucose, 
  getClinicalWeight, 
  isCriticalBP, 
  isCriticalGlucose, 
  checkBPConflicts 
} from '../../utils/clinicalRules';
import { audioVoice } from '../../utils/audioVoice';
import { 
  HeartPulse, 
  Activity, 
  PlusCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Award, 
  FileSpreadsheet, 
  AlertCircle, 
  WifiOff, 
  HelpCircle,
  TrendingUp,
  Volume2
} from 'lucide-react';

interface MeasurementsViewProps {
  profile: UserProfile;
  currentRole: UserRole;
  bpReadings: BloodPressureReading[];
  glucoseReadings: GlucoseReading[];
  settings: AppAccessibilitySettings;
  isOfflineMode: boolean;
  onSaveBPReading: (reading: BloodPressureReading) => void;
  onSaveGlucoseReading: (reading: GlucoseReading) => void;
  onTriggerCriticalAlert: (type: 'CRISE_HIPERTENSIVA' | 'HIPOGLICEMIA_SEVERA', value: string) => void;
}

export const MeasurementsView: React.FC<MeasurementsViewProps> = ({
  profile,
  currentRole,
  bpReadings,
  glucoseReadings,
  settings,
  isOfflineMode,
  onSaveBPReading,
  onSaveGlucoseReading,
  onTriggerCriticalAlert,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'BP' | 'GLUCOSE'>('BP');

  // New BP Form
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(72);
  const [bpNotes, setBpNotes] = useState<string>('');

  // New Glucose Form
  const [glucoseVal, setGlucoseVal] = useState<number>(95);
  const [glucoseContext, setGlucoseContext] = useState<GlucoseContext>('JEJUM');
  const [glucoseNotes, setGlucoseNotes] = useState<string>('');

  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'alert' | 'info' } | null>(null);

  const handleRegisterBP = (e: React.FormEvent) => {
    e.preventDefault();
    const classification = classifyBloodPressure(systolic, diastolic);
    const weight = getClinicalWeight(currentRole);

    const newReading: BloodPressureReading = {
      id: `bp-${Date.now()}`,
      patientId: profile.id,
      systolic,
      diastolic,
      pulse,
      timestamp: new Date().toISOString(),
      classification,
      registeredBy: currentRole,
      registeredByName:
        currentRole === 'PACIENTE'
          ? profile.name
          : currentRole === 'CUIDADOR'
          ? profile.caregiverName || 'Cuidadora'
          : currentRole === 'ACS'
          ? profile.acsName || 'ACS Cláudia'
          : 'Dr. Médico da Família (UBS)',
      weightPercentage: weight,
      isOfflineCreated: isOfflineMode,
      notes: bpNotes,
    };

    onSaveBPReading(newReading);

    // Check Critical Alert (>180/110)
    if (isCriticalBP(systolic, diastolic)) {
      audioVoice.playTone('alert', settings.audioFeedbackEnabled);
      onTriggerCriticalAlert('CRISE_HIPERTENSIVA', `${systolic}/${diastolic} mmHg`);
      setFeedbackMsg({
        text: `ALERTA CRÍTICO: Pressão de ${systolic}/${diastolic} mmHg indica Crise Hipertensiva. Protocolo de emergência e encaixe prioritário disparados!`,
        type: 'alert',
      });
      if (settings.voiceReaderEnabled) {
        audioVoice.speakText(`Atenção: Pressão arterial de ${systolic} por ${diastolic} está muito alta. Mantenha a calma, sente-se e siga as orientações de emergência.`);
      }
    } else {
      audioVoice.playTone('success', settings.audioFeedbackEnabled);
      setFeedbackMsg({
        text: `Pressão ${systolic}/${diastolic} mmHg registrada com sucesso (${weight}% de confiabilidade - ${classification.replace(/_/g, ' ')}).`,
        type: 'success',
      });
    }

    setBpNotes('');
    setTimeout(() => setFeedbackMsg(null), 6000);
  };

  const handleRegisterGlucose = (e: React.FormEvent) => {
    e.preventDefault();
    const classification = classifyGlucose(glucoseVal, glucoseContext);
    const weight = getClinicalWeight(currentRole);

    const newReading: GlucoseReading = {
      id: `glu-${Date.now()}`,
      patientId: profile.id,
      value: glucoseVal,
      context: glucoseContext,
      timestamp: new Date().toISOString(),
      classification,
      registeredBy: currentRole,
      registeredByName:
        currentRole === 'PACIENTE'
          ? profile.name
          : currentRole === 'CUIDADOR'
          ? profile.caregiverName || 'Cuidadora'
          : currentRole === 'ACS'
          ? profile.acsName || 'ACS Cláudia'
          : 'Dr. Médico da Família (UBS)',
      weightPercentage: weight,
      isOfflineCreated: isOfflineMode,
      notes: glucoseNotes,
    };

    onSaveGlucoseReading(newReading);

    // Check Critical Alert (<54 or >=300)
    if (isCriticalGlucose(glucoseVal)) {
      audioVoice.playTone('alert', settings.audioFeedbackEnabled);
      onTriggerCriticalAlert('HIPOGLICEMIA_SEVERA', `${glucoseVal} mg/dL`);
      setFeedbackMsg({
        text: `ALERTA CRÍTICO: Glicemia de ${glucoseVal} mg/dL (${classification.replace(/_/g, ' ')}). Protocolo de emergência e encaixe na UBS acionados!`,
        type: 'alert',
      });
      if (settings.voiceReaderEnabled) {
        audioVoice.speakText(`Atenção: Glicemia em ${glucoseVal} miligramas por decilitro requer ação imediata. Tome as medidas recomendadas.`);
      }
    } else {
      audioVoice.playTone('success', settings.audioFeedbackEnabled);
      setFeedbackMsg({
        text: `Glicemia de ${glucoseVal} mg/dL (${glucoseContext}) registrada (${weight}% de confiabilidade).`,
        type: 'success',
      });
    }

    setGlucoseNotes('');
    setTimeout(() => setFeedbackMsg(null), 6000);
  };

  const bpConflict = checkBPConflicts(bpReadings);

  return (
    <div id="measurements-view" className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-900/50 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hierarquia de Confiabilidade & Validação SUS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Monitoramento Clínico (Hiperdia)
            </h2>
            <p className="text-emerald-200/90 text-sm sm:text-base max-w-2xl mt-1 leading-relaxed">
              Registre a Pressão Arterial e a Glicemia Capilar. Os dados recebem pesos clínicos automáticos ({currentRole === 'ACS' || currentRole === 'MEDICO_UBS' ? '100% Verdade de Ouro' : currentRole === 'CUIDADOR' ? '90% Cuidador' : '80% Paciente'}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioVoice.speakText(
                  'Tela de medições. Escolha entre Pressão Arterial ou Glicose. Preencha os valores e toque no botão Registrar para salvar.'
                );
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-600/60 text-emerald-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Volume2 className="w-4 h-4 text-emerald-300" />
              <span>Ouvir Instruções</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Pressão vs Glicose */}
      <div className="flex items-center gap-3">
        <button
          id="btn-subtab-bp"
          onClick={() => {
            setActiveSubTab('BP');
            audioVoice.playTone('click', settings.audioFeedbackEnabled);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base border transition-all min-h-[52px] ${
            activeSubTab === 'BP'
              ? 'bg-rose-950/90 border-rose-500 text-white shadow-lg shadow-rose-950/40'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <HeartPulse className={`w-5 h-5 ${activeSubTab === 'BP' ? 'text-rose-400' : 'text-slate-500'}`} />
          <span>Pressão Arterial (SBC/SBH)</span>
        </button>

        <button
          id="btn-subtab-glucose"
          onClick={() => {
            setActiveSubTab('GLUCOSE');
            audioVoice.playTone('click', settings.audioFeedbackEnabled);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base border transition-all min-h-[52px] ${
            activeSubTab === 'GLUCOSE'
              ? 'bg-emerald-950/90 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Activity className={`w-5 h-5 ${activeSubTab === 'GLUCOSE' ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span>Glicemia Capilar (SBD)</span>
        </button>
      </div>

      {/* Feedback Alert if any */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-3 animate-fadeIn ${
            feedbackMsg.type === 'alert'
              ? 'bg-red-950/90 border-red-600 text-red-200'
              : 'bg-emerald-950/90 border-emerald-600 text-emerald-200'
          }`}
        >
          {feedbackMsg.type === 'alert' ? (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 animate-bounce" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Conflict Resolution Warning Banner */}
      {bpConflict.hasConflict && (
        <div className="bg-amber-950/90 border-2 border-amber-500 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-black text-base">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>Regra de Conflito de Dados Detectada</span>
          </div>
          <p className="text-amber-200 text-xs sm:text-sm font-medium">
            {bpConflict.message}
          </p>
          <p className="text-xs text-amber-300/90 font-bold bg-amber-900/40 p-2.5 rounded-xl border border-amber-700/50">
            ⚖️ {bpConflict.recommendedValue}
          </p>
        </div>
      )}

      {/* INPUT FORM & CLINICAL SCALE */}
      {activeSubTab === 'BP' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BP Input Form */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-400" />
                <span>Nova Medição de Pressão</span>
              </h3>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-yellow-400" /> Peso: {getClinicalWeight(currentRole)}%
              </span>
            </div>

            <form onSubmit={handleRegisterBP} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Systolic */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Sistólica (Máxima) mmHg
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-bp-systolic"
                      type="number"
                      min={60}
                      max={260}
                      value={systolic}
                      onChange={(e) => setSystolic(Number(e.target.value))}
                      className="w-full bg-slate-950 border-2 border-slate-700 focus:border-rose-500 rounded-2xl py-3 px-4 text-2xl font-black text-white text-center focus:ring-0"
                      required
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block text-center">Ex: 120 (Normal) ou 180 (Crise)</span>
                </div>

                {/* Diastolic */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Diastólica (Mínima) mmHg
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="input-bp-diastolic"
                      type="number"
                      min={40}
                      max={160}
                      value={diastolic}
                      onChange={(e) => setDiastolic(Number(e.target.value))}
                      className="w-full bg-slate-950 border-2 border-slate-700 focus:border-rose-500 rounded-2xl py-3 px-4 text-2xl font-black text-white text-center focus:ring-0"
                      required
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block text-center">Ex: 80 (Normal) ou 110 (Crise)</span>
                </div>
              </div>

              {/* Pulse */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Frequência Cardíaca (Pulso BPM)
                </label>
                <input
                  id="input-bp-pulse"
                  type="number"
                  min={35}
                  max={220}
                  value={pulse}
                  onChange={(e) => setPulse(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-sm font-bold text-white text-center"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Observações / Circunstância
                </label>
                <input
                  id="input-bp-notes"
                  type="text"
                  placeholder="Ex: Em repouso de 5 min / Antes do café da manhã"
                  value={bpNotes}
                  onChange={(e) => setBpNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500"
                />
              </div>

              {/* Live Preview of Classification */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Classificação Prevista:</span>
                <span
                  className={`font-black px-2.5 py-1 rounded-lg border ${
                    classifyBloodPressure(systolic, diastolic) === 'CRISE_HIPERTENSIVA'
                      ? 'bg-red-950 text-red-300 border-red-600 animate-pulse'
                      : classifyBloodPressure(systolic, diastolic) === 'HIPERTENSAO_ESTAGIO_2'
                      ? 'bg-rose-950 text-rose-300 border-rose-600'
                      : classifyBloodPressure(systolic, diastolic) === 'HIPERTENSAO_ESTAGIO_1'
                      ? 'bg-amber-950 text-amber-300 border-amber-600'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                  }`}
                >
                  {classifyBloodPressure(systolic, diastolic).replace(/_/g, ' ')}
                </span>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-bp"
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-2xl font-black text-base min-h-[56px] shadow-lg shadow-rose-950/50 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Salvar Registro de Pressão</span>
              </button>
            </form>
          </div>

          {/* Reference Scale SBC/SBH Guidelines */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-400" />
                <span>Tabela de Referência (Diretriz Brasileira)</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 flex items-center justify-between">
                  <span className="font-bold text-emerald-300">Ótima / Normal</span>
                  <span className="text-slate-300 font-semibold">&lt; 120 e &lt; 80 mmHg</span>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-950/50 border border-blue-800/60 flex items-center justify-between">
                  <span className="font-bold text-blue-300">Pré-Hipertensão</span>
                  <span className="text-slate-300 font-semibold">130-139 e/ou 85-89 mmHg</span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-800/60 flex items-center justify-between">
                  <span className="font-bold text-amber-300">Hipertensão Estágio 1</span>
                  <span className="text-slate-300 font-semibold">140-159 e/ou 90-99 mmHg</span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/60 flex items-center justify-between">
                  <span className="font-bold text-rose-300">Hipertensão Estágio 2</span>
                  <span className="text-slate-300 font-semibold">160-179 e/ou 100-109 mmHg</span>
                </div>

                <div className="p-2.5 rounded-xl bg-red-950 border border-red-600 flex items-center justify-between animate-pulse">
                  <span className="font-black text-red-300">🚨 Crise Hipertensiva</span>
                  <span className="text-white font-black">&ge; 180 e/ou &ge; 110 mmHg</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                ⚠️ Valores a partir de 180x110 mmHg acionam o protocolo vermelho com encaminhamento imediato e encaixe na UBS.
              </div>
            </div>

            {/* Hierarchical weight policy */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-slate-300">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Política de Confiabilidade de Dados SEDA:</span>
              </h5>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Registros inseridos pelo ACS / Médico recebem <strong>100% de peso</strong> (Verdade de Ouro). Cuidador recebe <strong>90%</strong> e Paciente recebe <strong>80%</strong>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* GLUCOSE FORM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Nova Medição de Glicemia</span>
              </h3>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-yellow-400" /> Peso: {getClinicalWeight(currentRole)}%
              </span>
            </div>

            <form onSubmit={handleRegisterGlucose} className="space-y-4">
              {/* Glucose Value */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Glicemia Capilar (mg/dL)
                </label>
                <input
                  id="input-glucose-val"
                  type="number"
                  min={20}
                  max={600}
                  value={glucoseVal}
                  onChange={(e) => setGlucoseVal(Number(e.target.value))}
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-emerald-500 rounded-2xl py-3 px-4 text-3xl font-black text-white text-center focus:ring-0"
                  required
                />
                <span className="text-[11px] text-slate-400 block text-center">Ex: 95 mg/dL (Normal em jejum) ou &lt;54 (Crítico)</span>
              </div>

              {/* Context Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Momento da Coleta (Contexto)
                </label>
                <select
                  id="select-glucose-context"
                  value={glucoseContext}
                  onChange={(e) => setGlucoseContext(e.target.value as GlucoseContext)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 px-3 text-xs font-bold"
                >
                  <option value="JEJUM">Jejum Matinal (8 horas de repouso)</option>
                  <option value="POS_PRANDIAL">Pós-Prandial (2h após refeição)</option>
                  <option value="CASUAL">Casual / Qualquer horário do dia</option>
                  <option value="ANTES_DORMIR">Antes de Dormir / Noturno</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Observações (Ex: refeição ingerida)
                </label>
                <input
                  id="input-glucose-notes"
                  type="text"
                  placeholder="Ex: Após almoço com salada e arroz integral"
                  value={glucoseNotes}
                  onChange={(e) => setGlucoseNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500"
                />
              </div>

              {/* Live Preview */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Classificação SBD:</span>
                <span
                  className={`font-black px-2.5 py-1 rounded-lg border ${
                    classifyGlucose(glucoseVal, glucoseContext) === 'HIPOGLICEMIA_GRAVE' ||
                    classifyGlucose(glucoseVal, glucoseContext) === 'HIPERGLICEMIA_SEVERA'
                      ? 'bg-red-950 text-red-300 border-red-600 animate-pulse'
                      : classifyGlucose(glucoseVal, glucoseContext) === 'HIPOGLICEMIA_LEVE'
                      ? 'bg-rose-950 text-rose-300 border-rose-600'
                      : classifyGlucose(glucoseVal, glucoseContext) === 'ELEVADA'
                      ? 'bg-amber-950 text-amber-300 border-amber-600'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                  }`}
                >
                  {classifyGlucose(glucoseVal, glucoseContext).replace(/_/g, ' ')}
                </span>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-glucose"
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-base min-h-[56px] shadow-lg shadow-emerald-950/50 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Salvar Registro de Glicemia</span>
              </button>
            </form>
          </div>

          {/* Reference Scale SBD */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Alvos Glicêmicos (Sociedade Brasileira de Diabetes)</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-red-950 border border-red-600 flex items-center justify-between animate-pulse">
                  <span className="font-black text-red-300">🚨 Hipoglicemia Grave</span>
                  <span className="text-white font-black">&lt; 54 mg/dL</span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800 flex items-center justify-between">
                  <span className="font-bold text-rose-300">Hipoglicemia Leve</span>
                  <span className="text-slate-300 font-semibold">54 - 69 mg/dL</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 flex items-center justify-between">
                  <span className="font-bold text-emerald-300">Meta Normal (Jejum)</span>
                  <span className="text-slate-300 font-semibold">70 - 99 mg/dL</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 flex items-center justify-between">
                  <span className="font-bold text-emerald-300">Meta Pós-Prandial (2h)</span>
                  <span className="text-slate-300 font-semibold">&lt; 140 mg/dL (ou &lt;180 diabético)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-red-950 border border-red-600 flex items-center justify-between">
                  <span className="font-black text-red-300">🚨 Hiperglicemia Severa</span>
                  <span className="text-white font-black">&gt; 300 mg/dL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* READINGS HISTORY TABLE WITH CLINICAL WEIGHT BADGES */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <span>Histórico de Medições com Selo de Confiabilidade</span>
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              100% ACS / Médico
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
              90% Cuidador
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800 font-bold">
              80% Paciente
            </span>
          </div>
        </div>

        {activeSubTab === 'BP' ? (
          <div className="space-y-2.5">
            {bpReadings.map((r) => (
              <div
                key={r.id}
                className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-800 flex flex-col items-center justify-center">
                    <span className="font-black text-white text-sm leading-tight">{r.systolic}</span>
                    <span className="text-[10px] text-slate-400 font-bold">/{r.diastolic}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">
                        {r.systolic}/{r.diastolic} mmHg
                      </span>
                      <span className="text-slate-400">Pulso: {r.pulse} BPM</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          r.classification === 'CRISE_HIPERTENSIVA'
                            ? 'bg-red-900 text-red-200'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {r.classification.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-slate-400 mt-1">
                      {new Date(r.timestamp).toLocaleString('pt-BR')} • {r.notes || 'Sem notas'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {r.isOfflineCreated && (
                    <span className="flex items-center gap-1 text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                      <WifiOff className="w-3 h-3" /> Offline
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-xl font-bold border flex items-center gap-1 ${
                      r.weightPercentage === 100
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : r.weightPercentage === 90
                        ? 'bg-indigo-950 text-indigo-300 border-indigo-600'
                        : 'bg-blue-950 text-blue-300 border-blue-600'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{r.registeredByName} ({r.weightPercentage}%)</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {glucoseReadings.map((r) => (
              <div
                key={r.id}
                className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800 flex flex-col items-center justify-center">
                    <span className="font-black text-white text-sm leading-tight">{r.value}</span>
                    <span className="text-[9px] text-slate-400 font-bold">mg/dL</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">
                        {r.value} mg/dL ({r.context})
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          r.classification.includes('GRAVE') || r.classification.includes('SEVERA')
                            ? 'bg-red-900 text-red-200'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {r.classification.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-slate-400 mt-1">
                      {new Date(r.timestamp).toLocaleString('pt-BR')} • {r.notes || 'Sem notas'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`px-3 py-1 rounded-xl font-bold border flex items-center gap-1 ${
                      r.weightPercentage === 100
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : r.weightPercentage === 90
                        ? 'bg-indigo-950 text-indigo-300 border-indigo-600'
                        : 'bg-blue-950 text-blue-300 border-blue-600'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{r.registeredByName} ({r.weightPercentage}%)</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
