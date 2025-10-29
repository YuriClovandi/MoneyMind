# 🔍 **DIAGNÓSTICO: Erro ao Criar Usuário**

## 🚨 **Melhorias Implementadas:**

### **1. Backend - Logs Detalhados**
- ✅ Adicionados logs no processo de criação do usuário
- ✅ Melhor tratamento de erros específicos do Supabase
- ✅ Verificação de erros na consulta de usuário existente
- ✅ Logs detalhados para cada etapa

### **2. Frontend - Mensagens de Erro Melhoradas**
- ✅ Exibição de erros específicos do backend
- ✅ Tratamento de diferentes tipos de erro (rede, validação, servidor)
- ✅ Mensagens mais informativas para o usuário

## 🔧 **Como Diagnosticar o Problema:**

### **1. Verificar Logs do Backend:**
Abra o terminal onde está rodando `npm run dev` e procure por estas mensagens:

```bash
# Logs que você deve ver no backend:
Tentando criar usuário no Supabase Auth: { email: '...', name: '...' }
Usuário criado no Auth: { ... }
Tentando criar perfil na tabela users: { ... }
Perfil criado com sucesso: { ... }
```

### **2. Possíveis Problemas:**

#### **A) Erro de Conexão com Supabase:**
- Verifique se o arquivo `backend/.env` existe e tem as credenciais corretas
- Verifique se o backend está rodando na porta 3333

#### **B) Tabela 'users' não existe:**
Execute no Supabase SQL Editor:
```sql
-- Verificar se a tabela existe
SELECT * FROM information_schema.tables 
WHERE table_name = 'users';
```

#### **C) Problema de Permissões:**
Verifique se as Row Level Security (RLS) está configurada corretamente

### **3. Teste Rápido:**

1. **Verifique se o backend está funcionando:**
   - Acesse: http://localhost:3333/api/health
   - Deve retornar: `{"message":"MoneyMind API está funcionando!"}`

2. **Teste o cadastro e veja os logs:**
   - Tente criar uma conta
   - Observe os logs no terminal do backend
   - Veja a mensagem de erro específica no frontend

## 🛠️ **Soluções Comuns:**

### **Se erro for "Tabela não existe":**
Execute no Supabase SQL Editor:
```sql
-- Recriar tabela users
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0,
  password_hash VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Se erro for de permissões:**
```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### **Se erro for de autenticação Supabase:**
- Verifique se as chaves no `.env` estão corretas
- Verifique se o projeto Supabase está ativo

---

**Agora tente criar uma conta novamente e me diga qual erro específico aparece!** 🎯

