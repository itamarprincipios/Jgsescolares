#!/bin/bash

# Script de Configuração SSL com Let's Encrypt
# Domínio: jgsescolares.online

echo "🔒 Configurando SSL com Let's Encrypt..."
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DOMAIN="jgsescolares.online"

echo -e "${YELLOW}📦 Instalando Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

echo -e "${GREEN}✓ Certbot instalado${NC}"

echo ""
echo -e "${YELLOW}Digite seu email para notificações do Let's Encrypt:${NC}"
read EMAIL

echo ""
echo -e "${YELLOW}🔐 Obtendo certificado SSL...${NC}"
certbot --nginx \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Certificado SSL instalado com sucesso!${NC}"
    echo ""
    echo -e "${GREEN}✅ Seu site agora está acessível via HTTPS!${NC}"
    echo "   https://$DOMAIN"
    echo ""
    echo -e "${YELLOW}Renovação automática configurada${NC}"
    echo "  Certbot renovará automaticamente o certificado antes de expirar"
else
    echo -e "${RED}✗ Erro ao obter certificado SSL${NC}"
    echo ""
    echo -e "${YELLOW}Possíveis causas:${NC}"
    echo "  - DNS ainda não propagado (aguarde algumas horas)"
    echo "  - Firewall bloqueando porta 80/443"
    echo "  - Domínio não aponta para este servidor"
    exit 1
fi
