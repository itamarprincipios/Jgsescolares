"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const EnrollmentSchema = z.object({
    teamName: z.string().min(3, "Nome da equipe deve ter pelo menos 3 caracteres"),
    modalityId: z.string().min(1, "Selecione uma modalidade"),
    categoryId: z.string().min(1, "Selecione uma categoria"),
    studentIds: z.array(z.string()).min(1, "Selecione pelo menos um aluno"),
});

export async function createEnrollment(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Não autorizado" };

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { schoolId: true },
    });

    if (!user?.schoolId) return { error: "Escola não encontrada" };

    const studentIds = formData.getAll("studentIds") as string[];

    const rawData = {
        teamName: formData.get("teamName"),
        modalityId: formData.get("modalityId"),
        categoryId: formData.get("categoryId"),
        studentIds,
    };

    const result = EnrollmentSchema.safeParse(rawData);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    try {
        await prisma.team.create({
            data: {
                name: result.data.teamName,
                schoolId: user.schoolId,
                modalityId: result.data.modalityId,
                categoryId: result.data.categoryId,
                students: {
                    connect: result.data.studentIds.map(id => ({ id })),
                },
                status: "PENDING",
            },
        });
    } catch (error) {
        return { error: "Erro ao criar inscrição." };
    }

    revalidatePath("/professor/enrollments");
    redirect("/professor/enrollments");
}

export async function cancelEnrollment(id: string) {
    try {
        await prisma.team.delete({
            where: { id },
        });
        revalidatePath("/professor/enrollments");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao cancelar inscrição." };
    }
}
