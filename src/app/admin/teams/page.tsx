import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Search, Edit, Filter, Eye } from "lucide-react";
import { redirect } from "next/navigation";
import DeleteTeamButton from "./delete-button";

export const dynamic = "force-dynamic";

async function getTeams() {
    return await prisma.team.findMany({
        include: {
            school: true,
            modality: true,
            category: true,
            _count: {
                select: {
                    students: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

async function getFilters() {
    const [schools, modalities, categories] = await Promise.all([
        prisma.school.findMany({ orderBy: { name: "asc" } }),
        prisma.modality.findMany({ orderBy: { name: "asc" } }),
        prisma.category.findMany({ orderBy: { maxAge: "asc" } }),
    ]);
    return { schools, modalities, categories };
}

export default async function TeamsPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") redirect("/login");

    const teams = await getTeams();
    const filters = await getFilters();

    const genderLabels = {
        MALE: "Masculino",
        FEMALE: "Feminino",
        MIXED: "Misto",
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Equipes</h1>
                    <p className="text-slate-400">Visualize e gerencie todas as equipes</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="glass p-6 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Filtros</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">Escola</label>
                        <select className="input-field">
                            <option value="">Todas</option>
                            {filters.schools.map((school) => (
                                <option key={school.id} value={school.id}>
                                    {school.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">Modalidade</label>
                        <select className="input-field">
                            <option value="">Todas</option>
                            {filters.modalities.map((modality) => (
                                <option key={modality.id} value={modality.id}>
                                    {modality.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">Categoria</label>
                        <select className="input-field">
                            <option value="">Todas</option>
                            {filters.categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">Gênero</label>
                        <select className="input-field">
                            <option value="">Todos</option>
                            <option value="MALE">Masculino</option>
                            <option value="FEMALE">Feminino</option>
                            <option value="MIXED">Misto</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-white/5">
                <div className="p-4 border-b border-white/10">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar equipe..."
                            className="input-field pl-10 py-2"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-300">
                            <tr>
                                <th className="p-4 font-medium">Escola</th>
                                <th className="p-4 font-medium">Equipe</th>
                                <th className="p-4 font-medium">Modalidade</th>
                                <th className="p-4 font-medium">Categoria</th>
                                <th className="p-4 font-medium">Gênero</th>
                                <th className="p-4 font-medium text-center">Atletas</th>
                                <th className="p-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            {teams.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        Nenhuma equipe encontrada.
                                    </td>
                                </tr>
                            ) : (
                                teams.map((team) => (
                                    <tr key={team.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{team.school.name}</td>
                                        <td className="p-4 text-slate-400">{team.name || "Sem nome"}</td>
                                        <td className="p-4 text-slate-400">{team.modality.name}</td>
                                        <td className="p-4 text-slate-400">{team.category.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${team.gender === "MALE" ? "bg-blue-500/20 text-blue-300" :
                                                team.gender === "FEMALE" ? "bg-pink-500/20 text-pink-300" :
                                                    "bg-purple-500/20 text-purple-300"
                                                }`}>
                                                {team.gender ? genderLabels[team.gender] : "-"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                                                {team._count.students}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/teams/${team.id}`}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                                                    title="Ver Detalhes"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/teams/${team.id}/edit`}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <DeleteTeamButton teamId={team.id} teamName={team.name || "Equipe"} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
