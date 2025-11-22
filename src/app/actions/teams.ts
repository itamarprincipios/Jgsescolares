"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getEligibleStudents(modalityId: string, categoryId: string, gender: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.schoolId) return [];

    // Fetch category to get max age
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return [];

    // Calculate max birth date for age limit (approximate for now based on year)
    // Reference: 31/12/2025
    // If maxAge is 15, born in 2010 or later (2025 - 15 = 2010)
    const minBirthYear = 2025 - category.maxAge;
    const minBirthDate = new Date(`${minBirthYear}-01-01`); // Anyone born after this is <= maxAge

    // Filter:
    // 1. Same School
    // 2. Gender match (if team is Mixed, allow all? Or specific logic? Assuming Mixed allows all, Male allows Male, Female allows Female)
    // 3. Age match
    // 4. Modality match (Student must have this modality in their list)

    const genderFilter = gender === 'MIXED' ? {} : { gender: gender as "MALE" | "FEMALE" };

    return await prisma.student.findMany({
        where: {
            schoolId: session.user.schoolId,
            ...genderFilter,
            birthDate: {
                gte: minBirthDate,
            },
            modalities: {
                some: {
                    id: modalityId
                }
            }
        },
        orderBy: { name: 'asc' }
    });
}

export async function createTeam(data: {
    name: string;
    modalityId: string;
    categoryId: string;
    gender: string;
    studentIds: string[];
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PROFESSOR" || !session.user.schoolId) {
        return { error: "Não autorizado." };
    }

    if (!data.studentIds.length) {
        return { error: "Selecione pelo menos um aluno." };
    }

    try {
        await prisma.team.create({
            data: {
                name: data.name,
                modalityId: data.modalityId,
                categoryId: data.categoryId,
                gender: data.gender as "MALE" | "FEMALE" | "MIXED",
                schoolId: session.user.schoolId,
                students: {
                    connect: data.studentIds.map(id => ({ id }))
                },
                status: "PENDING"
            }
        });

        revalidatePath("/professor/teams");
        return { success: true };
    } catch (error) {
        console.error("Error creating team:", error);
        return { error: "Erro ao criar equipe." };
    }
}

export async function deleteTeam(teamId: string) {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Não autorizado." };

    try {
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team) return { error: "Equipe não encontrada." };

        // Allow ADMIN or the School PROFESSOR who owns the team
        if (session.user.role !== "ADMIN") {
            if (session.user.role !== "PROFESSOR" || team.schoolId !== session.user.schoolId) {
                return { error: "Não autorizado." };
            }
        }

        await prisma.team.delete({
            where: { id: teamId },
        });

        revalidatePath("/admin/teams");
        revalidatePath("/professor/teams");
        return { success: true };
    } catch (error) {
        console.error("Error deleting team:", error);
        return { error: "Erro ao excluir equipe." };
    }
}
