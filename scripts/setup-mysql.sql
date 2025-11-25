-- Script SQL para configurar o banco de dados MySQL para o projeto JEM
-- Execute este script após instalar o MySQL

-- Criar o banco de dados com charset UTF-8
CREATE DATABASE IF NOT EXISTS jem_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Selecionar o banco de dados
USE jem_db;

-- Mostrar que o banco foi criado com sucesso
SELECT 'Banco de dados jem_db criado com sucesso!' AS status;

-- Verificar charset e collation
SELECT 
  DEFAULT_CHARACTER_SET_NAME,
  DEFAULT_COLLATION_NAME
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'jem_db';
