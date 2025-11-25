@echo off
echo Criando banco de dados jem_db no MySQL/MariaDB...
echo.

C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS jem_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %errorlevel% equ 0 (
    echo ✓ Banco de dados criado com sucesso!
    echo.
    echo Verificando bancos de dados existentes:
    C:\xampp\mysql\bin\mysql.exe -u root -e "SHOW DATABASES;"
) else (
    echo ✗ Erro ao criar banco de dados
    echo Certifique-se de que o MySQL está rodando no XAMPP Control Panel
)

pause
