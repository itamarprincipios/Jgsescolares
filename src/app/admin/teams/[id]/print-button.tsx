"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
            <Printer className="w-4 h-4" />
            <span>Imprimir Equipe</span>
        </button>
    );
}
