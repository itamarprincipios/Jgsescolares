import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { redirect } from "next/navigation";
import StatusBadge from "@/components/status-badge";

async function getEnrollments(schoolId: string) {
    return await prisma.team.findMany({
        where: { schoolId },
        include: {
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

export default async function EnrollmentsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { schoolId: true, active: true },
    });

    if (!user?.active || !user?.schoolId) return null;

    const enrollments = await getEnrollments(user.schoolId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Inscrições</h1>
                    <p className="text-slate-400">Gerencie as inscrições da sua escola</p>
                </div>
                <Link
                    href="/professor/enrollments/new"
                    className="btn-primary inline-flex items-center gap-2 w-auto"
                >
                    <Plus className="w-5 h-5" />
                    Nova Inscrição
                </Link>
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
                                <th className="p-4 font-medium">Equipe</th>
                                <th className="p-4 font-medium">Modalidade</th>
                                <th className="p-4 font-medium">Categoria</th>
                                <th className="p-4 font-medium text-center">Alunos</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            {enrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        Nenhuma inscrição cadastrada.
                                    </td>
                                </tr>
                            ) : (
                                enrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{enrollment.name || "Sem nome"}</td>
                                        <td className="p-4 text-slate-400">{enrollment.modality.name}</td>
                                        <td className="p-4 text-slate-400">{enrollment.category.name}</td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                                                {enrollment._count.students}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={enrollment.status} />
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
