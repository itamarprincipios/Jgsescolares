"use client";

import { useState } from "react";
import { Printer, FileDown } from "lucide-react";

interface ReportData {
    modality: string;
    category: string;
    teams: {
        school: string;
        teamName: string;
        students: {
            name: string;
            birthDate: string;
            rg: string;
        }[];
    }[];
}

export default function PrintReportPage() {
    const [selectedModality, setSelectedModality] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        // Implementar exportação CSV
        alert("Exportação CSV em desenvolvimento");
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Controles - Ocultos na impressão */}
            <div className="no-print glass p-6 rounded-xl border border-white/5 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Configurar Relatório</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">Modalidade</label>
                        <select
                            className="input-field"
                            value={selectedModality}
                            onChange={(e) => setSelectedModality(e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            <option value="futsal">Futsal</option>
                            <option value="volei">Vôlei</option>
                            <option value="basquete">Basquete</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">Categoria</label>
                        <select
                            className="input-field"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            <option value="sub12">Sub-12</option>
                            <option value="sub15">Sub-15</option>
                            <option value="sub18">Sub-18</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="btn-primary w-auto px-6 py-2 flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" />
                        Imprimir
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <FileDown className="w-4 h-4" />
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* Área de Impressão */}
            <div className="print-area bg-white p-8 rounded-xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        Jogos Escolares 2025
                    </h1>
                    <p className="text-slate-600">
                        Relatório de Atletas - {selectedModality || "Todas Modalidades"} - {selectedCategory || "Todas Categorias"}
                    </p>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-900">
                            <th className="text-left p-3 text-slate-900">Escola</th>
                            <th className="text-left p-3 text-slate-900">Equipe</th>
                            <th className="text-left p-3 text-slate-900">Atleta</th>
                            <th className="text-left p-3 text-slate-900">Data Nasc.</th>
                            <th className="text-left p-3 text-slate-900">RG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Dados de exemplo - substituir por dados reais */}
                        <tr className="border-b border-slate-300">
                            <td className="p-3 text-slate-700">Escola Teste</td>
                            <td className="p-3 text-slate-700">Equipe A</td>
                            <td className="p-3 text-slate-700">João Silva</td>
                            <td className="p-3 text-slate-700">01/01/2010</td>
                            <td className="p-3 text-slate-700">12.345.678-9</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                            <td className="p-3 text-slate-700">Escola Teste</td>
                            <td className="p-3 text-slate-700">Equipe A</td>
                            <td className="p-3 text-slate-700">Maria Santos</td>
                            <td className="p-3 text-slate-700">15/03/2010</td>
                            <td className="p-3 text-slate-700">98.765.432-1</td>
                        </tr>
                    </tbody>
                </table>

                <div className="mt-8 text-center text-slate-600 text-sm">
                    <p>Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
            </div>

            <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
        </div>
    );
}
