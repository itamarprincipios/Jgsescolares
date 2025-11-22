"use client";

import { createEnrollment } from "@/app/actions/enrollments";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useActionState } from "react";
import { Modality, Category, Student } from "@prisma/client";

interface NewEnrollmentFormProps {
    modalities: Modality[];
    categories: Category[];
    students: Student[];
}

export default function NewEnrollmentForm({ modalities, categories, students }: NewEnrollmentFormProps) {
    const [state, formAction] = useActionState(createEnrollment, null);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/professor/enrollments"
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Nova Inscrição</h1>
                    <p className="text-slate-400">Inscreva uma equipe em uma modalidade</p>
                </div>
            </div>

            <div className="glass p-8 rounded-xl border border-white/5">
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="teamName" className="text-sm font-medium text-blue-100 ml-1">
                            Nome da Equipe
                        </label>
                        <input
                            type="text"
                            id="teamName"
                            name="teamName"
                            className="input-field"
                            placeholder="Ex: Equipe A, Time Titular..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="modalityId" className="text-sm font-medium text-blue-100 ml-1">
                                Modalidade
                            </label>
                            <select
                                id="modalityId"
                                name="modalityId"
                                className="input-field"
                                required
                            >
                                <option value="">Selecione...</option>
                                {modalities.map((modality) => (
                                    <option key={modality.id} value={modality.id}>
                                        {modality.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="categoryId" className="text-sm font-medium text-blue-100 ml-1">
                                Categoria
                            </label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                className="input-field"
                                required
                            >
                                <option value="">Selecione...</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name} (até {category.maxAge} anos)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">
                            Alunos da Equipe
                        </label>
                        <div className="glass p-4 rounded-lg border border-white/10 max-h-64 overflow-y-auto space-y-2">
                            {students.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">
                                    Nenhum aluno cadastrado. <Link href="/professor/students/new" className="text-blue-400 hover:underline">Cadastre um aluno</Link>
                                </p>
                            ) : (
                                students.map((student) => (
                                    <label
                                        key={student.id}
                                        className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            name="studentIds"
                                            value={student.id}
                                            className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="text-white">{student.name}</span>
                                        <span className="text-slate-400 text-sm ml-auto">
                                            {new Date(student.birthDate).toLocaleDateString('pt-BR')}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Link
                            href="/professor/enrollments"
                            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="btn-primary w-auto px-6 py-2 flex items-center gap-2"
                            disabled={students.length === 0}
                        >
                            <Save className="w-4 h-4" />
                            Criar Inscrição
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
