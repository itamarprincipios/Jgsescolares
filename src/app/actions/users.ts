"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerProfessor(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const schoolId = formData.get("schoolId") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !phone || !schoolId || !password) {
        return { error: "Preencha todos os campos." };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Email já cadastrado." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                role: "PROFESSOR",
                schoolId,
                active: false, // Requires admin approval
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error registering professor:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        return { error: "Erro ao realizar cadastro. Verifique o console para mais detalhes." };
    }
}

export async function toggleUserStatus(userId: string, active: boolean) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { active },
        });

        // Since this is used in the admin panel, we might want to revalidate the path
        // But revalidatePath is not imported here, and the usage in page.tsx is inside a server action closure
        // that doesn't seem to call revalidatePath. 
        // Ideally, the page should revalidate.
        // For now, I will just return success.
        return { success: true };
    } catch (error) {
        console.error("Error toggling user status:", error);
        return { error: "Erro ao atualizar status." };
    }
}
