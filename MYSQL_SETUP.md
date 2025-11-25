# Configuração do MySQL para o Projeto JEM

Este documento explica como configurar o MySQL localmente para o projeto após a migração do PostgreSQL.

## 1. Instalação do MySQL

### Windows
1. Baixe o MySQL Community Server em: https://dev.mysql.com/downloads/mysql/
2. Execute o instalador e siga as instruções
3. Durante a instalação, defina uma senha para o usuário `root`
4. Anote a porta (padrão: 3306)

### Verificar Instalação
```bash
mysql --version
```

## 2. Criar o Banco de Dados

Abra o terminal MySQL:
```bash
mysql -u root -p
```

Execute os seguintes comandos SQL:
```sql
CREATE DATABASE jem_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EXIT;
```

## 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto com as seguintes configurações:

```env
# Configuração do MySQL
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/jem_db"

# NextAuth
NEXTAUTH_SECRET="seu-secret-key-aqui-mude-em-producao"
NEXTAUTH_URL="http://localhost:3000"
```

**IMPORTANTE:** Substitua `SUA_SENHA` pela senha que você definiu para o usuário root do MySQL.

## 4. Executar Migrações

Após configurar o `.env`, execute os seguintes comandos:

```bash
# Gerar o Prisma Client para MySQL
npx prisma generate

# Criar as tabelas no banco de dados
npx prisma migrate dev --name init_mysql

# Popular o banco com dados iniciais (usuário admin)
npm run db:seed
```

## 5. Testar a Conexão

```bash
# Testar conexão com o banco
node scripts/test-database-connection.js

# Iniciar o servidor de desenvolvimento
npm run dev
```

## 6. Credenciais Padrão

Após executar o seed, você pode fazer login com:
- **Email:** admin@example.com
- **Senha:** admin123

## Troubleshooting

### Erro: "Client does not support authentication protocol"
Se você receber este erro, execute no MySQL:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha';
FLUSH PRIVILEGES;
```

### Erro: "Access denied for user"
Verifique se a senha no `.env` está correta e se o usuário tem permissões:
```sql
GRANT ALL PRIVILEGES ON jem_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Erro: "Unknown database 'jem_db'"
Certifique-se de ter criado o banco de dados conforme o passo 2.
