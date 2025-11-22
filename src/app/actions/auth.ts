"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const RegisterSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    schoolId: z.string().min(1, "Selecione uma escola"),
});

export async function registerUser(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        schoolId: formData.get("schoolId"),
    };

    const result = RegisterSchema.safeParse(rawData);

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: result.data.email },
    });

    if (existingUser) {
        return { error: "Email já cadastrado." };
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    try {
        await prisma.user.create({
            data: {
                name: result.data.name,
                email: result.data.email,
                password: hashedPassword,
                role: "PROFESSOR",
                active: false, // Requires admin approval
                schoolId: result.data.schoolId,
            },
        });
    } catch (error) {
        return { error: "Erro ao criar conta." };
    }

    redirect("/login?registered=true");
}
