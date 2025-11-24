-- Script SQL para criar usuário admin no Supabase
-- Execute este script no SQL Editor do Supabase após o deploy

-- 1. Criar uma escola para o admin (se ainda não existir)
INSERT INTO "School" (id, name, city, director, phone, "createdAt", "updatedAt")
VALUES (
  'clx-admin-school-001',
  'Administração JEM',
  'São Paulo',
  'Sistema',
  '(00) 0000-0000',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar usuário admin
-- Email: admin@jem.com
-- Senha: admin000
INSERT INTO "User" (id, name, email, password, role, active, "schoolId", "createdAt", "updatedAt")
VALUES (
  'clx-admin-user-001',
  'Administrador',
  'admin@jem.com',
  '$2b$10$NbARmh5CEo/va2w1EvdWOOHssIoIaBgqY11qJHtNVF1bFBKA2FUHi',
  'ADMIN',
  true,
  'clx-admin-school-001',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  active = true,
  role = 'ADMIN';

-- Verificar se foi criado
SELECT id, name, email, role, active FROM "User" WHERE email = 'admin@jem.com';
