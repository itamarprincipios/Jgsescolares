import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { FileDown, FileText } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") redirect("/login");

    const stats = await prisma.$transaction([
        prisma.school.count(),
        prisma.student.count(),
        prisma.team.count(),
        prisma.team.count({ where: { status: "APPROVED" } }),
    ]);

    const [schoolsCount, studentsCount, teamsCount, approvedTeamsCount] = stats;

    const reportTypes = [
        {
            title: "Relatório de Escolas",
            description: "Lista completa de todas as escolas cadastradas",
            icon: FileText,
            href: "/admin/reports/schools",
        },
        {
            title: "Relatório de Inscrições",
            description: "Todas as inscrições por modalidade e categoria",
            icon: FileText,
            href: "/admin/reports/enrollments",
        },
        {
            title: "Relatório de Alunos",
            description: "Lista de alunos por escola",
            icon: FileText,
            href: "/admin/reports/students",
        },
        {
            title: "Relatório Geral",
            description: "Resumo completo do sistema",
            icon: FileText,
            href: "/admin/reports/general",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Relatórios</h1>
                <p className="text-slate-400">Gere relatórios e exporte dados do sistema</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Escolas</span>
                        <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{schoolsCount}</p>
                </div>

                <div className="glass p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Alunos</span>
                        <FileText className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{studentsCount}</p>
                </div>

                <div className="glass p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Inscrições</span>
                        <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{teamsCount}</p>
                </div>

                <div className="glass p-6 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Aprovadas</span>
                        <FileText className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">{approvedTeamsCount}</p>
                </div>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => {
                    const Icon = report.icon;
                    return (
                        <div
                            key={report.title}
                            className="glass p-6 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <Icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-1">{report.title}</h3>
                                    <p className="text-slate-400 text-sm mb-4">{report.description}</p>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2">
                                            <FileDown className="w-4 h-4" />
                                            Exportar PDF
                                        </button>
                                        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2">
                                            <FileDown className="w-4 h-4" />
                                            Exportar CSV
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="glass p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-2">Nota</h3>
                <p className="text-slate-400">
                    A funcionalidade de exportação de relatórios em PDF e CSV está em desenvolvimento.
                    Em breve você poderá gerar e baixar relatórios completos do sistema.
                </p>
            </div>
        </div>
    );
}
