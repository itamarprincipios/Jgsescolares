"use client";

import { createModality } from "@/app/actions/modalities";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useActionState } from "react";

export default function NewModalityPage() {
    const [state, formAction] = useActionState(createModality, null);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/modalities"
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Nova Modalidade</h1>
                    <p className="text-slate-400">Cadastre uma nova modalidade esportiva</p>
                </div>
            </div>

            <div className="glass p-8 rounded-xl border border-white/5">
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-blue-100 ml-1">
                            Nome da Modalidade *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="input-field"
                            placeholder="Ex: Futsal, Queimada, Vôlei..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="allowsMixed" className="text-sm font-medium text-blue-100 ml-1">
                            Permite Equipes Mistas?
                        </label>
                        <select
                            id="allowsMixed"
                            name="allowsMixed"
                            className="input-field"
                            required
                        >
                            <option value="false">Não - Apenas masculino ou feminino</option>
                            <option value="true">Sim - Permite equipes mistas</option>
                        </select>
                        <p className="text-xs text-slate-500 ml-1">
                            Se permitir misto, as equipes poderão ter alunos de ambos os gêneros
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Link
                            href="/admin/modalities"
                            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="btn-primary w-auto px-6 py-2 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Salvar Modalidade
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
