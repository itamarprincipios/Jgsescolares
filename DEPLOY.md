# Guia Rápido de Deploy - VPS Hostgator

## Informações da VPS
- **Host:** 129.121.35.30
- **Porta SSH:** 22022
- **Usuário:** root
- **Domínio:** jgsescolares.online

## Passo a Passo

### 1. Conectar à VPS

```bash
ssh -p 22022 root@129.121.35.30
```

### 2. Executar Scripts de Configuração

Os scripts estão na pasta `scripts/deploy/`. Execute na ordem:

```bash
# 1. Configurar servidor
bash 01-setup-server.sh

# 2. Configurar MySQL (você será solicitado a definir senha)
mysql_secure_installation
bash 02-setup-database.sh

# 3. Clonar repositório
cd /var/www/jem
git clone https://github.com/SEU_USUARIO/jem-app.git .

# 4. Configurar .env
nano .env
# Cole as configurações (veja abaixo)

# 5. Fazer deploy
bash 04-deploy-app.sh

# 6. Configurar Nginx
bash 03-setup-nginx.sh

# 7. Configurar SSL (aguarde DNS propagar primeiro!)
bash 05-setup-ssl.sh
```

### 3. Configuração do .env

```env
# Database (use a senha que você definiu no passo 2)
DATABASE_URL="mysql://jem_user:SUA_SENHA@localhost:3306/jem_db"

# NextAuth (gere com: openssl rand -base64 32)
NEXTAUTH_SECRET="SEU_SECRET_AQUI"
NEXTAUTH_URL="https://jgsescolares.online"
```

### 4. Comandos Úteis

```bash
# Ver status da aplicação
pm2 status

# Ver logs
pm2 logs jem-app

# Reiniciar aplicação
pm2 restart jem-app

# Atualizar aplicação
cd /var/www/jem
git pull
npm install
npm run build
pm2 restart jem-app
```

## Credenciais Padrão

Após o deploy, acesse:
- **URL:** https://jgsescolares.online
- **Admin:** admin@jem.com
- **Senha:** admin123

**⚠️ IMPORTANTE:** Altere a senha do admin após o primeiro login!

## Troubleshooting

### Aplicação não inicia
```bash
pm2 logs jem-app --lines 50
```

### Erro 502 Bad Gateway
```bash
pm2 status  # Verificar se app está rodando
systemctl status nginx  # Verificar Nginx
```

### SSL não funciona
- Aguarde propagação DNS (pode levar até 24h)
- Verifique se domínio aponta para 129.121.35.30
- Execute: `certbot certificates` para ver status
