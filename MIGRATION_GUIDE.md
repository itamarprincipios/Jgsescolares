# Guia de Migração: PostgreSQL → MySQL

## ✅ Alterações Realizadas

### 1. Schema do Prisma
- ✅ Alterado provider de `postgresql` para `mysql`
- ✅ Adicionado `relationMode = "prisma"` para compatibilidade

### 2. Dependências
- ✅ Adicionado `mysql2` ao package.json

### 3. Scripts Criados
- ✅ `scripts/setup-mysql.sql` - Script SQL para criar o banco
- ✅ `scripts/test-mysql-connection.js` - Script para testar conexão
- ✅ `MYSQL_SETUP.md` - Documentação completa

## 🚀 Próximos Passos (Execute na Ordem)

### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Configurar MySQL Local

#### Opção A: Se você JÁ tem MySQL instalado
1. Abra o terminal MySQL:
   ```bash
   mysql -u root -p
   ```

2. Execute o script de setup:
   ```bash
   mysql -u root -p < scripts/setup-mysql.sql
   ```

#### Opção B: Se você NÃO tem MySQL instalado
1. Baixe e instale: https://dev.mysql.com/downloads/mysql/
2. Durante a instalação, defina uma senha para o usuário `root`
3. Após instalar, execute o script:
   ```bash
   mysql -u root -p < scripts/setup-mysql.sql
   ```

### Passo 3: Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/jem_db"
NEXTAUTH_SECRET="seu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

**IMPORTANTE:** Substitua `SUA_SENHA` pela senha real do MySQL.

### Passo 4: Testar Conexão
```bash
node scripts/test-mysql-connection.js
```

Se aparecer ✅, prossiga. Se aparecer ❌, veja as dicas no output.

### Passo 5: Executar Migrações
```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas no MySQL
npx prisma migrate dev --name init_mysql
```

### Passo 6: Popular Banco de Dados
```bash
npm run db:seed
```

Isso criará um usuário admin:
- Email: `admin@example.com`
- Senha: `admin123`

### Passo 7: Iniciar Servidor
```bash
npm run dev
```

Acesse: http://localhost:3000

### Passo 8: Testar Funcionalidades

1. **Login** - http://localhost:3000/login
2. **Escolas** - http://localhost:3000/admin/schools
3. **Modalidades** - http://localhost:3000/admin/modalities
4. **Categorias** - http://localhost:3000/admin/categories
5. **Estudantes** - http://localhost:3000/professor/students
6. **Inscrições** - http://localhost:3000/professor/enrollments
7. **Relatórios** - http://localhost:3000/admin/reports

## 🔧 Troubleshooting

### Erro: "Client does not support authentication protocol"
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha';
FLUSH PRIVILEGES;
```

### Erro: "Access denied"
Verifique a senha no `.env` e as permissões:
```sql
GRANT ALL PRIVILEGES ON jem_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Erro: "Unknown database"
Execute novamente:
```bash
mysql -u root -p < scripts/setup-mysql.sql
```

## 📝 Notas Importantes

- ✅ **Nenhuma alteração de código foi necessária** - O Prisma abstrai as diferenças
- ✅ **Todos os models são compatíveis** - Enums, relações, tudo funciona
- ✅ **Sem queries SQL raw** - Todo código usa Prisma Client
- ⚠️ **Não suba o .env para o Git** - Já está no .gitignore

## 🎯 Checklist Final

- [ ] MySQL instalado e rodando
- [ ] Banco `jem_db` criado
- [ ] `.env` configurado com credenciais corretas
- [ ] `npm install` executado
- [ ] Conexão testada com sucesso
- [ ] Migrações executadas
- [ ] Seed executado
- [ ] Servidor rodando em localhost:3000
- [ ] Login funcionando
- [ ] CRUD de escolas testado
- [ ] CRUD de estudantes testado
- [ ] Inscrições testadas
- [ ] Relatórios testados

Após completar todos os itens, a migração estará concluída! 🎉
