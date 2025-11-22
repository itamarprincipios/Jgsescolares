"use client";

import { updateSchool } from "@/app/actions/schools";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useActionState } from "react";
import { School } from "@prisma/client";

interface EditSchoolPageProps {
    school: School;
}

export default function EditSchoolForm({ school }: EditSchoolPageProps) {
    const [state, formAction] = useActionState(updateSchool, null);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/schools"
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Editar Escola</h1>
                    <p className="text-slate-400">Atualize os dados da instituição</p>
                </div>
            </div>

            <div className="glass p-8 rounded-xl border border-white/5">
                <form action={formAction} className="space-y-6">
                    <input type="hidden" name="id" value={school.id} />

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-blue-100 ml-1">
                            Nome da Escola
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="input-field"
                            placeholder="Ex: Escola Municipal..."
                            defaultValue={school.name}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="city" className="text-sm font-medium text-blue-100 ml-1">
                            Cidade
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            className="input-field"
                            placeholder="Ex: São Paulo"
                            defaultValue={school.city || ""}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Link
                            href="/admin/schools"
                            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="btn-primary w-auto px-6 py-2 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
