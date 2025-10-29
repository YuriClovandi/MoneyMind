# MoneyMind

Sistema de controle financeiro pessoal com React (frontend) e Node.js/TypeScript/Express (backend) integrado ao Supabase.

## 🏗️ Estrutura do Projeto (Monorepo)

```
MoneyMind/
├── frontend/          # React App
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Node.js/TypeScript API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
└── package.json       # Root package.json (monorepo)
```

## 🚀 Configuração e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Supabase

### 1. Instalação das Dependências

```bash
# Instalar todas as dependências (frontend + backend)
npm run install:all
```

### 2. Configuração do Supabase

#### Backend (.env)
Crie um arquivo `.env` na pasta `backend/` baseado no `backend/env.example`:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
PORT=3333
NODE_ENV=development
JWT_SECRET=seu_jwt_secret_super_seguro
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
Crie um arquivo `.env` na pasta `frontend/` baseado no `frontend/env.example`:

```env
REACT_APP_API_URL=http://localhost:3333/api
```

### 3. Configuração do Banco de Dados (Supabase)

Execute os seguintes comandos SQL no Supabase SQL Editor:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0,
  password_hash VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de despesas
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  description VARCHAR(500) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
```

### 4. Execução

#### Desenvolvimento (Frontend + Backend)
```bash
# Executar ambos os projetos simultaneamente
npm run dev
```

#### Execução Separada
```bash
# Apenas o frontend (porta 3000)
npm run frontend:dev

# Apenas o backend (porta 3333)
npm run backend:dev
```

### 5. URLs de Acesso
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3333/api
- **Health Check**: http://localhost:3333/api/health

## 🔧 Scripts Disponíveis

```bash
npm run dev                # Executa frontend e backend em desenvolvimento
npm run frontend:dev       # Executa apenas o frontend
npm run backend:dev        # Executa apenas o backend
npm run frontend:build     # Build do frontend para produção
npm run backend:build      # Build do backend para TypeScript
npm run build:all          # Build completo (frontend + backend)
npm run install:all        # Instala dependências de ambos os projetos
```

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login

### Usuário
- `GET /api/user/profile` - Obter perfil (requer auth)
- `PUT /api/user/profile` - Atualizar perfil (requer auth)
- `PUT /api/user/balance` - Atualizar saldo (requer auth)

### Despesas
- `GET /api/expenses` - Listar despesas (requer auth)
- `POST /api/expenses` - Criar despesa (requer auth)
- `GET /api/expenses/:id` - Obter despesa específica (requer auth)
- `PUT /api/expenses/:id` - Atualizar despesa (requer auth)
- `DELETE /api/expenses/:id` - Deletar despesa (requer auth)

## 🚀 Deploy no Heroku

O MoneyMind está configurado para deploy completo (frontend + backend) no Heroku com domínio customizado.

### 📚 Guias de Deploy

- **⚡ Guia Rápido**: Veja `DEPLOY-QUICK-START.md`
- **📖 Guia Completo**: Veja `DEPLOY-HEROKU.md`
- **🤖 Script Automatizado**: Use `SETUP-HEROKU.sh` (Linux/Mac)

### 🚀 Passos Rápidos

1. **Login e criar app:**
   ```bash
   heroku login
   heroku create moneymind
   ```

2. **Configurar variáveis:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SUPABASE_URL=...
   heroku config:set REACT_APP_API_URL=https://moneymind1.me/api
   # ... (veja DEPLOY-QUICK-START.md para lista completa)
   ```

3. **Adicionar domínio:**
   ```bash
   heroku domains:add moneymind1.me
   ```

4. **Configurar DNS no Namecheap:**
   - CNAME @ → `moneymind.herokuapp.com`
   - CNAME www → `moneymind.herokuapp.com`

5. **Deploy:**
   ```bash
   git push heroku main
   ```

### 🌐 Domínio Customizado

O projeto está configurado para:
- ✅ Servir frontend e backend do mesmo domínio
- ✅ HTTPS automático (SSL Let's Encrypt)
- ✅ CORS configurado para `moneymind1.me`
- ✅ React Router funcionando em produção

**Acesse:** https://moneymind1.me

## 🛠️ Tecnologias

### Frontend
- React 18
- React Router DOM
- Axios
- Recharts (gráficos)

### Backend
- Node.js
- TypeScript
- Express.js
- Supabase (PostgreSQL)
- JWT (autenticação)
- Bcrypt (hash de senhas)