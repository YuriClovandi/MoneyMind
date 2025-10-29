-- ========================================
-- QUERY PARA ZERAR VALORES DO USUÁRIO
-- ========================================

-- Zerar saldo do usuário (substitua o email se for diferente)
UPDATE users 
SET balance = 0, updated_at = NOW() 
WHERE email = 'teste@exemplo.com';

-- Verificar se foi zerado:
SELECT 
  email, 
  name, 
  balance, 
  updated_at 
FROM users 
WHERE email = 'teste@exemplo.com';

-- ========================================
-- OPCIONAL: Limpar despesas também (se necessário)
-- ========================================

-- Deletar todas as despesas do usuário (CUIDADO: isso remove todas!)
-- DELETE FROM expenses WHERE user_id = (SELECT id FROM users WHERE email = 'teste@exemplo.com');

-- Verificar quantas despesas o usuário tem:
SELECT COUNT(*) as total_despesas 
FROM expenses e 
JOIN users u ON e.user_id = u.id 
WHERE u.email = 'teste@exemplo.com';

