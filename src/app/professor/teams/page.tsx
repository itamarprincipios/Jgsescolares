import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Plus, Users, Edit, Trash2 } from "lucide-react";

export default async function TeamsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.schoolId) return null;

    const teams = await prisma.team.findMany({
        where: {
            schoolId: session.user.schoolId,
        },
        include: {
            modality: true,
            category: true,
            _count: {
                select: { students: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Equipes</h1>
                    <p className="text-slate-400">Gerencie as equipes da sua escola.</p>
                </div>
                <Link
                    href="/professor/teams/create"
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nova Equipe
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500/50 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{team.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                                {team.modality.name}
                            </span>
                            <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                                {team.category.name}
                            </span>
                            <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                                {team.gender}
                            </span>
                        </div>

                        <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-sm text-slate-400">
                            <span>{team._count.students} alunos</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${team.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                    team.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {team.status === 'PENDING' ? 'Pendente' :
                                    team.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                            </span>
                        </div>
                    </div>
                ))}

                {teams.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        Nenhuma equipe criada ainda.
                    </div>
                )}
            </div>
        </div>
    );
}
