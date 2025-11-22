"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ModalitySchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    allowsMixed: z.boolean(),
});

export async function createModality(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        allowsMixed: formData.get("allowsMixed") === "true",
    };

    const result = ModalitySchema.safeParse(rawData);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    try {
        await prisma.modality.create({
            data: {
                name: result.data.name,
                allowsMixed: result.data.allowsMixed,
            },
        });
    } catch (error) {
        return { error: "Erro ao criar modalidade." };
    }

    revalidatePath("/admin/modalities");
    redirect("/admin/modalities");
}

export async function updateModality(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const rawData = {
        name: formData.get("name"),
        allowsMixed: formData.get("allowsMixed") === "true",
    };

    const result = ModalitySchema.safeParse(rawData);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    try {
        await prisma.modality.update({
            where: { id },
            data: {
                name: result.data.name,
                allowsMixed: result.data.allowsMixed,
            },
        });
    } catch (error) {
        return { error: "Erro ao atualizar modalidade." };
    }

    revalidatePath("/admin/modalities");
    redirect("/admin/modalities");
}

export async function deleteModality(id: string) {
    try {
        await prisma.modality.delete({
            where: { id },
        });
        revalidatePath("/admin/modalities");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao excluir modalidade. Verifique se não há dados vinculados." };
    }
}
