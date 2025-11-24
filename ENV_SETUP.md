# ⚙️ Configuração de Variáveis de Ambiente

## 📝 Arquivo `.env` Local

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database - Supabase (Connection Pooling)
# IMPORTANTE: Use a URL do pooler (porta 6543) para evitar erros de conexão
# Obtenha em: Supabase Dashboard → Settings → Database → Connection Pooling
DATABASE_URL="postgresql://postgres.tlhizysfuztcqxnrusnu:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# NextAuth - Autenticação
NEXTAUTH_SECRET="goLCpyrodLQrOWpxuk9OPKeFIyzJT5wCzqDzX7QUJGc="
NEXTAUTH_URL="http://localhost:3000"

# Supabase (opcional - se for usar Storage/Auth do Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://tlhizysfuztcqxnrusnu.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaGl6eXNmdXp0Y3F4bnJ1c251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDE1MzksImV4cCI6MjA3OTUxNzUzOX0.CRWoc8pDYSGGlymMBWGWaKObaeq5JHnFclLSAvraOPI"
```

> [!IMPORTANT]
> Substitua `[SUA-SENHA]` pela senha do seu banco de dados Supabase.

---

## 🚀 Variáveis para Produção (Vercel)

Configure as mesmas variáveis no Vercel, mas com os valores de produção:

| Variável | Desenvolvimento | Produção |
|----------|-----------------|----------|
| `DATABASE_URL` | URL do Supabase pooler | Mesma URL |
| `NEXTAUTH_SECRET` | Mesmo secret | Mesmo secret |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://seu-app.vercel.app` |
| `NODE_ENV` | `development` | `production` |

---

## 🔑 Como Obter as Credenciais

### DATABASE_URL (Supabase)
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard/project/tlhizysfuztcqxnrusnu/settings/database)
2. Vá em **Settings → Database**
3. Role até **"Connection Pooling"**
4. Copie a URL em modo **Transaction**
5. Adicione `?pgbouncer=true&connection_limit=1` no final

### NEXTAUTH_SECRET
Já gerado: `goLCpyrodLQrOWpxuk9OPKeFIyzJT5wCzqDzX7QUJGc=`

Ou gere um novo com:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Supabase Keys
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard/project/tlhizysfuztcqxnrusnu/settings/api)
2. Vá em **Settings → API**
3. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ✅ Verificar Configuração

Teste a conexão com o banco de dados:

```bash
node scripts/test-database-connection.js
```

Se tudo estiver correto, você verá:
```
✅ TODOS OS TESTES PASSARAM! 🎉
   Sua conexão com o Supabase está funcionando perfeitamente!
```
