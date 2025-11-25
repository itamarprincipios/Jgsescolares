"use client";

import { Student, School, Modality, Category } from "@prisma/client";
import { Printer, User } from "lucide-react";
import Image from "next/image";

type StudentWithRelations = Student & {
    school: School;
    modalities: Modality[];
    categories: Category[];
};

interface BadgeTemplateProps {
    student: StudentWithRelations;
}

export default function BadgeTemplate({ student }: BadgeTemplateProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* Botões de ação - só aparecem na tela */}
            <div className="no-print min-h-screen p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Crachá do Aluno
                            </h1>
                            <p className="text-blue-200">
                                Visualize e imprima o crachá de {student.name}
                            </p>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Printer className="w-5 h-5" />
                            Imprimir Crachá
                        </button>
                    </div>

                    {/* Preview do crachá */}
                    <div className="flex justify-center">
                        <div className="badge-container">
                            <BadgeContent student={student} />
                        </div>
                    </div>

                    <div className="mt-8 text-center text-blue-200 text-sm">
                        <p>💡 Dica: Use papel fotográfico ou cartolina para melhor resultado</p>
                        <p className="mt-2">📏 Tamanho recomendado: 10cm x 15cm</p>
                    </div>
                </div>
            </div>

            {/* Crachá para impressão */}
            <div className="print-only">
                <BadgeContent student={student} />
            </div>

            <style jsx global>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    .no-print {
                        display: none !important;
                    }
                    
                    .print-only {
                        display: block !important;
                    }
                    
                    .badge-container {
                        page-break-after: always;
                    }
                }
                
                @media screen {
                    .print-only {
                        display: none;
                    }
                }
                
                .badge-container {
                    width: 10cm;
                    height: 15cm;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </>
    );
}

function BadgeContent({ student }: BadgeTemplateProps) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-center">
                <h2 className="text-white font-bold text-xl mb-1">
                    JEM {currentYear}
                </h2>
                <p className="text-blue-100 text-sm">
                    Jogos Escolares Municipais
                </p>
            </div>

            {/* Foto do aluno */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-blue-100">
                    {student.photo ? (
                        <Image
                            src={student.photo}
                            alt={student.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-300">
                            <User className="w-20 h-20 text-blue-600" />
                        </div>
                    )}
                </div>
            </div>

            {/* Informações */}
            <div className="bg-white p-6 space-y-3 border-t-4 border-blue-500">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        {student.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm">
                        {student.school.name}
                    </p>
                </div>

                {student.modalities.length > 0 && (
                    <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                            MODALIDADE(S):
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                            {student.modalities.map((m) => m.name).join(", ")}
                        </p>
                    </div>
                )}

                {student.categories.length > 0 && (
                    <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                            CATEGORIA(S):
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                            {student.categories.map((c) => c.name).join(", ")}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 text-center">
                <p className="text-white text-xs font-semibold">
                    ATLETA CREDENCIADO
                </p>
            </div>
        </div>
    );
}
