/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Exemplo de Integração com Supabase Auth
 * 
 * Este arquivo mostra como integrar Supabase no seu componente AuthModal
 */

// EXEMPLO 1: Importar as funções
// ================================
import { 
  registerUser, 
  loginUser, 
  logoutUser,
  getCurrentUser,
  convertDatabaseProfileToUserProfile,
  type RegistrationData 
} from '../utils/supabaseAuth';

// EXEMPLO 2: Registrar novo usuário
// ===================================
async function handleRegister() {
  const registrationData: RegistrationData = {
    email: 'usuario@example.com',
    password: 'Senha@123456',
    cns: '1234.5678.9012.3456',
    cpf: '12345678901',
    name: 'João Silva',
    phone: '(11) 98765-4321',
    birthDate: '1980-01-15',
    age: 44,
    ubsReference: 'UBS Jardim Primavera',
    esfTeam: 'Equipe 04 - Florescer',
    microArea: 'Microárea 03',
    acsName: 'Márcia Oliveira',
    caregiverName: 'Maria Silva',
    caregiverPhone: '(11) 99123-8877',
    address: 'Rua das Flores, 123',
    conditions: ['Hipertensão', 'Diabetes'],
    medications: ['Losartana 50mg', 'Metformina 850mg'],
    role: 'PACIENTE',
    autonomyLevel: 'ASSISTIDO',
  };

  const result = await registerUser(registrationData);

  if (result.success) {
    console.log('✅ Cadastro bem-sucedido!');
    console.log('Usuário:', result.user);
    // Redirecionar para login
  } else {
    console.error('❌ Erro no cadastro:', result.error);
  }
}

// EXEMPLO 3: Fazer login
// =======================
async function handleLogin() {
  const result = await loginUser('usuario@example.com', 'Senha@123456');

  if (result.success) {
    console.log('✅ Login bem-sucedido!');
    console.log('Usuário:', result.user);
    
    // Converter para UserProfile
    const userProfile = convertDatabaseProfileToUserProfile(result.profile);
    console.log('Perfil:', userProfile);
    
    // Chamar onLoginSuccess com os dados
    // onLoginSuccess(userProfile, userProfile.role);
  } else {
    console.error('❌ Erro no login:', result.error);
  }
}

// EXEMPLO 4: Verificar se usuário está logado
// =============================================
async function checkUserLoggedIn() {
  const user = await getCurrentUser();
  
  if (user) {
    console.log('✅ Usuário logado:', user.email);
  } else {
    console.log('❌ Nenhum usuário logado');
  }
}

// EXEMPLO 5: Fazer logout
// ========================
async function handleLogout() {
  const success = await logoutUser();
  
  if (success) {
    console.log('✅ Logout bem-sucedido');
  } else {
    console.log('❌ Erro ao fazer logout');
  }
}

// EXEMPLO 6: Como integrar em React (dentro do componente)
// ===========================================================
/*
import { useState } from 'react';
import { registerUser, loginUser, logoutUser } from '../utils/supabaseAuth';

export const AuthModal = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginClick = async () => {
    setLoading(true);
    setError('');
    
    const result = await loginUser(email, password);
    
    if (result.success && result.profile) {
      const userProfile = convertDatabaseProfileToUserProfile(result.profile);
      onLoginSuccess(userProfile, userProfile.role);
    } else {
      setError(result.error || 'Erro ao fazer login');
    }
    
    setLoading(false);
  };

  const handleRegisterClick = async (formData: RegistrationData) => {
    setLoading(true);
    setError('');
    
    const result = await registerUser(formData);
    
    if (result.success) {
      setError('Cadastro bem-sucedido! Faça login para continuar.');
      // Redirecionar para login após alguns segundos
      setTimeout(() => {
        setEmail(formData.email);
        setPassword(formData.password);
      }, 1000);
    } else {
      setError(result.error || 'Erro ao fazer cadastro');
    }
    
    setLoading(false);
  };

  return (
    <div>
      {error && <p className="text-red-600">{error}</p>}
      
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
      />
      
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        type="password"
      />
      
      <button 
        onClick={handleLoginClick}
        disabled={loading}
      >
        {loading ? 'Entrando...' : 'Login'}
      </button>
      
      <button 
        onClick={() => handleRegisterClick(formData)}
        disabled={loading}
      >
        {loading ? 'Cadastrando...' : 'Cadastro'}
      </button>
    </div>
  );
};
*/

// ESTRUTURA DO BANCO DE DADOS
// ============================
/*
TABELA: auth.users (Supabase Auth)
- id (UUID)
- email
- password (hasheada)
- created_at

TABELA: users (Criada no SQL)
- id (referencia auth.users)
- email
- name
- cns
- cpf
- phone
- birth_date
- age
- ubs_reference
- esf_team
- micro_area
- acs_name
- caregiver_name
- caregiver_phone
- address
- conditions (array)
- medications (array)
- role
- autonomy_level
- created_at
- updated_at
*/

// FLUXO COMPLETO
// ===============
/*
1. CADASTRO:
   ├─ Usuário preenche formulário
   ├─ Chama registerUser(data)
   ├─ Sistema cria conta em auth.users
   ├─ Sistema cria perfil em users
   └─ ✅ Cadastro confirmado

2. LOGIN:
   ├─ Usuário insere email/senha
   ├─ Chama loginUser(email, password)
   ├─ Sistema valida em auth.users
   ├─ Sistema busca perfil em users
   ├─ Sistema converte para UserProfile
   └─ ✅ Login bem-sucedido

3. LOGOUT:
   ├─ Usuário clica em Sair
   ├─ Chama logoutUser()
   └─ ✅ Sessão encerrada
*/

console.log('Exemplos de integração Supabase Auth carregados!');
