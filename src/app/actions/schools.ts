"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const SchoolSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    city: z.string().optional(),
    director: z.string().optional(),
    phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").optional(),
});

export async function createSchool(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        city: formData.get("city"),
        director: formData.get("director"),
        phone: formData.get("phone"),
    };

    const result = SchoolSchema.safeParse(rawData);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    try {
        await prisma.school.create({
            data: {
                name: result.data.name,
                city: result.data.city || null,
                director: result.data.director || null,
                phone: result.data.phone || null,
            },
        });
    } catch (error) {
        return { error: "Erro ao criar escola." };
    }

    revalidatePath("/admin/schools");
    redirect("/admin/schools");
}

export async function updateSchool(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const rawData = {
        name: formData.get("name"),
        city: formData.get("city"),
        director: formData.get("director"),
        phone: formData.get("phone"),
    };

    const result = SchoolSchema.safeParse(rawData);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    try {
        await prisma.school.update({
            where: { id },
            data: {
                name: result.data.name,
                city: result.data.city || null,
                director: result.data.director || null,
                phone: result.data.phone || null,
            },
        });
    } catch (error) {
        return { error: "Erro ao atualizar escola." };
    }

    revalidatePath("/admin/schools");
    redirect("/admin/schools");
}

export async function deleteSchool(id: string) {
    try {
        await prisma.school.delete({
            where: { id },
        });
        revalidatePath("/admin/schools");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao excluir escola. Verifique se não há dados vinculados." };
    }
}
