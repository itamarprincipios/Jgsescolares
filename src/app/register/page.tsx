import { prisma } from "@/lib/prisma";
import RegisterForm from "./form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
    const schools = await prisma.school.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass w-full max-w-md p-8 rounded-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Cadastro de Professor</h1>
                    <p className="text-blue-200">Preencha seus dados para solicitar acesso</p>
                </div>

                <RegisterForm schools={schools} />

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm text-blue-300 hover:text-white transition-colors">
                        Já tem uma conta? Faça login
                    </Link>
                </div>
            </div>
        </div>
    );
}
