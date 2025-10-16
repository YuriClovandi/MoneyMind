-- ========================================
-- QUERIES PARA CRIAR USUÁRIO NO SUPABASE
-- ========================================

-- 1. PRIMEIRO: Criar o usuário na tabela auth.users (isso é feito automaticamente pelo Supabase Auth)
-- Você precisa criar via Dashboard → Authentication → Users ou via API

-- 2. SEGUNDO: Inserir dados do usuário na tabela users
-- Substitua o UUID a seguir pelo ID real do usuário criado no auth.users

-- Para obter o ID do usuário que acabou de criar, execute primeiro:
-- SELECT id, email FROM auth.users WHERE email = 'teste@exemplo.com';

-- Depois use esse ID na query abaixo:
INSERT INTO users (
  id,
  email,
  name,
  balance,
  password_hash,
  created_at,
  updated_at
) VALUES (
  'SUBSTITUA_PELO_ID_DO_USUARIO',  -- Use o ID real do auth.users
  'teste@exemplo.com',
  'Usuário Teste',
  1000.00,
  '$2a$12$exemplo_hash_aqui',  -- Hash da senha (opcional, pois usar Supabase Auth)
  NOW(),
  NOW()
);

-- ========================================
-- QUERIES ÚTEIS PARA TESTAR
-- ========================================

-- Verificar se o usuário foi criado:
SELECT * FROM users WHERE email = 'teste@exemplo.com';

-- Listar todos os usuários:
SELECT id, email, name, balance, created_at FROM users;

-- Atualizar saldo do usuário:
UPDATE users 
SET balance = 2500.75, updated_at = NOW() 
WHERE email = 'teste@exemplo.com';

-- ========================================
-- CRIAR DESPESA PARA O USUÁRIO
-- ========================================

-- Inserir uma despesa de exemplo:
INSERT INTO expenses (
  user_id,
  description,
  amount,
  category,
  date,
  created_at,
  updated_at
) VALUES (
  'SUBSTITUA_PELO_ID_DO_USUARIO',  -- Use o mesmo ID do usuário
  'Compra no supermercado',
  150.50,
  'Alimentação',
  CURRENT_DATE,
  NOW(),
  NOW()
);

-- Verificar despesas do usuário:
SELECT e.*, u.name as user_name 
FROM expenses e 
JOIN users u ON e.user_id = u.id 
WHERE u.email = 'teste@exemplo.com'
ORDER BY e.date DESC;

-- ========================================
-- ZERAR VALORES DO USUÁRIO
-- ========================================

-- Zerar saldo do usuário:
UPDATE users 
SET balance = 0, updated_at = NOW() 
WHERE email = 'teste@exemplo.com';

-- Verificar se foi zerado:
SELECT email, name, balance, updated_at FROM users WHERE email = 'teste@exemplo.com';
