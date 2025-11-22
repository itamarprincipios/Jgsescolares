import { prisma } from "@/lib/prisma";
import StudentForm from "./form";

export default async function NewStudentPage() {
    const modalities = await prisma.modality.findMany({
        orderBy: { name: "asc" },
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Cadastrar Aluno</h1>
                <p className="text-slate-400">Preencha os dados do aluno para cadastro.</p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <StudentForm modalities={modalities} categories={categories} />
            </div>
        </div>
    );
}
