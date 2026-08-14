/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Módulo Moderno de Autenticação, Cadastro e Gestão de Perfil SUS
 */

import React, { useState } from 'react';
import { UserProfile, UserRole, AutonomyLevel } from '../../types';
import { audioVoice } from '../../utils/audioVoice';
import { 
  User, 
  ShieldCheck, 
  Fingerprint, 
  Sparkles, 
  CheckCircle2, 
  HeartHandshake, 
  Stethoscope, 
  Users, 
  ScanFace, 
  ArrowRight, 
  Lock, 
  CreditCard, 
  UserPlus, 
  LogIn, 
  X, 
  Phone, 
  MapPin, 
  Pill, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  currentRole: UserRole;
  onLoginSuccess: (profile: UserProfile, role: UserRole) => void;
  soundEnabled: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  currentRole,
  onLoginSuccess,
  soundEnabled,
}) => {
  const [authMode, setAuthMode] = useState<'PERFIS_RAPIDOS'>('PERFIS_RAPIDOS');
  const [loginMethod, setLoginMethod] = useState<'CNS_CPF' | 'BIOMETRIA'>('CNS_CPF');
  const [isScanningBiometry, setIsScanningBiometry] = useState(false);
  const [biometryProgress, setBiometryProgress] = useState(0);

  // Pre-configured role profiles for 1-click test
  const demoProfiles: { role: UserRole; title: string; subtitle: string; profile: UserProfile; icon: any; color: string }[] = [
    {
      role: 'PACIENTE',
      title: 'Dona Neuza Santos',
      subtitle: '68 anos • Hipertensa & Diabética Tipo 2 (UBS Jardim Primavera)',
      icon: User,
      color: 'from-blue-600 to-indigo-700 border-blue-500',
      profile: {
        id: 'patient-neuza-01',
        name: 'Neuza Maria dos Santos',
        role: 'PACIENTE',
        autonomyLevel: 'ASSISTIDO',
        cpfMasked: '***.456.789-**',
        cns: '7894.5612.3301.8890',
        birthDate: '1958-04-12',
        age: 68,
        phone: '(11) 98765-4321',
        ubsReference: 'UBS Jardim Primavera',
        esfTeam: 'Equipe 04 - Florescer',
        microArea: 'Microárea 03',
        acsName: 'Márcia Oliveira (ACS)',
        caregiverName: 'Juliana Santos Ferreira (Filha)',
        caregiverPhone: '(11) 99123-8877',
        address: 'Rua das Camélias, 142 - Jd. Primavera',
        conditions: ['Hipertensão Arterial Sistêmica', 'Diabetes Mellitus Tipo 2'],
        medications: ['Losartana 50mg (Manhã)', 'Metformina 850mg (Almoço/Jantar)', 'AAS 100mg'],
      },
    },
    {
      role: 'CUIDADOR',
      title: 'Juliana Ferreira',
      subtitle: 'Cuidadora Familiar • Acesso compartilhado ao plano de cuidado de Dona Neuza',
      icon: HeartHandshake,
      color: 'from-indigo-600 to-purple-700 border-indigo-500',
      profile: {
        id: 'caregiver-juliana-02',
        name: 'Juliana Santos Ferreira',
        role: 'CUIDADOR',
        autonomyLevel: 'COMPARTILHADO',
        cpfMasked: '***.982.112-**',
        cns: '8910.4412.0019.2211',
        birthDate: '1984-09-22',
        age: 42,
        phone: '(11) 99123-8877',
        ubsReference: 'UBS Jardim Primavera',
        esfTeam: 'Equipe 04 - Florescer',
        microArea: 'Microárea 03',
        acsName: 'Márcia Oliveira (ACS)',
        caregiverName: 'Juliana Santos Ferreira (Filha)',
        caregiverPhone: '(11) 99123-8877',
        address: 'Rua das Camélias, 142 - Jd. Primavera',
        conditions: ['Monitoramento de Dependente (Dona Neuza)'],
        medications: [],
      },
    },
    {
      role: 'ACS',
      title: 'Márcia Oliveira (ACS)',
      subtitle: 'Agente Comunitária de Saúde • Microárea 03 (Selo Ouro 100% de Peso)',
      icon: Users,
      color: 'from-teal-600 to-emerald-700 border-teal-500',
      profile: {
        id: 'acs-marcia-03',
        name: 'Márcia Oliveira de Paula (ACS)',
        role: 'ACS',
        autonomyLevel: 'AUTONOMO',
        cpfMasked: '***.331.445-**',
        cns: '6543.2109.8765.4321',
        birthDate: '1980-01-15',
        age: 46,
        phone: '(11) 97766-5544',
        ubsReference: 'UBS Jardim Primavera',
        esfTeam: 'Equipe 04 - Florescer',
        microArea: 'Microárea 03',
        acsName: 'Márcia Oliveira de Paula',
        caregiverName: 'Rede Atenção Primária',
        caregiverPhone: '(11) 3456-7890',
        address: 'UBS Jardim Primavera - Base Operacional',
        conditions: ['Profissional de Saúde da Família'],
        medications: [],
      },
    },
    {
      role: 'MEDICO_UBS',
      title: 'Dr. Eduardo Rocha',
      subtitle: 'Médico da Família e Comunidade • UBS Jardim Primavera',
      icon: Stethoscope,
      color: 'from-cyan-600 to-blue-700 border-cyan-500',
      profile: {
        id: 'med-eduardo-04',
        name: 'Dr. Eduardo Rocha (CRM/SP 184.920)',
        role: 'MEDICO_UBS',
        autonomyLevel: 'AUTONOMO',
        cpfMasked: '***.772.331-**',
        cns: '1234.5678.9012.3456',
        birthDate: '1985-06-18',
        age: 41,
        phone: '(11) 3456-7890',
        ubsReference: 'UBS Jardim Primavera',
        esfTeam: 'Equipe 04 - Florescer',
        microArea: 'Território Geral UBS',
        acsName: 'Márcia Oliveira (ACS)',
        caregiverName: 'Secretaria Municipal de Saúde',
        caregiverPhone: '156',
        address: 'UBS Jardim Primavera - Consultório 02',
        conditions: ['Médico de Família e Comunidade'],
        medications: [],
      },
    },
  ];

  if (!isOpen) return null;

  const handleSimulateBiometry = () => {
    setIsScanningBiometry(true);
    setBiometryProgress(10);
    audioVoice.playTone('click', soundEnabled);

    const interval = setInterval(() => {
      setBiometryProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanningBiometry(false);
          triggerLoginWithProfile(demoProfiles[0].profile, 'PACIENTE');
          return 100;
        }
        return prev + 30;
      });
    }, 250);
  };

  const triggerLoginWithProfile = (profileToUse: UserProfile, roleToUse: UserRole) => {
    audioVoice.playTone('success', soundEnabled);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (_) {}

    audioVoice.speakText(`Bem-vindo ao SEDA, ${profileToUse.name.split(' ')[0]}! Acesso concedido.`);
    onLoginSuccess(profileToUse, roleToUse);
    onClose();
  };





  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header with SUS & SEDA identity */}
        <div className="bg-gradient-to-r from-blue-900/90 via-slate-900 to-indigo-950 p-5 border-b border-slate-800 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-lg tracking-tight">SEDA ID</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600">
                  SUS Atenção Primária
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Acesso Seguro & Conexão com sua UBS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Perfis Prontos */}
        <div className="p-2 bg-slate-950/70 border-b border-slate-800 text-xs font-bold text-center text-slate-300">
          Selecione um perfil para começar:
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* 1. MODO LOGIN */}
          {authMode === 'LOGIN' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLoginMethod('CNS_CPF')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'CNS_CPF'
                      ? 'bg-slate-800 text-blue-400 border border-blue-500/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cartão SUS / CPF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginMethod('BIOMETRIA')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'BIOMETRIA'
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ScanFace className="w-4 h-4" />
                  <span>Biometria / Face ID</span>
                </button>
              </div>

              {loginMethod === 'BIOMETRIA' ? (
                <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-3xl text-center space-y-4">
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full border-2 border-emerald-500/40 ${isScanningBiometry ? 'animate-ping' : ''}`} />
                    <div className="w-20 h-20 rounded-2xl bg-emerald-950/60 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/50">
                      <Fingerprint className="w-10 h-10 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">
                      {isScanningBiometry ? `Lendo Biometria SUS... (${biometryProgress}%)` : 'Autenticação Rápida do Cidadão'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Posicione seu dedo ou olhe para a câmera para entrar instantaneamente sem digitar senhas complexas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulateBiometry}
                    disabled={isScanningBiometry}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-900/40 transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Fingerprint className="w-5 h-5" />
                    <span>{isScanningBiometry ? 'Verificando...' : 'Autenticar com 1 Toque'}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleNormalLogin} className="space-y-3.5">
                  {error && (
                    <div className="p-3 bg-red-950/50 border border-red-700 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Email</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="seu.email@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:border-blue-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Senha</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:border-blue-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    Não tem cadastro? <button type="button" onClick={() => { setAuthMode('CADASTRO'); setError(''); }} className="text-emerald-400 hover:text-emerald-300 font-bold">Clique aqui para se cadastrar</button>
                  </p>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-black rounded-2xl text-sm shadow-lg shadow-blue-900/40 transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Entrando...</span>
                      </>
                    ) : (
                      <>
                        <span>Entrar no SEDA</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 2. MODO CADASTRO COMPLETO */}
          {authMode === 'CADASTRO' && (
            <form onSubmit={handleNewRegistration} className="space-y-3.5 animate-fadeIn">
              {error && (
                <div className="p-3 bg-red-950/50 border border-red-700 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-700 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-300">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <span>Cadastro vinculado à Atenção Primária à Saúde e ao Prontuário Eletrônico SUS (e-SUS APS).</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Email (para login)</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={cadEmail}
                    onChange={(e) => setCadEmail(e.target.value)}
                    placeholder="seu.email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Senha (mín. 6 caracteres)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={cadPassword}
                    onChange={(e) => setCadPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Nome Completo</label>
                <input
                  type="text"
                  value={cadName}
                  onChange={(e) => setCadName(e.target.value)}
                  placeholder="Ex: Maria das Dores Silva"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">CPF</label>
                  <input
                    type="text"
                    value={cadCpf}
                    onChange={(e) => setCadCpf(e.target.value)}
                    placeholder="12345678901"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Cartão SUS (CNS)</label>
                  <input
                    type="text"
                    value={cadCns}
                    onChange={(e) => setCadCns(e.target.value)}
                    placeholder="7000.0000.0000.0000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Idade (Anos)</label>
                  <input
                    type="number"
                    value={cadAge}
                    onChange={(e) => setCadAge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Telefone</label>
                  <input
                    type="tel"
                    value={cadPhone}
                    onChange={(e) => setCadPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">UBS de Referência</label>
                  <input
                    type="text"
                    value={cadUbs}
                    onChange={(e) => setCadUbs(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Equipe Saúde Família</label>
                  <input
                    type="text"
                    value={cadEsf}
                    onChange={(e) => setCadEsf(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-900/40 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Cadastrando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Concluir Cadastro</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. MODO TROCA RÁPIDA DE PERFIS DEMO */}
          {authMode === 'PERFIS_RAPIDOS' && (
            <div className="space-y-3 animate-fadeIn">
              <p className="text-xs text-slate-300">
                Experimente o ecossistema SEDA com diferentes papéis do SUS em 1 clique:
              </p>

              <div className="space-y-2.5">
                {demoProfiles.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = currentRole === item.role;
                  return (
                    <button
                      key={item.role}
                      onClick={() => triggerLoginWithProfile(item.profile, item.role)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all hover:scale-[1.01] active:scale-98 ${
                        isCurrent
                          ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-950/40'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color} text-white`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{item.title}</h4>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                Ativo
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{item.subtitle}</p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800/80 text-center text-[11px] text-slate-400">
          Proteção de Dados em Saúde • LGPD & Resolução CNS 510/2016
        </div>
      </div>
    </div>
  );
};
