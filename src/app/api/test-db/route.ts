import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Tenta conectar e fazer uma query simples
        const userCount = await prisma.user.count();
        const schools = await prisma.school.findMany({ take: 1 });

        return NextResponse.json({
            status: "success",
            message: "Database connection working",
            userCount,
            schoolsFound: schools.length,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("Database connection error:", error);
        return NextResponse.json({
            status: "error",
            message: error.message,
            code: error.code
        }, { status: 500 });
    }
}
