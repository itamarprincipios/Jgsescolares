"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteButtonProps {
    onDelete: () => Promise<void>;
    itemName: string;
}

export default function DeleteButton({ onDelete, itemName }: DeleteButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete();
            setShowModal(false);
        } catch (error) {
            console.error("Erro ao excluir:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                title="Excluir"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass max-w-md w-full p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-2">Confirmar Exclusão</h3>
                        <p className="text-slate-300 mb-6">
                            Tem certeza que deseja excluir <strong>{itemName}</strong>? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Excluindo..." : "Excluir"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
