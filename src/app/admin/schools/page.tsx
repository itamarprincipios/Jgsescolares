import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Search, Edit } from "lucide-react";
import { redirect } from "next/navigation";
import DeleteSchoolButton from "./delete-button";

export const dynamic = "force-dynamic";

async function getSchools() {
    return await prisma.school.findMany({
        include: {
            _count: {
                select: {
                    students: true,
                    teams: true,
                },
            },
        },
        orderBy: { name: "asc" },
    });
}

export default async function SchoolsPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") redirect("/login");

    const schools = await getSchools();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Escolas</h1>
                    <p className="text-slate-400">Gerencie as instituições de ensino</p>
                </div>
                <Link
                    href="/admin/schools/new"
                    className="btn-primary inline-flex items-center gap-2 w-auto"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nova Escola
                </Link>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-white/5">
                <div className="p-4 border-b border-white/10">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar escola..."
                            className="input-field pl-10 py-2"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-300">
                            <tr>
                                <th className="p-4 font-medium">Nome</th>
                                <th className="p-4 font-medium">Cidade</th>
                                <th className="p-4 font-medium">Diretor</th>
                                <th className="p-4 font-medium">Telefone</th>
                                <th className="p-4 font-medium text-center">Alunos</th>
                                <th className="p-4 font-medium text-center">Equipes</th>
                                <th className="p-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            {schools.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        Nenhuma escola cadastrada.
                                    </td>
                                </tr>
                            ) : (
                                schools.map((school) => (
                                    <tr key={school.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{school.name}</td>
                                        <td className="p-4 text-slate-400">{school.city || "-"}</td>
                                        <td className="p-4 text-slate-400">{school.director || "-"}</td>
                                        <td className="p-4 text-slate-400">{school.phone || "-"}</td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                                                {school._count.students}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                                                {school._count.teams}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/schools/${school.id}/edit`}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <DeleteSchoolButton schoolId={school.id} schoolName={school.name} />
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
