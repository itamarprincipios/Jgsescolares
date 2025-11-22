"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function createStudent(formData: FormData) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "PROFESSOR" || !session.user.schoolId) {
        return { error: "Não autorizado ou escola não vinculada." };
    }

    const name = formData.get("name") as string;
    const birthDate = formData.get("birthDate") as string;
    const rg = formData.get("rg") as string;
    const guardianPhone = formData.get("guardianPhone") as string;
    const gender = formData.get("gender") as "MALE" | "FEMALE";
    const modalityId = formData.get("modalityId") as string;
    const categoryId = formData.get("categoryId") as string;

    const photoFile = formData.get("photo") as File;
    const documentFile = formData.get("documentPhoto") as File;

    if (!name || !birthDate || !guardianPhone || !gender || !modalityId || !categoryId) {
        return { error: "Preencha todos os campos obrigatórios." };
    }

    // Validate Age
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
        return { error: "Categoria inválida." };
    }

    const birth = new Date(birthDate);
    const referenceDate = new Date("2025-12-31");
    let age = referenceDate.getFullYear() - birth.getFullYear();
    const m = referenceDate.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && referenceDate.getDate() < birth.getDate())) {
        age--;
    }

    if (age > category.maxAge) {
        return { error: `O aluno tem ${age} anos e não pode participar da categoria ${category.name} (Máx: ${category.maxAge} anos).` };
    }

    if (!photoFile || photoFile.size === 0) {
        return { error: "A foto do aluno é obrigatória." };
    }

    if (!documentFile || documentFile.size === 0) {
        return { error: "A foto do documento é obrigatória." };
    }

    // Handle File Uploads
    let photoPath = null;
    let documentPath = null;

    try {
        if (photoFile && photoFile.size > 0) {
            const bytes = await photoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${uuidv4()}-${photoFile.name}`;
            const path = join(process.cwd(), "public/uploads", fileName);
            await writeFile(path, buffer);
            photoPath = `/uploads/${fileName}`;
        }

        if (documentFile && documentFile.size > 0) {
            const bytes = await documentFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${uuidv4()}-${documentFile.name}`;
            const path = join(process.cwd(), "public/uploads", fileName);
            await writeFile(path, buffer);
            documentPath = `/uploads/${fileName}`;
        }
    } catch (error) {
        console.error("Error uploading files:", error);
        return { error: "Erro ao salvar arquivos." };
    }

    try {
        await prisma.student.create({
            data: {
                name,
                birthDate: new Date(birthDate),
                rg,
                guardianPhone,
                gender,
                photo: photoPath,
                documentPhoto: documentPath,
                schoolId: session.user.schoolId,
                modalities: {
                    connect: { id: modalityId },
                },
                categories: {
                    connect: { id: categoryId },
                },
            },
        });

        revalidatePath("/professor");
        return { success: true };
    } catch (error) {
        console.error("Error creating student:", error);
        return { error: "Erro ao cadastrar aluno." };
    }
}

export async function deleteStudent(studentId: string) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "PROFESSOR" || !session.user.schoolId) {
        return { error: "Não autorizado." };
    }

    try {
        // Verify ownership
        const student = await prisma.student.findUnique({
            where: { id: studentId },
        });

        if (!student || student.schoolId !== session.user.schoolId) {
            return { error: "Aluno não encontrado ou não pertence à sua escola." };
        }

        await prisma.student.delete({
            where: { id: studentId },
        });

        revalidatePath("/professor/students");
        return { success: true };
    } catch (error) {
        console.error("Error deleting student:", error);
        return { error: "Erro ao excluir aluno." };
    }
}

export async function updateStudent(studentId: string, formData: FormData) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "PROFESSOR" || !session.user.schoolId) {
        return { error: "Não autorizado." };
    }

    const name = formData.get("name") as string;
    const birthDate = formData.get("birthDate") as string;
    const rg = formData.get("rg") as string;
    const guardianPhone = formData.get("guardianPhone") as string;
    const gender = formData.get("gender") as "MALE" | "FEMALE";
    const modalityId = formData.get("modalityId") as string;
    const categoryId = formData.get("categoryId") as string;

    const photoFile = formData.get("photo") as File;
    const documentFile = formData.get("documentPhoto") as File;

    if (!name || !birthDate || !guardianPhone || !gender || !modalityId || !categoryId) {
        return { error: "Preencha todos os campos obrigatórios." };
    }

    // Verify ownership
    const existingStudent = await prisma.student.findUnique({
        where: { id: studentId },
    });

    if (!existingStudent || existingStudent.schoolId !== session.user.schoolId) {
        return { error: "Aluno não encontrado." };
    }

    // Validate Age
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
        return { error: "Categoria inválida." };
    }

    const birth = new Date(birthDate);
    const referenceDate = new Date("2025-12-31");
    let age = referenceDate.getFullYear() - birth.getFullYear();
    const m = referenceDate.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && referenceDate.getDate() < birth.getDate())) {
        age--;
    }

    if (age > category.maxAge) {
        return { error: `O aluno tem ${age} anos e não pode participar da categoria ${category.name} (Máx: ${category.maxAge} anos).` };
    }

    // Handle File Uploads (Only if new files are provided)
    let photoPath = existingStudent.photo;
    let documentPath = existingStudent.documentPhoto;

    try {
        if (photoFile && photoFile.size > 0) {
            const bytes = await photoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${uuidv4()}-${photoFile.name}`;
            const path = join(process.cwd(), "public/uploads", fileName);
            await writeFile(path, buffer);
            photoPath = `/uploads/${fileName}`;
        }

        if (documentFile && documentFile.size > 0) {
            const bytes = await documentFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${uuidv4()}-${documentFile.name}`;
            const path = join(process.cwd(), "public/uploads", fileName);
            await writeFile(path, buffer);
            documentPath = `/uploads/${fileName}`;
        }
    } catch (error) {
        console.error("Error uploading files:", error);
        return { error: "Erro ao salvar arquivos." };
    }

    try {
        await prisma.student.update({
            where: { id: studentId },
            data: {
                name,
                birthDate: new Date(birthDate),
                rg,
                guardianPhone,
                gender,
                photo: photoPath,
                documentPhoto: documentPath,
                modalities: {
                    set: [], // Clear existing
                    connect: { id: modalityId },
                },
                categories: {
                    set: [], // Clear existing
                    connect: { id: categoryId },
                },
            },
        });

        revalidatePath("/professor/students");
        return { success: true };
    } catch (error) {
        console.error("Error updating student:", error);
        return { error: "Erro ao atualizar aluno." };
    }
}
