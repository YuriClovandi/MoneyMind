import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { join } from 'path';

// Garantir que o dotenv seja carregado
dotenv.config({ path: join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas:');
  console.error('SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Não configurada');
  console.error('SUPABASE_ANON_KEY:', supabaseKey ? '✅ Configurada' : '❌ Não configurada');
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

// Cliente para operações públicas (anon key)
// Este cliente respeita RLS e políticas de segurança
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // Não persistir sessões no backend
    detectSessionInUrl: false
  }
});

// Cliente para operações administrativas (service role key)
// Este cliente BYPASS todas as RLS policies e pode fazer operações privilegiadas
// Use apenas quando necessário (ex: criar usuário na tabela users sem autenticação)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback para anon key se service key não estiver disponível
