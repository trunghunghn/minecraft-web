import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/posts/mine - Lấy tất cả bài viết của người dùng hiện tại (kể cả nháp)
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        const posts = await prisma.post.findMany({
            where: { authorId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(posts);
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
