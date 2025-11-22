"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTeam, getEligibleStudents } from "@/app/actions/teams";
import { Loader2, Users, Check } from "lucide-react";
import { Modality, Category, Student } from "@prisma/client";

interface TeamFormProps {
    modalities: Modality[];
    categories: Category[];
}

export default function TeamForm({ modalities, categories }: TeamFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [selectedModality, setSelectedModality] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [teamName, setTeamName] = useState("");

    const [eligibleStudents, setEligibleStudents] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    // Auto-generate team name
    useEffect(() => {
        if (selectedModality && selectedCategory && selectedGender) {
            const mod = modalities.find(m => m.id === selectedModality)?.name;
            const cat = categories.find(c => c.id === selectedCategory)?.name;
            const gender = selectedGender === 'MALE' ? 'Masculino' : selectedGender === 'FEMALE' ? 'Feminino' : 'Misto';
            setTeamName(`${mod} ${cat} ${gender}`);
        }
    }, [selectedModality, selectedCategory, selectedGender, modalities, categories]);

    // Fetch eligible students when filters change
    useEffect(() => {
        async function fetchStudents() {
            if (selectedModality && selectedCategory && selectedGender) {
                setLoadingStudents(true);
                try {
                    const students = await getEligibleStudents(selectedModality, selectedCategory, selectedGender);
                    setEligibleStudents(students);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoadingStudents(false);
                }
            } else {
                setEligibleStudents([]);
            }
        }
        fetchStudents();
    }, [selectedModality, selectedCategory, selectedGender]);

    const toggleStudent = (studentId: string) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await createTeam({
                name: teamName,
                modalityId: selectedModality,
                categoryId: selectedCategory,
                gender: selectedGender,
                studentIds: selectedStudents
            });

            if (result.error) {
                setError(result.error);
            } else {
                router.push("/professor/teams");
                router.refresh();
            }
        } catch (e) {
            setError("Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Modalidade</label>
                    <select
                        value={selectedModality}
                        onChange={(e) => setSelectedModality(e.target.value)}
                        className="input-field"
                        required
                    >
                        <option value="">Selecione...</option>
                        {modalities.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Categoria</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="input-field"
                        required
                    >
                        <option value="">Selecione...</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Gênero</label>
                    <select
                        value={selectedGender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        className="input-field"
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="MALE">Masculino</option>
                        <option value="FEMALE">Feminino</option>
                        <option value="MIXED">Misto</option>
                    </select>
                </div>
            </div>

            {teamName && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <label className="text-sm font-medium text-blue-300">Nome da Equipe Sugerido</label>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full bg-transparent border-none text-xl font-bold text-white focus:ring-0 p-0 mt-1"
                    />
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        Alunos Elegíveis
                    </h3>
                    <span className="text-sm text-slate-400">
                        {selectedStudents.length} selecionados
                    </span>
                </div>

                {loadingStudents ? (
                    <div className="py-12 text-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        Buscando alunos...
                    </div>
                ) : eligibleStudents.length > 0 ? (
                    <div className="border border-slate-700 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-900/50 text-slate-400">
                                <tr>
                                    <th className="p-4 w-12">
                                        <div className="w-4 h-4 border border-slate-600 rounded"></div>
                                    </th>
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">Idade</th>
                                    <th className="p-4">RG</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {eligibleStudents.map((student) => {
                                    const isSelected = selectedStudents.includes(student.id);
                                    const birth = new Date(student.birthDate);
                                    const age = 2025 - birth.getFullYear(); // Simplified for display

                                    return (
                                        <tr
                                            key={student.id}
                                            className={`hover:bg-slate-700/50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-500/10' : ''}`}
                                            onClick={() => toggleStudent(student.id)}
                                        >
                                            <td className="p-4">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
                                                    }`}>
                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-white">{student.name}</td>
                                            <td className="p-4">{age} anos</td>
                                            <td className="p-4">{student.rg}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                        {selectedModality ? "Nenhum aluno encontrado com os filtros selecionados." : "Selecione os filtros acima para buscar alunos."}
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-700">
                <button
                    type="submit"
                    disabled={loading || selectedStudents.length === 0}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Criando Equipe...
                        </>
                    ) : (
                        "Criar Equipe"
                    )}
                </button>
            </div>
        </form>
    );
}
