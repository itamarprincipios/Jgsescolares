"use client";

import { rejectRegistration } from "@/app/actions/registrations";
import { X } from "lucide-react";

export default function RejectButton({ registrationId }: { registrationId: string }) {
    const handleReject = async () => {
        await rejectRegistration(registrationId);
    };

    return (
        <button
            onClick={handleReject}
            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
            title="Reprovar"
        >
            <X className="w-4 h-4" />
        </button>
    );
}
