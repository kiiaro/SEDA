/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Lógica de Autenticação com Supabase
 */

import { supabase } from './supabaseClient';
import { UserProfile, UserRole, AutonomyLevel } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  cns: string;
  cpf: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  cns: string;
  cpf: string;
  name: string;
  phone: string;
  birthDate: string;
  age: number;
  ubsReference: string;
  esfTeam: string;
  microArea: string;
  acsName: string;
  caregiverName?: string;
  caregiverPhone?: string;
  address?: string;
  conditions: string[];
  medications: string[];
  role: UserRole;
  autonomyLevel: AutonomyLevel;
}

/**
 * Registra um novo usuário no Supabase
 * 1. Cria conta de autenticação
 * 2. Cria perfil do usuário na tabela users
 */
export async function registerUser(data: RegistrationData): Promise<{
  success: boolean;
  user?: AuthUser;
  profile?: any;
  error?: string;
}> {
  try {
    // 1. Criar conta de autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          cns: data.cns,
          cpf: data.cpf,
        },
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Falha ao criar usuário' };
    }

    // 2. Criar perfil do usuário na tabela users
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          cns: data.cns,
          cpf: data.cpf,
          phone: data.phone,
          birth_date: data.birthDate,
          age: data.age,
          ubs_reference: data.ubsReference,
          esf_team: data.esfTeam,
          micro_area: data.microArea,
          acs_name: data.acsName,
          caregiver_name: data.caregiverName || null,
          caregiver_phone: data.caregiverPhone || null,
          address: data.address || null,
          conditions: data.conditions,
          medications: data.medications,
          role: data.role,
          autonomy_level: data.autonomyLevel,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (profileError) {
      // Deletar a conta de auth se falhar ao criar perfil
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: `Erro ao criar perfil: ${profileError.message}` };
    }

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: data.email,
        cns: data.cns,
        cpf: data.cpf,
      },
      profile: profileData?.[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido no registro',
    };
  }
}

/**
 * Faz login do usuário no Supabase
 * Verifica se o usuário existe e tem cadastro completo
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{
  success: boolean;
  user?: AuthUser;
  profile?: any;
  error?: string;
}> {
  try {
    // Fazer login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: 'Email ou senha inválidos' };
    }

    if (!authData.user) {
      return { success: false, error: 'Falha ao fazer login' };
    }

    // Buscar perfil do usuário
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profileData) {
      return { success: false, error: 'Perfil do usuário não encontrado. Faça cadastro primeiro.' };
    }

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email || '',
        cns: profileData.cns,
        cpf: profileData.cpf,
      },
      profile: profileData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido no login',
    };
  }
}

/**
 * Converte dados do banco Supabase para UserProfile
 */
export function convertDatabaseProfileToUserProfile(dbProfile: any): UserProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    role: dbProfile.role as UserRole,
    autonomyLevel: dbProfile.autonomy_level as AutonomyLevel,
    cpfMasked: maskCPF(dbProfile.cpf),
    cns: dbProfile.cns,
    birthDate: dbProfile.birth_date,
    age: dbProfile.age,
    phone: dbProfile.phone,
    ubsReference: dbProfile.ubs_reference,
    esfTeam: dbProfile.esf_team,
    microArea: dbProfile.micro_area,
    acsName: dbProfile.acs_name,
    caregiverName: dbProfile.caregiver_name,
    caregiverPhone: dbProfile.caregiver_phone,
    address: dbProfile.address,
    conditions: dbProfile.conditions || [],
    medications: dbProfile.medications || [],
  };
}

/**
 * Mascara o CPF (mostra apenas os últimos 2 dígitos)
 */
function maskCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.$1.$2-**');
}

/**
 * Obtém o usuário logado atualmente
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!profileData) return null;

    return {
      id: data.user.id,
      email: data.user.email || '',
      cns: profileData.cns,
      cpf: profileData.cpf,
    };
  } catch {
    return null;
  }
}

/**
 * Faz logout do usuário
 */
export async function logoutUser(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signOut();
    return !error;
  } catch {
    return false;
  }
}

/**
 * Busca perfil do usuário no banco de dados
 */
export async function getUserProfile(userId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}
