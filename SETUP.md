# 🚀 Setup Rápido - MoneyMind

## Configuração Inicial

### 1. Instalar Dependências
```bash
npm run install:all
```

### 2. Configurar Variáveis de Ambiente

#### Backend
Crie `backend/.env` com:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
PORT=3333
NODE_ENV=development
JWT_SECRET=seu_jwt_secret_super_seguro_min_32_chars
FRONTEND_URL=http://localhost:3000
```

#### Frontend
Crie `frontend/.env` com:
```env
REACT_APP_API_URL=http://localhost:3333/api
```

### 3. Configurar Banco Supabase
Execute no SQL Editor do Supabase:

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

-- Índices
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
```

### 4. Executar Projeto
```bash
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3333/api
- Health Check: http://localhost:3333/api/health
