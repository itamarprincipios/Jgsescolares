#!/bin/bash

# Script de Deploy Automatizado para VPS Hostgator
# Domínio: jgsescolares.online
# IP: 129.121.35.30

echo "🚀 Iniciando deploy da aplicação JEM..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configurações
APP_DIR="/var/www/jem"
DOMAIN="jgsescolares.online"
DB_NAME="jem_db"
DB_USER="jem_user"

echo -e "${YELLOW}📋 Passo 1: Atualizando sistema...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}📦 Passo 2: Instalando Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
echo -e "${GREEN}✓ Node.js $(node -v) instalado${NC}"

echo -e "${YELLOW}🗄️  Passo 3: Instalando MySQL...${NC}"
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql
echo -e "${GREEN}✓ MySQL instalado${NC}"

echo -e "${YELLOW}🔧 Passo 4: Instalando PM2...${NC}"
npm install -g pm2
echo -e "${GREEN}✓ PM2 instalado${NC}"

echo -e "${YELLOW}🌐 Passo 5: Instalando Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}✓ Nginx instalado${NC}"

echo -e "${YELLOW}🔒 Passo 6: Configurando firewall...${NC}"
ufw allow 22022  # SSH (porta customizada)
ufw allow 80     # HTTP
ufw allow 443    # HTTPS
ufw --force enable
echo -e "${GREEN}✓ Firewall configurado${NC}"

echo -e "${YELLOW}📁 Passo 7: Criando diretório da aplicação...${NC}"
mkdir -p $APP_DIR
echo -e "${GREEN}✓ Diretório criado: $APP_DIR${NC}"

echo ""
echo -e "${GREEN}✅ Servidor configurado com sucesso!${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Configure o MySQL executando: mysql_secure_installation"
echo "2. Clone seu repositório em $APP_DIR"
echo "3. Configure as variáveis de ambiente"
echo "4. Execute o script de configuração do banco de dados"
echo ""
