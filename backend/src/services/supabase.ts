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

// Cliente para operações públicas
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente para operações administrativas (com service role key)
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseKey
);
