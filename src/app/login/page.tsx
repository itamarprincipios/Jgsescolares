"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Credenciais inválidas. Tente novamente.");
            } else {
                // Fetch the session to check the role
                const response = await fetch("/api/auth/session");
                const session = await response.json();

                if (session?.user?.role === "ADMIN") {
                    router.push("/admin");
                } else if (session?.user?.role === "PROFESSOR") {
                    router.push("/professor");
                } else {
                    router.push("/");
                }
                router.refresh();
            }
        } catch (error) {
            setError("Ocorreu um erro. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass w-full max-w-md p-8 rounded-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Sistema JEM</h1>
                    <p className="text-blue-200">Faça login para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">Email</label>
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="admin@jem.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">Senha</label>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Entrando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <Link href="/register" className="text-sm text-blue-300 hover:text-white transition-colors">
                            Não tem uma conta? Cadastre-se
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
