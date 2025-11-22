import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EditCategoryForm from "./form";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") redirect("/login");

    const { id } = await params;

    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) redirect("/admin/categories");

    return <EditCategoryForm category={category} />;
}
