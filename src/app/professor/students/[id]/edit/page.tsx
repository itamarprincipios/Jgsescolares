import { prisma } from "@/lib/prisma";
import StudentForm from "@/app/professor/students/new/form";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.schoolId) return null;

    const { id } = await params;

    const student = await prisma.student.findUnique({
        where: { id },
        include: {
            modalities: true,
            categories: true,
        },
    });

    if (!student || student.schoolId !== session.user.schoolId) {
        notFound();
    }

    const modalities = await prisma.modality.findMany({
        orderBy: { name: "asc" },
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Editar Aluno</h1>
                <p className="text-slate-400">Atualize os dados do aluno.</p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <StudentForm
                    modalities={modalities}
                    categories={categories}
                    initialData={student}
                />
            </div>
        </div>
    );
}
