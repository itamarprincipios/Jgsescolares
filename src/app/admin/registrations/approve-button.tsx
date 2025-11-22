"use client";

import { approveRegistration } from "@/app/actions/registrations";
import { Check } from "lucide-react";

export default function ApproveButton({ registrationId }: { registrationId: string }) {
    const handleApprove = async () => {
        await approveRegistration(registrationId);
    };

    return (
        <button
            onClick={handleApprove}
            className="p-2 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors"
            title="Aprovar"
        >
            <Check className="w-4 h-4" />
        </button>
    );
}
