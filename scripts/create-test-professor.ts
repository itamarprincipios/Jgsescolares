import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createTestData() {
    try {
        // 1. Criar ou buscar escola
        let school = await prisma.school.findFirst({
            where: { name: "Escola Teste" },
        });

        if (!school) {
            school = await prisma.school.create({
                data: {
                    name: "Escola Teste",
                    city: "Cidade Teste",
                    director: "Diretor Teste",
                    phone: "(11) 98765-4321",
                },
            });
            console.log("✅ Escola criada:", school.name);
        } else {
            console.log("✅ Escola já existe:", school.name);
        }

        // 2. Verificar se já existe um professor de teste
        let professor = await prisma.user.findUnique({
            where: { email: "professor@teste.com" },
        });

        if (professor) {
            console.log("\n✅ Usuário professor de teste já existe!");

            // Ativar se estiver pendente
            if (!professor.active) {
                professor = await prisma.user.update({
                    where: { id: professor.id },
                    data: { active: true, schoolId: school.id },
                });
                console.log("✅ Conta ativada e vinculada à escola!");
            }
        } else {
            // Criar hash da senha
            const hashedPassword = await bcrypt.hash("professor123", 10);

            // Criar professor de teste
            professor = await prisma.user.create({
                data: {
                    name: "Professor Teste",
                    email: "professor@teste.com",
                    password: hashedPassword,
                    role: "PROFESSOR",
                    active: true,
                    schoolId: school.id,
                },
            });
            console.log("✅ Professor de teste criado com sucesso!");
        }

        // 3. Exibir informações de login
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📋 CREDENCIAIS DE TESTE - PROFESSOR");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📧 Email:  professor@teste.com");
        console.log("🔑 Senha:  professor123");
        console.log("🏫 Escola:", school.name);
        console.log("✅ Status: ATIVO");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n📋 CREDENCIAIS DE TESTE - ADMIN");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📧 Email:  admin@jem.com");
        console.log("🔑 Senha:  admin123");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        // 4. Criar algumas modalidades e categorias se não existirem
        const modalityCount = await prisma.modality.count();
        if (modalityCount === 0) {
            await prisma.modality.createMany({
                data: [
                    { name: "Futsal", allowsMixed: false },
                    { name: "Vôlei", allowsMixed: false },
                    { name: "Queimada", allowsMixed: true },
                ],
            });
            console.log("✅ Modalidades de exemplo criadas!");
        }

        const categoryCount = await prisma.category.count();
        if (categoryCount === 0) {
            await prisma.category.createMany({
                data: [
                    { name: "Sub-12", maxAge: 12 },
                    { name: "Sub-15", maxAge: 15 },
                    { name: "Sub-18", maxAge: 18 },
                ],
            });
            console.log("✅ Categorias de exemplo criadas!");
        }

        console.log("\n🎉 Tudo pronto para testes!\n");

    } catch (error) {
        console.error("❌ Erro:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestData();
