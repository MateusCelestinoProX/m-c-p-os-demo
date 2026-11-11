-- Script para atualizar a senha do admin na tabela auth.users do Supabase
-- Usar no SQL Editor do Dashboard do Supabase para o ambiente MCP OS

UPDATE auth.users
SET 
  encrypted_password = crypt('demo123', gen_salt('bf')),
  updated_at = now()
WHERE email = 'admin@mcpos.dev';

-- Confirmar alteracao
SELECT id, email, updated_at 
FROM auth.users 
WHERE email = 'admin@mcpos.dev';
