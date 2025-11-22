import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Users, Trophy, AlertCircle } from "lucide-react";

async function getData(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            school: {
                include: {
                    _count: {
                        select: { students: true, teams: true },
                    },
                },
            },
        },
    });
    return user;
}

export default async function ProfessorDashboard() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await getData(session.user.id);

    if (!user?.active) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
                <div className="bg-yellow-500/20 p-4 rounded-full mb-4">
                    <AlertCircle className="w-12 h-12 text-yellow-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Conta em Análise</h1>
                <p className="text-slate-400 max-w-md">
                    Sua conta foi criada com sucesso e está aguardando aprovação do administrador.
                    Você receberá acesso assim que for ativada.
                </p>
            </div>
        );
    }

    if (!user.school) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold text-white">Nenhuma escola vinculada</h1>
                <p className="text-slate-400">Entre em contato com o administrador.</p>
            </div>
        );
    }

    const stats = [
        {
            label: "Meus Alunos",
            value: user.school._count.students,
            icon: Users,
            color: "bg-blue-500",
        },
        {
            label: "Equipes Inscritas",
            value: user.school._count.teams,
            icon: Trophy,
            color: "bg-purple-500",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Olá, {user.name.split(" ")[0]}
                </h1>
                <p className="text-slate-400">
                    Painel da {user.school.name}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((card) => {
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
        </div>
    );
}
