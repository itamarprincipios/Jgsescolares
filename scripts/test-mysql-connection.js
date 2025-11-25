const mysql = require('mysql2/promise');
require('dotenv').config();

async function testMySQLConnection() {
    console.log('🔍 Testando conexão com MySQL...\n');

    // Extrair informações da DATABASE_URL
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        console.error('❌ DATABASE_URL não encontrada no arquivo .env');
        process.exit(1);
    }

    console.log('📋 DATABASE_URL configurada:', dbUrl.replace(/:[^:@]+@/, ':****@'));

    try {
        // Parse da URL do MySQL
        const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

        if (!urlMatch) {
            console.error('❌ Formato inválido da DATABASE_URL');
            console.log('Formato esperado: mysql://usuario:senha@host:porta/database');
            process.exit(1);
        }

        const [, user, password, host, port, database] = urlMatch;

        console.log('\n📊 Configurações:');
        console.log(`   Host: ${host}`);
        console.log(`   Porta: ${port}`);
        console.log(`   Usuário: ${user}`);
        console.log(`   Banco: ${database}\n`);

        // Tentar conectar
        console.log('🔌 Conectando ao MySQL...');
        const connection = await mysql.createConnection({
            host,
            port: parseInt(port),
            user,
            password,
            database
        });

        console.log('✅ Conexão estabelecida com sucesso!\n');

        // Testar query simples
        console.log('🧪 Executando query de teste...');
        const [rows] = await connection.execute('SELECT DATABASE() as db, VERSION() as version');

        console.log('✅ Query executada com sucesso!');
        console.log(`   Banco atual: ${rows[0].db}`);
        console.log(`   Versão MySQL: ${rows[0].version}\n`);

        // Verificar tabelas
        console.log('📋 Verificando tabelas...');
        const [tables] = await connection.execute('SHOW TABLES');

        if (tables.length === 0) {
            console.log('⚠️  Nenhuma tabela encontrada. Execute as migrações do Prisma:');
            console.log('   npx prisma migrate dev --name init_mysql\n');
        } else {
            console.log(`✅ ${tables.length} tabela(s) encontrada(s):`);
            tables.forEach(table => {
                const tableName = Object.values(table)[0];
                console.log(`   - ${tableName}`);
            });
            console.log('');
        }

        await connection.end();
        console.log('✅ Teste concluído com sucesso!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Erro ao conectar com MySQL:');
        console.error(`   ${error.message}\n`);

        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Dicas:');
            console.log('   - Verifique se o MySQL está rodando');
            console.log('   - Confirme se a porta está correta (padrão: 3306)');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('💡 Dicas:');
            console.log('   - Verifique o usuário e senha no arquivo .env');
            console.log('   - Confirme as permissões do usuário no MySQL');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('💡 Dicas:');
            console.log('   - O banco de dados não existe');
            console.log('   - Execute: mysql -u root -p < scripts/setup-mysql.sql');
        }

        process.exit(1);
    }
}

testMySQLConnection();
