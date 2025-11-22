"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createStudent } from "@/app/actions/students";
import { Loader2, Upload, Calendar, Phone, User, FileText } from "lucide-react";
import { Modality, Category } from "@prisma/client";

import { updateStudent } from "@/app/actions/students";

interface StudentFormProps {
    modalities: Modality[];
    categories: Category[];
    initialData?: any; // Using any to avoid complex type issues for now, ideally should be Student with relations
}

export default function StudentForm({ modalities, categories, initialData }: StudentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [age, setAge] = useState<number | null>(null);

    // Initialize age if editing
    useState(() => {
        if (initialData?.birthDate) {
            const birth = new Date(initialData.birthDate);
            const referenceDate = new Date("2025-12-31");
            let age = referenceDate.getFullYear() - birth.getFullYear();
            const m = referenceDate.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && referenceDate.getDate() < birth.getDate())) {
                age--;
            }
            setAge(age);
        }
    });

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return;
        const birth = new Date(birthDate);
        const referenceDate = new Date("2025-12-31");
        let age = referenceDate.getFullYear() - birth.getFullYear();
        const m = referenceDate.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && referenceDate.getDate() < birth.getDate())) {
            age--;
        }
        setAge(age);
    };

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        try {
            let result;
            if (initialData) {
                result = await updateStudent(initialData.id, formData);
            } else {
                result = await createStudent(formData);
            }

            if (result.error) {
                setError(result.error);
            } else {
                router.push("/professor/students");
                router.refresh();
            }
        } catch (e) {
            setError("Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Nome Completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            name="name"
                            type="text"
                            required
                            defaultValue={initialData?.name}
                            className="input-field pl-10"
                            placeholder="Nome do aluno"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Data de Nascimento</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            name="birthDate"
                            type="date"
                            required
                            defaultValue={initialData?.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => calculateAge(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    {age !== null && (
                        <p className="text-sm text-blue-400">Idade em 31/12/2025: {age} anos</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">RG</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            name="rg"
                            type="text"
                            defaultValue={initialData?.rg || ''}
                            className="input-field pl-10"
                            placeholder="00.000.000-0"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Telefone do Responsável</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            name="guardianPhone"
                            type="tel"
                            required
                            defaultValue={initialData?.guardianPhone || ''}
                            className="input-field pl-10"
                            placeholder="(00) 00000-0000"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Gênero</label>
                    <select name="gender" className="input-field" required defaultValue={initialData?.gender || ''}>
                        <option value="">Selecione...</option>
                        <option value="MALE">Masculino</option>
                        <option value="FEMALE">Feminino</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Modalidade Principal</label>
                    <select name="modalityId" className="input-field" required defaultValue={initialData?.modalities?.[0]?.id || ''}>
                        <option value="">Selecione...</option>
                        {modalities.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Categoria</label>
                    <select name="categoryId" className="input-field" required defaultValue={initialData?.categories?.[0]?.id || ''}>
                        <option value="">Selecione...</option>
                        {categories.map((c) => {
                            const isEligible = age === null || age <= c.maxAge;
                            return (
                                <option key={c.id} value={c.id} disabled={!isEligible} className={!isEligible ? "text-slate-500 bg-slate-800" : ""}>
                                    {c.name} (Até {c.maxAge} anos) {!isEligible && "- Idade excedida"}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Foto do Aluno</label>
                    {initialData?.photo && (
                        <div className="mb-2">
                            <img src={initialData.photo} alt="Foto atual" className="w-20 h-20 object-cover rounded-lg" />
                            <p className="text-xs text-slate-400 mt-1">Foto atual</p>
                        </div>
                    )}
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <input
                            name="photo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="photo-upload"
                        />
                        <label htmlFor="photo-upload" className="cursor-pointer text-blue-400 hover:text-blue-300">
                            {initialData?.photo ? "Alterar foto" : "Clique para enviar"}
                        </label>
                        <p className="text-xs text-slate-500 mt-1">JPG, PNG (Max 5MB)</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Foto do Documento</label>
                    {initialData?.documentPhoto && (
                        <div className="mb-2">
                            <img src={initialData.documentPhoto} alt="Documento atual" className="w-20 h-20 object-cover rounded-lg" />
                            <p className="text-xs text-slate-400 mt-1">Documento atual</p>
                        </div>
                    )}
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <input
                            name="documentPhoto"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="doc-upload"
                        />
                        <label htmlFor="doc-upload" className="cursor-pointer text-blue-400 hover:text-blue-300">
                            {initialData?.documentPhoto ? "Alterar documento" : "Clique para enviar"}
                        </label>
                        <p className="text-xs text-slate-500 mt-1">JPG, PNG (Max 5MB)</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        initialData ? "Atualizar Aluno" : "Cadastrar Aluno"
                    )}
                </button>
            </div>
        </form>
    );
}
