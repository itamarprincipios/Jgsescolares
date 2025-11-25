#!/bin/bash

# Script de Configuração do Banco de Dados MySQL
# Para VPS Hostgator - jgsescolares.online

echo "🗄️  Configurando banco de dados MySQL..."
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DB_NAME="jem_db"
DB_USER="jem_user"

echo -e "${YELLOW}Digite a senha para o usuário do banco de dados 'jem_user':${NC}"
read -s DB_PASSWORD

echo ""
echo -e "${YELLOW}Criando banco de dados e usuário...${NC}"

mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Banco de dados configurado com sucesso!${NC}"
    echo ""
    echo -e "${YELLOW}Informações do banco:${NC}"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo "  Host: localhost"
    echo ""
    echo -e "${YELLOW}Use estas informações no arquivo .env:${NC}"
    echo "DATABASE_URL=\"mysql://$DB_USER:$DB_PASSWORD@localhost:3306/$DB_NAME\""
else
    echo -e "${RED}✗ Erro ao configurar banco de dados${NC}"
    exit 1
fi
