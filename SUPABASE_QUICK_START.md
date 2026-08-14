# 🚀 SEDA - Setup Rápido Supabase

## 1️⃣ Copie o SQL e execute no Supabase

**Siga estes passos:**

1. Abra [https://app.supabase.com](https://app.supabase.com)
2. Vá para **SQL Editor**
3. Clique **+ New Query**
4. **Cole TODO o conteúdo** do arquivo `SUPABASE_SETUP.sql`
5. Clique **Run** ▶️

---

## 2️⃣ Código SQL Resumido (Principais Tabelas)

```sql
-- TABELA USUARIOS
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cns TEXT UNIQUE NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  age INTEGER NOT NULL,
  ubs_reference TEXT NOT NULL,
  esf_team TEXT NOT NULL,
  micro_area TEXT NOT NULL,
  acs_name TEXT NOT NULL,
  caregiver_name TEXT,
  caregiver_phone TEXT,
  address TEXT,
  conditions TEXT[] DEFAULT '{}',
  medications TEXT[] DEFAULT '{}',
  role TEXT NOT NULL CHECK (role IN ('PACIENTE', 'CUIDADOR', 'ACS', 'MEDICO_UBS')),
  autonomy_level TEXT NOT NULL CHECK (autonomy_level IN ('AUTONOMO', 'ASSISTIDO', 'COMPARTILHADO')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their profile" ON users FOR SELECT USING (auth.uid() = id);
```

---

## 3️⃣ Variáveis de Ambiente

Seu arquivo `.env.local` já foi criado com:

```
VITE_SUPABASE_URL=https://wxsiysmxcpwcdordwxpp.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_oj0yvS9SMeQ0tmCxuPXSjw_HdmBxqHH
```

✅ Já está configurado!

---

## 4️⃣ Fluxo Implementado

### ✅ Novo Usuário (Cadastro)
```
1. Clica em "Não tem cadastro?"
2. Preenche formulário com dados SUS
3. Sistema cria conta em auth.users
4. Sistema cria perfil em tabela users
5. ✅ Cadastro concluído
```

### ✅ Login Existente
```
1. Digita email e senha
2. Sistema valida em auth.users
3. Sistema busca perfil em users
4. ✅ Login bem-sucedido (só funciona se tiver cadastro)
```

---

## 5️⃣ Arquivos Criados

```
/workspaces/SEDA/
├── src/utils/
│   ├── supabaseClient.ts      ← Cliente Supabase
│   └── supabaseAuth.ts        ← Funções de auth
├── .env.local                 ← Variáveis de ambiente
├── SUPABASE_SETUP.sql         ← Código SQL completo
└── SUPABASE_CONFIG.md         ← Guia detalhado
```

---

## 6️⃣ Teste a Aplicação

```bash
npm run dev
```

Acesse em **http://localhost:3000**

### Testar Cadastro:
- Email: `teste@example.com`
- Senha: `Teste@123456`
- CNS: `1234.5678.9012.3456`
- CPF: `12345678901`

### Testar Login:
- Use os dados do cadastro acima

---

## 🔑 Credenciais Supabase

- **URL:** `https://wxsiysmxcpwcdordwxpp.supabase.co`
- **Anon Key:** `sb_publishable_oj0yvS9SMeQ0tmCxuPXSjw_HdmBxqHH`

---

## ⚠️ Importante

1. **Execute o SQL** no Supabase ANTES de testar a app
2. Não faça commit do `.env.local` (já está em `.gitignore`)
3. O cadastro é **obrigatório** antes do login
4. Todos os dados são salvos no Supabase

---

## 📞 Próximas Etapas

Após o Supabase estar rodando:
- [ ] Executar SQL no Supabase Console
- [ ] Testar cadastro e login
- [ ] Integrar componentes de interface
- [ ] Adicionar mais funcionalidades (medições, diário, etc)

---

**Tudo pronto! 🎉**
