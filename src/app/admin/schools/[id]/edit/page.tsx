import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditSchoolForm from "./form";

export default async function EditSchoolPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const school = await prisma.school.findUnique({
        where: { id },
    });

    if (!school) {
        notFound();
    }

    return <EditSchoolForm school={school} />;
}
