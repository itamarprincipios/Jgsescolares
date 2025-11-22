import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, User, School, Users, UserPlus, LayoutDashboard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";

export default async function ProfessorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "PROFESSOR") {
        redirect("/login");
    }

    const school = session.user.schoolId
        ? await prisma.school.findUnique({
            where: { id: session.user.schoolId },
        })
        : null;

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 p-4 z-50">
                <div className="flex flex-col h-full">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white mb-1">JEM</h1>
                        <p className="text-slate-400 text-sm">Painel do Professor</p>
                    </div>

                    <div className="mb-8 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">{session.user.name}</p>
                                <p className="text-slate-400 text-xs truncate max-w-[120px]">
                                    {session.user.email}
                                </p>
                            </div>
                        </div>
                        {school && (
                            <div className="flex items-center gap-2 text-slate-300 text-xs pt-3 border-t border-slate-600">
                                <School className="w-3 h-3" />
                                <span className="truncate">{school.name}</span>
                            </div>
                        )}
                    </div>

                    <nav className="space-y-2 flex-1">
                        <Link
                            href="/professor"
                            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/professor/students/new"
                            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
                        >
                            <UserPlus className="w-5 h-5" />
                            <span>Cadastrar Aluno</span>
                        </Link>
                        <Link
                            href="/professor/students"
                            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
                        >
                            <Users className="w-5 h-5" />
                            <span>Atletas Cadastrados</span>
                        </Link>
                        <Link
                            href="/professor/teams"
                            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
                        >
                            <Users className="w-5 h-5" />
                            <span>Equipes</span>
                        </Link>
                    </nav>

                    <div className="pt-4 border-t border-slate-700">
                        <SignOutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-64 p-8">
                <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
