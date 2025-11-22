import { prisma } from "@/lib/prisma";
import { toggleUserStatus } from "@/app/actions/users";
import { Search, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProfessors() {
    return await prisma.user.findMany({
        where: { role: "PROFESSOR" },
        include: { school: true },
        orderBy: { name: "asc" },
    });
}

export default async function ProfessorsPage() {
    const professors = await getProfessors();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Professores</h1>
                <p className="text-slate-400">Gerencie os acessos dos professores</p>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-white/5">
                <div className="p-4 border-b border-white/10">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar professor..."
                            className="input-field pl-10 py-2"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-300">
                            <tr>
                                <th className="p-4 font-medium">Nome</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Escola</th>
                                <th className="p-4 font-medium text-center">Status</th>
                                <th className="p-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            {professors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        Nenhum professor cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                professors.map((professor) => (
                                    <tr key={professor.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{professor.name}</td>
                                        <td className="p-4 text-slate-400">{professor.email}</td>
                                        <td className="p-4">{professor.school?.name || "-"}</td>
                                        <td className="p-4 text-center">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${professor.active
                                                    ? "bg-green-500/20 text-green-300"
                                                    : "bg-yellow-500/20 text-yellow-300"
                                                    }`}
                                            >
                                                {professor.active ? "Ativo" : "Pendente"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <form action={async () => {
                                                "use server";
                                                await toggleUserStatus(professor.id, !professor.active);
                                                // We need to revalidate the page to see the changes
                                                const { revalidatePath } = await import("next/cache");
                                                revalidatePath("/admin/professors");
                                            }}>
                                                <button
                                                    className={`p-2 rounded-lg transition-colors ${professor.active
                                                        ? "hover:bg-red-500/20 text-red-400"
                                                        : "hover:bg-green-500/20 text-green-400"
                                                        }`}
                                                    title={professor.active ? "Desativar" : "Ativar"}
                                                >
                                                    {professor.active ? (
                                                        <XCircle className="w-5 h-5" />
                                                    ) : (
                                                        <CheckCircle className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
