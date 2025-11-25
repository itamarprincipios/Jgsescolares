# Guia Rápido: Instalação do MySQL no Windows

## Opção 1: MySQL Community Server (Recomendado) ⭐

### Download
1. Acesse: https://dev.mysql.com/downloads/mysql/
2. Escolha: **Windows (x86, 64-bit), MSI Installer**
3. Baixe o instalador (mysql-installer-community-X.X.X.msi)

### Instalação
1. Execute o instalador MSI
2. Escolha: **Developer Default** ou **Server only**
3. Clique em **Execute** para instalar os componentes
4. Na configuração do servidor:
   - **Type and Networking**: Mantenha padrão (Port 3306)
   - **Authentication Method**: Use Strong Password Encryption
   - **Accounts and Roles**: 
     - Defina uma senha para o usuário `root` (ANOTE ESTA SENHA!)
     - Exemplo: `root123` (para desenvolvimento local)
5. **Windows Service**: Mantenha marcado "Start MySQL Server at System Startup"
6. Clique em **Execute** e depois **Finish**

### Verificar Instalação
Abra um novo terminal PowerShell e execute:
```powershell
mysql --version
```

Se aparecer a versão, está instalado! ✅

---

## Opção 2: XAMPP (Mais Fácil) 🚀

### Download
1. Acesse: https://www.apachefriends.org/
2. Baixe o XAMPP para Windows

### Instalação
1. Execute o instalador
2. Selecione apenas: **MySQL** e **phpMyAdmin**
3. Instale na pasta padrão: `C:\xampp`
4. Após instalar, abra o **XAMPP Control Panel**
5. Clique em **Start** ao lado de MySQL

### Configurar PATH (Importante!)
1. Abra as Variáveis de Ambiente do Windows
2. Edite a variável **Path**
3. Adicione: `C:\xampp\mysql\bin`
4. Clique OK e reinicie o terminal

### Verificar
```powershell
mysql --version
```

---

## Opção 3: Laragon (Moderno) 🎯

### Download
1. Acesse: https://laragon.org/download/
2. Baixe a versão Full

### Instalação
1. Execute o instalador
2. Instale com as opções padrão
3. Inicie o Laragon
4. Clique em **Start All**

### Configurar PATH
Laragon geralmente configura automaticamente, mas se não:
1. Adicione ao PATH: `C:\laragon\bin\mysql\mysql-X.X.X-winx64\bin`

---

## Após Instalar (Qualquer Opção)

### 1. Testar MySQL
Abra um NOVO terminal PowerShell:
```powershell
mysql --version
```

### 2. Conectar ao MySQL
```powershell
mysql -u root -p
```
Digite a senha que você definiu.

### 3. Criar o Banco de Dados
No prompt do MySQL, execute:
```sql
CREATE DATABASE jem_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EXIT;
```

Ou use o script pronto:
```powershell
mysql -u root -p < scripts/setup-mysql.sql
```

### 4. Configurar o .env
Edite o arquivo `.env`:
```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/jem_db"
NEXTAUTH_SECRET="seu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

Substitua `SUA_SENHA` pela senha do root que você definiu.

### 5. Testar Conexão
```powershell
node scripts/test-mysql-connection.js
```

### 6. Executar Migrações
```powershell
npx prisma migrate dev --name init_mysql
```

### 7. Popular Banco
```powershell
npm run db:seed
```

### 8. Iniciar Aplicação
```powershell
npm run dev
```

---

## Troubleshooting

### MySQL não reconhecido após instalação
- Reinicie o terminal PowerShell
- Verifique se o PATH foi configurado corretamente
- Tente abrir um novo terminal como Administrador

### Esqueci a senha do root
**XAMPP**: A senha padrão é vazia (deixe em branco)
```env
DATABASE_URL="mysql://root:@localhost:3306/jem_db"
```

**MySQL Community**: Você precisará resetar a senha seguindo a documentação oficial.

### Porta 3306 em uso
Outro serviço está usando a porta. Você pode:
1. Parar o outro serviço
2. Ou mudar a porta do MySQL na instalação

---

## Recomendação

Para desenvolvimento local, recomendo **XAMPP** porque:
- ✅ Instalação mais simples
- ✅ Inclui phpMyAdmin (interface gráfica)
- ✅ Fácil de iniciar/parar o MySQL
- ✅ Senha padrão vazia (mais fácil para dev)

Escolha a opção que preferir e me avise quando terminar a instalação! 🚀
