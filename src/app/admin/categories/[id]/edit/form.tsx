"use client";

import { updateCategory } from "@/app/actions/categories";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useActionState } from "react";
import { Category } from "@prisma/client";

interface EditCategoryFormProps {
    category: Category;
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
    const [state, formAction] = useActionState(updateCategory, null);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/categories"
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Editar Categoria</h1>
                    <p className="text-slate-400">Atualize as informações da categoria</p>
                </div>
            </div>

            <div className="glass p-8 rounded-xl border border-white/5">
                <form action={formAction} className="space-y-6">
                    <input type="hidden" name="id" value={category.id} />

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-blue-100 ml-1">
                            Nome da Categoria *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="input-field"
                            placeholder="Ex: Sub-12, Sub-15, Sub-18..."
                            defaultValue={category.name}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="maxAge" className="text-sm font-medium text-blue-100 ml-1">
                            Idade Máxima *
                        </label>
                        <input
                            type="number"
                            id="maxAge"
                            name="maxAge"
                            className="input-field"
                            placeholder="Ex: 14"
                            min="0"
                            defaultValue={category.maxAge}
                            required
                        />
                        <p className="text-xs text-slate-500 ml-1">
                            Idade máxima permitida para esta categoria
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Link
                            href="/admin/categories"
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
