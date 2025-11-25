import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed de dados de teste...\n");

    // Limpar dados existentes (exceto usuários)
    console.log("🗑️  Limpando dados antigos...");
    await prisma.team.deleteMany();
    await prisma.student.deleteMany();
    await prisma.category.deleteMany();
    await prisma.modality.deleteMany();
    await prisma.school.deleteMany();

    // Criar Escolas
    console.log("🏫 Criando escolas...");
    const schools = await Promise.all([
        prisma.school.create({
            data: {
                name: "Escola Municipal João Silva",
                city: "São Paulo",
                director: "Maria Santos",
                phone: "(11) 98765-4321",
            },
        }),
        prisma.school.create({
            data: {
                name: "Colégio Estadual Pedro Álvares",
                city: "Campinas",
                director: "José Oliveira",
                phone: "(19) 97654-3210",
            },
        }),
        prisma.school.create({
            data: {
                name: "Instituto Educacional Santa Clara",
                city: "Santos",
                director: "Ana Paula Costa",
                phone: "(13) 96543-2109",
            },
        }),
    ]);
    console.log(`✅ ${schools.length} escolas criadas\n`);

    // Criar Modalidades
    console.log("⚽ Criando modalidades...");
    const modalities = await Promise.all([
        prisma.modality.create({
            data: {
                name: "Futebol",
                allowsMixed: false,
            },
        }),
        prisma.modality.create({
            data: {
                name: "Queimada",
                allowsMixed: true,
            },
        }),
        prisma.modality.create({
            data: {
                name: "Cabo de Guerra",
                allowsMixed: true,
            },
        }),
        prisma.modality.create({
            data: {
                name: "Atletismo",
                allowsMixed: false,
            },
        }),
    ]);
    console.log(`✅ ${modalities.length} modalidades criadas\n`);

    // Criar Categorias
    console.log("🎯 Criando categorias...");
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: "Fraldinha",
                maxAge: 8,
            },
        }),
        prisma.category.create({
            data: {
                name: "Pré-Mirim",
                maxAge: 10,
            },
        }),
        prisma.category.create({
            data: {
                name: "Mirim",
                maxAge: 12,
            },
        }),
    ]);
    console.log(`✅ ${categories.length} categorias criadas\n`);

    // Criar Estudantes
    console.log("👨‍🎓 Criando estudantes...");

    const studentNames = [
        { name: "Lucas Ferreira", gender: "MALE", age: 8 },
        { name: "Ana Clara Santos", gender: "FEMALE", age: 9 },
        { name: "Pedro Henrique Costa", gender: "MALE", age: 10 },
        { name: "Mariana Oliveira", gender: "FEMALE", age: 11 },
        { name: "Gabriel Silva", gender: "MALE", age: 12 },
        { name: "Beatriz Souza", gender: "FEMALE", age: 8 },
        { name: "Rafael Almeida", gender: "MALE", age: 9 },
        { name: "Julia Rodrigues", gender: "FEMALE", age: 10 },
        { name: "Matheus Lima", gender: "MALE", age: 11 },
        { name: "Isabella Martins", gender: "FEMALE", age: 12 },
    ];

    const students = [];
    for (let i = 0; i < studentNames.length; i++) {
        const student = studentNames[i];
        const school = schools[i % schools.length]; // Distribuir entre as escolas

        // Calcular data de nascimento baseada na idade
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - student.age);

        const createdStudent = await prisma.student.create({
            data: {
                name: student.name,
                birthDate: birthDate,
                gender: student.gender as "MALE" | "FEMALE",
                rg: `${Math.floor(Math.random() * 90000000) + 10000000}`,
                guardianPhone: `(11) 9${Math.floor(Math.random() * 90000000) + 10000000}`,
                schoolId: school.id,
            },
        });
        students.push(createdStudent);
    }
    console.log(`✅ ${students.length} estudantes criados\n`);

    console.log("🎉 Seed de dados de teste concluído com sucesso!\n");
    console.log("📊 Resumo:");
    console.log(`   - ${schools.length} Escolas`);
    console.log(`   - ${modalities.length} Modalidades (Futebol, Queimada, Cabo de Guerra, Atletismo)`);
    console.log(`   - ${categories.length} Categorias (Fraldinha 8 anos, Pré-Mirim 10 anos, Mirim 12 anos)`);
    console.log(`   - ${students.length} Estudantes`);
    console.log("\n✨ Modalidades mistas: Queimada e Cabo de Guerra");
}

main()
    .catch((e) => {
        console.error("❌ Erro ao executar seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
