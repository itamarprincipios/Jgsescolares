import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { Search, Check, X } from "lucide-react";
import { redirect } from "next/navigation";
import StatusBadge from "@/components/status-badge";
import ApproveButton from "./approve-button";
import RejectButton from "./reject-button";

async function getRegistrations() {
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

export default async function RegistrationsPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") redirect("/login");

    const registrations = await getRegistrations();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Inscrições</h1>
                    <p className="text-slate-400">Gerencie as inscrições de todas as escolas</p>
                </div>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-white/5">
                <div className="p-4 border-b border-white/10">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar inscrição..."
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
                                <th className="p-4 font-medium text-center">Alunos</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            {registrations.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        Nenhuma inscrição encontrada.
                                    </td>
                                </tr>
                            ) : (
                                registrations.map((registration) => (
                                    <tr key={registration.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{registration.school.name}</td>
                                        <td className="p-4 text-slate-400">{registration.name || "Sem nome"}</td>
                                        <td className="p-4 text-slate-400">{registration.modality.name}</td>
                                        <td className="p-4 text-slate-400">{registration.category.name}</td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                                                {registration._count.students}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={registration.status} />
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {registration.status === "PENDING" && (
                                                    <>
                                                        <ApproveButton registrationId={registration.id} />
                                                        <RejectButton registrationId={registration.id} />
                                                    </>
                                                )}
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
