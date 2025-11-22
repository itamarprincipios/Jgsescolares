import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, User } from "lucide-react";
import PrintButton from "./print-button";

export default async function TeamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") redirect("/login");

    const { id } = await params;

    const team = await prisma.team.findUnique({
        where: { id },
        include: {
            school: true,
            modality: true,
            category: true,
            students: {
                orderBy: { name: "asc" },
            },
        },
    });

    if (!team) notFound();

    const genderLabels = {
        MALE: "Masculino",
        FEMALE: "Feminino",
        MIXED: "Misto",
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/teams"
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Detalhes da Equipe</h1>
                        <p className="text-slate-400">Visualize os atletas e documentos</p>
                    </div>
                </div>
                <PrintButton />
            </div>

            {/* Print Header (Visible only when printing) */}
            <div className="hidden print:block mb-8 text-center border-b border-black pb-4">
                <h1 className="text-2xl font-bold uppercase mb-2">Ficha de Inscrição - JEM 2025</h1>
                <div className="grid grid-cols-2 gap-4 text-left mt-4">
                    <div>
                        <p><strong>Escola:</strong> {team.school.name}</p>
                        <p><strong>Modalidade:</strong> {team.modality.name}</p>
                    </div>
                    <div>
                        <p><strong>Categoria:</strong> {team.category.name}</p>
                        <p><strong>Gênero:</strong> {team.gender ? genderLabels[team.gender] : "-"}</p>
                    </div>
                </div>
            </div>

            {/* Screen Header */}
            <div className="glass p-6 rounded-xl border border-white/5 print:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Escola</p>
                        <p className="text-white font-medium">{team.school.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Modalidade</p>
                        <p className="text-white font-medium">{team.modality.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Categoria</p>
                        <p className="text-white font-medium">{team.category.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Gênero</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${team.gender === "MALE" ? "bg-blue-500/20 text-blue-300" :
                            team.gender === "FEMALE" ? "bg-pink-500/20 text-pink-300" :
                                "bg-purple-500/20 text-purple-300"
                            }`}>
                            {team.gender ? genderLabels[team.gender] : "-"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white print:text-black">Atletas ({team.students.length})</h2>

                {/* Screen View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
                    {team.students.map((student) => (
                        <div key={student.id} className="glass p-4 rounded-xl border border-white/5 flex gap-4">
                            <div className="w-24 h-24 flex-shrink-0 bg-slate-800 rounded-lg overflow-hidden">
                                {student.photo ? (
                                    <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-slate-600" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-2">
                                <div>
                                    <p className="text-white font-medium truncate">{student.name}</p>
                                    <p className="text-sm text-slate-400">RG: {student.rg || "-"}</p>
                                    <p className="text-sm text-slate-400">Nasc.: {new Date(student.birthDate).toLocaleDateString('pt-BR')}</p>
                                </div>
                                {student.documentPhoto && (
                                    <a
                                        href={student.documentPhoto}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        Ver Documento
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Print View (Table) */}
                <div className="hidden print:block">
                    <table className="w-full border-collapse border border-black">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-2 text-left">Nome</th>
                                <th className="border border-black p-2 text-left">RG</th>
                                <th className="border border-black p-2 text-left">Data Nasc.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.students.map((student) => (
                                <tr key={student.id}>
                                    <td className="border border-black p-2">{student.name}</td>
                                    <td className="border border-black p-2">{student.rg || "-"}</td>
                                    <td className="border border-black p-2">{new Date(student.birthDate).toLocaleDateString('pt-BR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-8 pt-8 border-t border-black flex justify-between text-sm">
                        <div>
                            <p className="mb-8">__________________________________________</p>
                            <p>Assinatura do Responsável</p>
                        </div>
                        <div>
                            <p className="mb-8">__________________________________________</p>
                            <p>Assinatura da Organização</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
