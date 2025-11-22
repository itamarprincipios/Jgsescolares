interface StatusBadgeProps {
    status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const styles = {
        PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        APPROVED: "bg-green-500/20 text-green-300 border-green-500/30",
        REJECTED: "bg-red-500/20 text-red-300 border-red-500/30",
    };

    const labels = {
        PENDING: "Pendente",
        APPROVED: "Aprovado",
        REJECTED: "Reprovado",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}
