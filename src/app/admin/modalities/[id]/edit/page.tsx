import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EditModalityForm from "./form";

export default async function EditModalityPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") redirect("/login");

    const { id } = await params;

    const modality = await prisma.modality.findUnique({
        where: { id },
    });

    if (!modality) redirect("/admin/modalities");

    return <EditModalityForm modality={modality} />;
}
