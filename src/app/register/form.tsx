"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerProfessor } from "@/app/actions/users";
import { Loader2, User, Mail, Lock, Phone, School } from "lucide-react";
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
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                        name="name"
                        type="text"
                        required
                        className="input-field pl-10"
                        placeholder="Seu nome"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-blue-100 ml-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                        name="email"
                        type="email"
                        required
                        className="input-field pl-10"
                        placeholder="seu@email.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-blue-100 ml-1">Telefone</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                        name="phone"
                        type="tel"
                        required
                        className="input-field pl-10"
                        placeholder="(00) 00000-0000"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-blue-100 ml-1">Escola</label>
                <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <select name="schoolId" className="input-field pl-10" required>
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
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                        name="password"
                        type="password"
                        required
                        className="input-field pl-10"
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
