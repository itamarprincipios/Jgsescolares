#!/bin/bash

# Script de Configuração do Nginx
# Domínio: jgsescolares.online

echo "🌐 Configurando Nginx..."
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DOMAIN="jgsescolares.online"
CONFIG_FILE="/etc/nginx/sites-available/jem"

echo -e "${YELLOW}Criando configuração do Nginx...${NC}"

cat > $CONFIG_FILE << 'EOF'
server {
    listen 80;
    server_name jgsescolares.online www.jgsescolares.online;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

echo -e "${GREEN}✓ Arquivo de configuração criado${NC}"

echo -e "${YELLOW}Ativando configuração...${NC}"
ln -sf $CONFIG_FILE /etc/nginx/sites-enabled/jem

echo -e "${YELLOW}Removendo configuração padrão...${NC}"
rm -f /etc/nginx/sites-enabled/default

echo -e "${YELLOW}Testando configuração do Nginx...${NC}"
nginx -t

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Configuração válida${NC}"
    echo -e "${YELLOW}Reiniciando Nginx...${NC}"
    systemctl restart nginx
    echo -e "${GREEN}✓ Nginx configurado com sucesso!${NC}"
else
    echo -e "${RED}✗ Erro na configuração do Nginx${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Nginx configurado para $DOMAIN${NC}"
echo ""
