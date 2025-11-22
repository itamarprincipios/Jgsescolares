"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    School,
    Trophy,
    Users,
    FileText,
    LogOut,
    Menu,
    X,
    List,
    ClipboardList,
    UsersRound
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: School, label: "Escolas", href: "/admin/schools" },
    { icon: Users, label: "Professores", href: "/admin/professors" },
    { icon: Trophy, label: "Modalidades", href: "/admin/modalities" },
    { icon: List, label: "Categorias", href: "/admin/categories" },
    { icon: UsersRound, label: "Equipes", href: "/admin/teams" },
    { icon: ClipboardList, label: "Inscrições", href: "/admin/registrations" },
    { icon: FileText, label: "Relatórios", href: "/admin/reports" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-slate-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-white/10 transition-transform duration-300 ease-in-out",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white">
                        JEM <span className="text-blue-500">Admin</span>
                    </h2>
                </div>

                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 bg-slate-800 border-b border-white/10">
                    <h1 className="text-xl font-bold text-white">JEM Admin</h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-white hover:bg-white/10 rounded-lg"
                    >
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
