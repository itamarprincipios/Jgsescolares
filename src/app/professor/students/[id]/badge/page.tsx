import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BadgeTemplate from "./badge-template";

export default async function StudentBadgePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const student = await prisma.student.findUnique({
        where: { id },
        include: {
            school: true,
            modalities: true,
            categories: true,
        },
    });

    if (!student) {
        notFound();
    }

    return <BadgeTemplate student={student} />;
}
