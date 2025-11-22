import { prisma } from "@/lib/prisma";
import { School, Dumbbell, Users, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
    const schoolsCount = await prisma.school.count();
    const modalitiesCount = await prisma.modality.count();
    const studentsCount = await prisma.student.count();
    const teamsCount = await prisma.team.count();

    return {
        schoolsCount,
        modalitiesCount,
        studentsCount,
        teamsCount,
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const cards = [
        {
            label: "Escolas Cadastradas",
            value: stats.schoolsCount,
            icon: School,
            color: "bg-blue-500",
        },
        {
            label: "Modalidades",
            value: stats.modalitiesCount,
            icon: Dumbbell,
            color: "bg-purple-500",
        },
        {
            label: "Alunos Inscritos",
            value: stats.studentsCount,
            icon: Users,
            color: "bg-green-500",
        },
        {
            label: "Equipes Formadas",
            value: stats.teamsCount,
            icon: Trophy,
            color: "bg-orange-500",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Visão geral do sistema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="glass p-6 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${card.color} bg-opacity-20`}>
                                    <Icon className={`w-6 h-6 ${card.color.replace("bg-", "text-")}`} />
                                </div>
                                <span className="text-3xl font-bold text-white">{card.value}</span>
                            </div>
                            <h3 className="text-slate-400 font-medium">{card.label}</h3>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity or Charts could go here */}
            <div className="glass p-8 rounded-xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">Atividade Recente</h2>
                <div className="text-slate-400 text-center py-8">
                    Nenhuma atividade recente para exibir.
                </div>
            </div>
        </div>
    );
}
