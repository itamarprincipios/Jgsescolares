@echo off
echo Atualizando arquivo .env para MySQL...
echo.

(
echo # Configuração do Banco de Dados MySQL ^(XAMPP^)
echo # XAMPP usa senha vazia por padrão para o usuário root
echo DATABASE_URL="mysql://root:@localhost:3306/jem_db"
echo.
echo # NextAuth Configuration
echo NEXTAUTH_SECRET="goLCpyrodLQrOWpxuk9OPKeFIyzJT5wCzqDzX7QUJGc="
echo NEXTAUTH_URL="http://localhost:3000"
) > .env

echo ✓ Arquivo .env atualizado com sucesso!
echo.
echo Configuração:
echo   DATABASE_URL = mysql://root:@localhost:3306/jem_db
echo   NEXTAUTH_URL = http://localhost:3000
echo.
pause
