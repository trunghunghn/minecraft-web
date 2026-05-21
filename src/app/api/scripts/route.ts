import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Lấy danh sách script của người dùng
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const scripts = await prisma.script.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: "desc" }
        });
        return NextResponse.json(scripts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 });
    }
}

// Lưu script mới hoặc cập nhật script cũ
export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, code, description, id } = await req.json();

        if (id) {
            // Cập nhật
            const updatedScript = await prisma.script.update({
                where: { id, userId: session.user.id },
                data: { name, code, description }
            });
            return NextResponse.json(updatedScript);
        } else {
            // Tạo mới
            const newScript = await prisma.script.create({
                data: {
                    name: name || "Untitled Script",
                    code,
                    description,
                    userId: session.user.id
                }
            });
            return NextResponse.json(newScript);
        }
    } catch (error) {
        console.error("Error saving script:", error);
        return NextResponse.json({ error: "Failed to save script" }, { status: 500 });
    }
}
