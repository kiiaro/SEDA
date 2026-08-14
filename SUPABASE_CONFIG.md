# SEDA - Configuração Supabase 🚀

## 📋 Resumo

Este arquivo contém as instruções para configurar o banco de dados Supabase para a aplicação SEDA.

**URL do Supabase:** `https://wxsiysmxcpwcdordwxpp.supabase.co`

---

## ✅ Passo 1: Acessar o Supabase Console

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Faça login com sua conta
3. Selecione o projeto SEDA (ou crie um novo)

---

## ✅ Passo 2: Executar o Script SQL

1. No painel do Supabase, clique em **SQL Editor** (no menu esquerdo)
2. Clique no botão **+ New Query**
3. Cole o conteúdo do arquivo `SUPABASE_SETUP.sql` no editor
4. Clique no botão **Run** (▶️ canto superior direito)
5. Aguarde a execução (deve aparecer "Successfully executed")

**O script cria:**
- ✅ Tabela `users` - Dados dos usuários cadastrados
- ✅ Tabela `measurements` - Medições (pressão, glicose, peso)
- ✅ Tabela `daily_diary_entries` - Diário dos Sentidos
- ✅ Tabela `appointments` - Consultas e agendamentos
- ✅ Tabela `clinical_alerts` - Alertas clínicos
- ✅ Tabela `audit_logs` - Log de ações
- ✅ Índices de performance
- ✅ Políticas de segurança (RLS)

---

## ✅ Passo 3: Configurar Autenticação no Supabase

### 3.1 Habilitar Email/Password Auth

1. Vá para **Authentication** → **Providers**
2. Procure por "Email" e garanta que está **Enabled**
3. Clique em "Email" para expandir
4. Marque ✅ "Enable email confirmations"
5. Clique em "Save"

### 3.2 Configurar URL de Confirmação (Opcional)

1. Vá para **Authentication** → **Email Templates**
2. Customize as templates de email se desejar

---

## ✅ Passo 4: Obter as Credenciais

1. Vá para **Project Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie:
   - **Project URL**: `https://wxsiysmxcpwcdordwxpp.supabase.co`
   - **anon public key**: (chave que começa com `eyJ...`)

---

## ✅ Passo 5: Configurar Variáveis de Ambiente

1. Na raiz do projeto SEDA, crie um arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://wxsiysmxcpwcdordwxpp.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_oj0yvS9SMeQ0tmCxuPXSjw_HdmBxqHH
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui
```

2. **NÃO commit este arquivo no Git** (já deve estar em `.gitignore`)

---

## ✅ Passo 6: Instalar Dependências

Na pasta do projeto, execute:

```bash
npm install
```

Isso vai instalar a dependência `@supabase/supabase-js`.

---

## ✅ Passo 7: Iniciar a Aplicação

```bash
npm run dev
```

A aplicação agora vai:
1. ✅ Mostrar a tela de Login
2. ✅ Exigir Cadastro antes de fazer Login
3. ✅ Salvar dados no Supabase
4. ✅ Autenticar usuários via Supabase

---

## 🧪 Testar o Fluxo Completo

### Novo Usuário:
1. Abra a aplicação
2. Clique em **"Não tem cadastro? Cadastre-se"**
3. Preencha o formulário com:
   - Email: `teste@example.com`
   - Senha: `Teste@123456`
   - CNS: `1234.5678.9012.3456`
   - CPF: `12345678901`
   - Nome: `Teste Silva`
   - (Preencha os outros campos conforme necessário)
4. Clique em **Cadastrar**
5. Verá mensagem de sucesso ✅

### Fazer Login:
1. Volte para a tela de login
2. Digite o email e senha do cadastro
3. Clique em **Login**
4. Pronto! ✅ Você entrou

---

## 🔐 Segurança

### Row Level Security (RLS)
- Todos os dados têm proteção RLS ativada
- Usuários só conseguem acessar seus próprios dados
- As chaves de API são anônimas (seguras)

### Boas Práticas:
- ❌ Nunca commit a chave `anon_key` no repositório
- ✅ Use variáveis de ambiente (`.env.local`)
- ✅ Configure CORS no Supabase se necessário
- ✅ Revise as políticas de RLS regularmente

---

## 📞 Verificar Status do Banco

### No Supabase Console:
1. Vá para **Logs** → **Database Logs** para ver queries
2. Vá para **Monitoring** para ver performance
3. Vá para **Backup** para fazer backup automático

### Via Terminal (Supabase CLI - Opcional):
```bash
npx supabase status
npx supabase db push
```

---

## ❓ Troubleshooting

### "Erro: Tabelas não encontradas"
- Execute o script SQL novamente
- Verifique se o SQL Editor retornou "Successfully executed"

### "Erro: Invalid API key"
- Verifique se copiou a chave `anon` correta (não a `service_role`)
- Recarregue a página se mudar as env vars

### "Erro: CORS"
- Vá para **Project Settings** → **API** → **CORS Settings**
- Adicione `http://localhost:3000` e seu domínio de produção

### "Email de confirmação não chega"
- Verifique a pasta de spam
- Configure SMTP real no **Email Settings** se estiver em produção

---

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth/auth-password)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Pronto! 🎉 Seu banco SEDA está configurado e rodando no Supabase!**
