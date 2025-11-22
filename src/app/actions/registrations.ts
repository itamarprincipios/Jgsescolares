"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveRegistration(id: string) {
    try {
        await prisma.team.update({
            where: { id },
            data: { status: "APPROVED" },
        });
        revalidatePath("/admin/registrations");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao aprovar inscrição." };
    }
}

export async function rejectRegistration(id: string) {
    try {
        await prisma.team.update({
            where: { id },
            data: { status: "REJECTED" },
        });
        revalidatePath("/admin/registrations");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao reprovar inscrição." };
    }
}
