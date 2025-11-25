#!/bin/bash

# Script de Deploy da Aplicação
# Para VPS Hostgator - jgsescolares.online

echo "🚀 Fazendo deploy da aplicação..."
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

APP_DIR="/var/www/jem"

cd $APP_DIR || exit 1

echo -e "${YELLOW}📦 Instalando dependências...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erro ao instalar dependências${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependências instaladas${NC}"

echo -e "${YELLOW}🔨 Gerando Prisma Client...${NC}"
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erro ao gerar Prisma Client${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Prisma Client gerado${NC}"

echo -e "${YELLOW}📊 Executando migrações do banco...${NC}"
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erro ao executar migrações${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Migrações executadas${NC}"

echo -e "${YELLOW}🌱 Executando seed (criar admin)...${NC}"
npm run db:seed
echo -e "${GREEN}✓ Seed executado${NC}"

echo -e "${YELLOW}🏗️  Fazendo build de produção...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erro no build${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build concluído${NC}"

echo -e "${YELLOW}🔄 Configurando PM2...${NC}"

# Parar aplicação se já estiver rodando
pm2 delete jem-app 2>/dev/null || true

# Iniciar aplicação
pm2 start npm --name "jem-app" -- start

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup systemd -u root --hp /root

echo -e "${GREEN}✓ Aplicação iniciada com PM2${NC}"

echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo -e "${YELLOW}Status da aplicação:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}Para ver os logs:${NC}"
echo "  pm2 logs jem-app"
echo ""
