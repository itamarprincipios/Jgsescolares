import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateSchool() {
    try {
        const school = await prisma.school.findFirst({
            where: { name: "Escola Teste" },
        });

        if (school) {
            await prisma.school.update({
                where: { id: school.id },
                data: {
                    director: "João da Silva",
                    phone: "(11) 98765-4321",
                },
            });
            console.log("✅ Escola atualizada com diretor e telefone!");
        }

        // Atualizar modalidades
        const modalidades = await prisma.modality.findMany();
        for (const mod of modalidades) {
            await prisma.modality.update({
                where: { id: mod.id },
                data: {
                    allowsMixed: mod.name === "Queimada" ? true : false,
                },
            });
        }
        console.log("✅ Modalidades atualizadas!");

        console.log("\n🎉 Dados atualizados com sucesso!\n");
    } catch (error) {
        console.error("❌ Erro:", error);
    } finally {
        await prisma.$disconnect();
    }
}

updateSchool();
