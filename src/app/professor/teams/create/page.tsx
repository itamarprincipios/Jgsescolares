import { prisma } from "@/lib/prisma";
import TeamForm from "./form";

export default async function CreateTeamPage() {
    const modalities = await prisma.modality.findMany({
        orderBy: { name: "asc" },
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Nova Equipe</h1>
                <p className="text-slate-400">Crie uma nova equipe e selecione os alunos.</p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <TeamForm modalities={modalities} categories={categories} />
            </div>
        </div>
    );
}
