// Script para testar conexão com o Supabase
// Execute com: node scripts/test-database-connection.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
    console.log('🔍 Testando conexão com o banco de dados Supabase...\n');

    try {
        // Teste 1: Verificar se consegue conectar
        console.log('1️⃣ Verificando conexão...');
        await prisma.$connect();
        console.log('✅ Conexão estabelecida com sucesso!\n');

        // Teste 2: Executar uma query simples
        console.log('2️⃣ Testando query simples...');
        const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
        console.log('✅ Query executada com sucesso!');
        console.log(`   Horário do servidor: ${result[0].current_time}\n`);

        // Teste 3: Verificar tabelas
        console.log('3️⃣ Verificando tabelas existentes...');
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
        console.log(`✅ Encontradas ${tables.length} tabelas:`);
        tables.forEach(t => console.log(`   - ${t.table_name}`));
        console.log('');

        // Teste 4: Contar registros nas tabelas principais
        console.log('4️⃣ Verificando dados nas tabelas...');

        const schoolCount = await prisma.school.count();
        console.log(`   📚 Escolas: ${schoolCount}`);

        const userCount = await prisma.user.count();
        console.log(`   👤 Usuários: ${userCount}`);

        const studentCount = await prisma.student.count();
        console.log(`   🎓 Alunos: ${studentCount}`);

        const modalityCount = await prisma.modality.count();
        console.log(`   🏃 Modalidades: ${modalityCount}`);

        const categoryCount = await prisma.category.count();
        console.log(`   📋 Categorias: ${categoryCount}`);

        const teamCount = await prisma.team.count();
        console.log(`   👥 Equipes: ${teamCount}`);
        console.log('');

        // Teste 5: Verificar se existe usuário admin
        console.log('5️⃣ Verificando usuário admin...');
        const adminUser = await prisma.user.findUnique({
            where: { email: 'admin@jem.com' },
            select: { id: true, name: true, email: true, role: true, active: true }
        });

        if (adminUser) {
            console.log('✅ Usuário admin encontrado:');
            console.log(`   Nome: ${adminUser.name}`);
            console.log(`   Email: ${adminUser.email}`);
            console.log(`   Role: ${adminUser.role}`);
            console.log(`   Ativo: ${adminUser.active ? 'Sim' : 'Não'}`);
        } else {
            console.log('⚠️  Usuário admin NÃO encontrado!');
            console.log('   Execute o script create-admin-user.sql no Supabase');
        }
        console.log('');

        console.log('✅ TODOS OS TESTES PASSARAM! 🎉');
        console.log('   Sua conexão com o Supabase está funcionando perfeitamente!\n');

    } catch (error) {
        console.error('❌ ERRO ao conectar com o banco de dados:\n');
        console.error('Detalhes do erro:');
        console.error(error.message);
        console.error('');

        if (error.code === 'P1001') {
            console.error('💡 Dica: Erro P1001 significa que não conseguiu conectar ao servidor.');
            console.error('   Verifique se:');
            console.error('   1. A DATABASE_URL está correta no arquivo .env');
            console.error('   2. Está usando a URL do connection pooler (porta 6543)');
            console.error('   3. A senha está correta');
            console.error('   4. O banco de dados Supabase está ativo');
        } else if (error.code === 'P1003') {
            console.error('💡 Dica: Erro P1003 significa que o banco de dados não existe.');
            console.error('   Verifique se o nome do banco está correto na DATABASE_URL');
        } else if (error.code === 'P1017') {
            console.error('💡 Dica: Erro P1017 significa timeout na conexão.');
            console.error('   O servidor pode estar sobrecarregado ou a rede está lenta.');
        }

        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Executar teste
testConnection()
    .catch((error) => {
        console.error('Erro fatal:', error);
        process.exit(1);
    });
