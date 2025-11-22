"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CategorySchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    maxAge: z.number().min(0, "Idade máxima inválida"),
});

export async function createCategory(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        maxAge: parseInt(formData.get("maxAge") as string),
    };

    const result = CategorySchema.safeParse(rawData);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    try {
        await prisma.category.create({
            data: {
                name: result.data.name,
                maxAge: result.data.maxAge,
            },
        });
    } catch (error) {
        return { error: "Erro ao criar categoria." };
    }

    revalidatePath("/admin/categories");
    redirect("/admin/categories");
}

export async function updateCategory(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const rawData = {
        name: formData.get("name"),
        maxAge: parseInt(formData.get("maxAge") as string),
    };

    const result = CategorySchema.safeParse(rawData);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    try {
        await prisma.category.update({
            where: { id },
            data: {
                name: result.data.name,
                maxAge: result.data.maxAge,
            },
        });
    } catch (error) {
        return { error: "Erro ao atualizar categoria." };
    }

    revalidatePath("/admin/categories");
    redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id },
        });
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao excluir categoria. Verifique se não há dados vinculados." };
    }
}
