// Script para verificar se o usuário admin existe no banco de produção
// Execute localmente com a DATABASE_URL de produção

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['error', 'warn'],
});

async function checkAdminUser() {
    console.log('🔍 Verificando usuário admin no banco de produção...\n');

    try {
        // Verificar conexão
        await prisma.$connect();
        console.log('✅ Conectado ao banco de dados\n');

        // Buscar usuário admin
        const adminUser = await prisma.user.findUnique({
            where: { email: 'admin@jem.com' },
        });

        if (adminUser) {
            console.log('✅ Usuário admin encontrado:');
            console.log(`   ID: ${adminUser.id}`);
            console.log(`   Nome: ${adminUser.name}`);
            console.log(`   Email: ${adminUser.email}`);
            console.log(`   Role: ${adminUser.role}`);
            console.log(`   Ativo: ${adminUser.active ? 'Sim' : 'Não'}`);
            console.log(`   Hash da senha: ${adminUser.password.substring(0, 20)}...`);
            console.log('\n✅ O usuário existe! O problema pode ser:');
            console.log('   1. Senha incorreta (tente: admin000)');
            console.log('   2. NEXTAUTH_SECRET não configurado no Vercel');
            console.log('   3. NEXTAUTH_URL incorreta no Vercel');
        } else {
            console.log('❌ Usuário admin NÃO encontrado!');
            console.log('\n📝 Você precisa criar o usuário admin.');
            console.log('   Execute o script SQL no Supabase:');
            console.log('   scripts/create-admin-user.sql');
        }

        // Contar total de usuários
        const totalUsers = await prisma.user.count();
        console.log(`\n📊 Total de usuários no banco: ${totalUsers}`);

    } catch (error) {
        console.error('❌ Erro ao conectar com o banco:');
        console.error(error.message);

        if (error.code === 'P1001') {
            console.error('\n💡 Erro P1001: Não conseguiu conectar ao servidor.');
            console.error('   Verifique se a DATABASE_URL está correta.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

checkAdminUser();
