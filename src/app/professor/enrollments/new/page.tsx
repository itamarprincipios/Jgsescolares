import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NewEnrollmentForm from "./form";

export default async function NewEnrollmentPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { schoolId: true, active: true },
    });

    if (!user?.active || !user?.schoolId) return null;

    const [modalities, categories, students] = await Promise.all([
        prisma.modality.findMany({ orderBy: { name: "asc" } }),
        prisma.category.findMany({ orderBy: { maxAge: "asc" } }),
        prisma.student.findMany({
            where: { schoolId: user.schoolId },
            orderBy: { name: "asc" },
        }),
    ]);

    return <NewEnrollmentForm modalities={modalities} categories={categories} students={students} />;
}
