import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="glass p-12 rounded-3xl max-w-2xl w-full animate-in slide-in-from-bottom-10 duration-700">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500/20 p-4 rounded-full ring-4 ring-blue-500/10">
            <Trophy className="w-16 h-16 text-blue-400" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Sistema <span className="text-blue-400">JEM</span>
        </h1>

        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-lg mx-auto leading-relaxed">
          Plataforma de gestão dos Jogos Escolares. Gerencie escolas, modalidades e inscrições de forma simples e eficiente.
        </p>

        <Link
          href="/login"
          className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
        >
          Acessar Sistema
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <footer className="mt-12 text-blue-300/60 text-sm">
        © 2025 Sistema JEM. Todos os direitos reservados.
      </footer>
    </div>
  );
}
