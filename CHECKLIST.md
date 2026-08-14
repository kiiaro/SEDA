# 🎯 SEDA + Supabase - Checklist de Setup

## ✅ Fase 1: Preparação (✓ Já Feito)

- [x] Arquivo `supabaseClient.ts` criado
- [x] Arquivo `supabaseAuth.ts` criado com funções de:
  - [x] Registro de usuários
  - [x] Login
  - [x] Logout
  - [x] Busca de perfil
- [x] Arquivo `SUPABASE_SETUP.sql` criado com:
  - [x] Tabela `users`
  - [x] Tabela `measurements`
  - [x] Tabela `daily_diary_entries`
  - [x] Tabela `appointments`
  - [x] Tabela `clinical_alerts`
  - [x] Tabela `audit_logs`
  - [x] Políticas de segurança (RLS)
- [x] `.env.local` criado com credenciais
- [x] `@supabase/supabase-js` instalado
- [x] Documentação completa criada

---

## 🔥 Fase 2: Configuração Supabase (Você faz agora)

### 2.1 - Executar SQL no Supabase

- [ ] Acesse [https://app.supabase.com](https://app.supabase.com)
- [ ] Clique em **SQL Editor** (menu esquerdo)
- [ ] Clique **+ New Query**
- [ ] Abra o arquivo `SUPABASE_SETUP.sql` (neste projeto)
- [ ] **Copie TODO o conteúdo** do arquivo
- [ ] **Cole** na área de query do Supabase
- [ ] Clique **Run** (▶️ botão azul)
- [ ] ✅ Confirmar: "Successfully executed" aparece

### 2.2 - Habilitar Email Auth

- [ ] Vá para **Authentication** → **Providers**
- [ ] Procure por "Email"
- [ ] Confirme que está **Enabled** (ativado)
- [ ] Clique em "Email" para expandir
- [ ] Marque ✅ "Enable email confirmations"
- [ ] Clique **Save**
- [ ] ✅ Email auth está configurado

### 2.3 - Verificar Credenciais

- [ ] Vá para **Project Settings** (⚙️ ícone)
- [ ] Clique em **API**
- [ ] Copie e confirme:
  - Project URL: `https://wxsiysmxcpwcdordwxpp.supabase.co`
  - Anon Key: começa com `eyJ...` ou `sb_publishable_...`

---

## 🧪 Fase 3: Testar a Aplicação

### 3.1 - Iniciar Servidor

```bash
cd /workspaces/SEDA
npm run dev
```

- [ ] Terminal mostra "SEDA SUS HealthTech Server running on http://0.0.0.0:3000"
- [ ] ✅ Servidor iniciado com sucesso

### 3.2 - Abrir no Navegador

- [ ] Acesse `http://localhost:3000`
- [ ] ✅ Aplicação carregou

### 3.3 - Testar Cadastro

- [ ] Veja a tela de Login
- [ ] Clique em **"Não tem cadastro? Cadastre-se"**
- [ ] Preencha o formulário com:
  ```
  Email: teste@example.com
  Senha: Teste@123456
  CNS: 1234.5678.9012.3456
  CPF: 12345678901
  Nome: Teste Silva
  Idade: 68
  Telefone: (11) 98765-4321
  UBS: UBS Teste
  ESF: Equipe 01
  Microárea: Microárea 01
  ACS: Maria da Silva
  (Complete os outros campos conforme necessário)
  ```
- [ ] Clique **Cadastrar**
- [ ] ✅ Mensagem de sucesso aparece

### 3.4 - Testar Login

- [ ] Clique em voltar para Login
- [ ] Digite:
  ```
  Email: teste@example.com
  Senha: Teste@123456
  ```
- [ ] Clique **Login**
- [ ] ✅ Login bem-sucedido, aplicação carrega

---

## 🔍 Fase 4: Validação

### 4.1 - Verificar Dados no Supabase

- [ ] Abra [https://app.supabase.com](https://app.supabase.com)
- [ ] Vá para **Table Editor**
- [ ] Clique em tabela **users**
- [ ] ✅ Veja o registro do usuário cadastrado com:
  - `id` (UUID)
  - `email`: teste@example.com
  - `name`: Teste Silva
  - `cns`: 1234.5678.9012.3456
  - Outros campos preenchidos

### 4.2 - Testar Segurança RLS

- [ ] Abra browser privado/incógnito
- [ ] Acesse `http://localhost:3000` novamente
- [ ] Cadastre outro usuário com email diferente
- [ ] Faça login com esse novo usuário
- [ ] ✅ Confirmar que cada usuário vê apenas seus dados

### 4.3 - Testar Requisitos

- [ ] ✅ Cadastro é obrigatório (não consegue fazer login sem cadastrar)
- [ ] ✅ Dados são salvos no Supabase
- [ ] ✅ Cada usuário tem acesso apenas aos seus dados
- [ ] ✅ Logout funciona

---

## 📊 Fase 5: Próximos Passos

Após tudo estar funcionando:

- [ ] Integrar componentes de medição de pressão
- [ ] Integrar "Diário dos Sentidos"
- [ ] Integrar lista de consultas
- [ ] Integrar alertas clínicos
- [ ] Configurar Gemini API
- [ ] Testar com dados reais SUS

---

## 📞 Troubleshooting

### Problema: "Erro ao conectar ao Supabase"
**Solução:**
- [ ] Verifique se `.env.local` existe e tem as variáveis
- [ ] Recarregue a página (Ctrl+R ou Cmd+R)
- [ ] Verifique o console do navegador (F12 → Console) para mais detalhes

### Problema: "Tabelas não encontradas"
**Solução:**
- [ ] Verifique se o SQL rodou com sucesso no Supabase
- [ ] No Supabase Console, vá para **Table Editor**
- [ ] ✅ Confirme que existe tabela `users`
- [ ] Se não existir, execute o `SUPABASE_SETUP.sql` novamente

### Problema: "Cadastro funciona mas Login não"
**Solução:**
- [ ] Verifique se o email/senha estão corretos
- [ ] Confirme no Supabase que o usuário foi criado
- [ ] Abra F12 → Console para ver mensagem de erro exata

### Problema: "Erro CORS"
**Solução:**
- [ ] Vá para Supabase Console
- [ ] **Project Settings** → **API**
- [ ] Vá para **CORS Settings**
- [ ] Adicione `http://localhost:3000`
- [ ] Adicione seu domínio de produção também

---

## ✅ Conclusão

Quando tudo estiver funcionando:

```
✅ Banco de dados Supabase criado
✅ Autenticação funcionando
✅ Cadastro obrigatório antes do login
✅ Dados salvos no Supabase
✅ Segurança RLS ativa
```

**Status Atual:** Aguardando sua execução do SQL no Supabase! 🚀

---

## 📚 Arquivos de Referência

| Arquivo | Descrição |
|---------|-----------|
| `SUPABASE_SETUP.sql` | Código SQL para rodar no Supabase ⭐ |
| `SUPABASE_QUICK_START.md` | Guia rápido |
| `SUPABASE_CONFIG.md` | Guia detalhado |
| `SUPABASE_EXAMPLES.ts` | Exemplos de código |
| `src/utils/supabaseAuth.ts` | Funções de autenticação |
| `src/utils/supabaseClient.ts` | Cliente Supabase |

---

**Próximo passo: Execute o SQL no Supabase! 🎉**
