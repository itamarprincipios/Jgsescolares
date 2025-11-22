import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Edit, Trash2, User } from "lucide-react";
import { deleteStudent } from "@/app/actions/students";

export default async function StudentsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.schoolId) return null;

    const students = await prisma.student.findMany({
        where: {
            schoolId: session.user.schoolId,
        },
        include: {
            modalities: true,
            categories: true,
        },
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Atletas Cadastrados</h1>
                <p className="text-slate-400">Gerencie os alunos da sua escola.</p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr>
                                <th className="p-4">Nome</th>
                                <th className="p-4">Data Nasc.</th>
                                <th className="p-4">RG</th>
                                <th className="p-4">Modalidade</th>
                                <th className="p-4">Categoria</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        Nenhum aluno cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 font-medium text-white flex items-center gap-3">
                                            {student.photo ? (
                                                <img
                                                    src={student.photo}
                                                    alt={student.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                </div>
                                            )}
                                            {student.name}
                                        </td>
                                        <td className="p-4">
                                            {new Date(student.birthDate).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="p-4">{student.rg || "-"}</td>
                                        <td className="p-4">
                                            {student.modalities.map(m => m.name).join(", ")}
                                        </td>
                                        <td className="p-4">
                                            {student.categories.map(c => c.name).join(", ")}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/professor/students/${student.id}/edit`}
                                                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <form action={async () => {
                                                    "use server";
                                                    await deleteStudent(student.id);
                                                }}>
                                                    <button
                                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Excluir"
                                                        type="submit"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
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
