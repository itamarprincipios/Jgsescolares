"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerProfessor } from "@/app/actions/users";
import { Loader2 } from "lucide-react";
import { School as SchoolType } from "@prisma/client";

interface RegisterFormProps {
    schools: SchoolType[];
}

export default function RegisterForm({ schools }: RegisterFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const result = await registerProfessor(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            }
        } catch (e) {
            setError("Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="text-center p-6 bg-green-500/20 border border-green-500/50 rounded-lg">
                <h3 className="text-xl font-bold text-green-400 mb-2">Cadastro Realizado!</h3>
                <p className="text-green-200">
                    Seu cadastro foi enviado com sucesso. Aguarde a aprovação do administrador para acessar o sistema.
                </p>
                <p className="text-sm text-green-300 mt-4">Redirecionando para o login...</p>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-blue-100 ml-1">Nome Completo</label>
                <div>
                    <input
                        name="name"
                        type="text"
                        required
                        className="input-field"
                        placeholder="Seu nome"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-blue-100 ml-1">Email</label>
                <div>
                    <input
                        name="email"
                        type="email"
                        required
                        className="input-field"
                        placeholder="seu@email.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-blue-100 ml-1">Telefone</label>
                <div>
                    <input
                        name="phone"
                        type="tel"
                        required
                        className="input-field"
                        placeholder="(00) 00000-0000"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-blue-100 ml-1">Escola</label>
                <div>
                    <select name="schoolId" className="input-field" required>
                        <option value="">Selecione sua escola...</option>
                        {schools.map((school) => (
                            <option key={school.id} value={school.id}>
                                {school.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-blue-100 ml-1">Senha</label>
                <div>
                    <input
                        name="password"
                        type="password"
                        required
                        className="input-field"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center justify-center gap-2 w-full mt-6"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Cadastrando...
                    </>
                ) : (
                    "Criar Conta"
                )}
            </button>
        </form>
    );
}
