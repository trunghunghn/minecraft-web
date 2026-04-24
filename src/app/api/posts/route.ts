import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/posts - Lấy tất cả bài viết đã published
export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: {
                author: {
                    select: { id: true, name: true, image: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(posts);
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}

// POST /api/posts - Tạo bài viết mới (yêu cầu đăng nhập)
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, excerpt, category, imageUrl, published } = body;

        if (!title || !content) {
            return NextResponse.json({ error: "Tiêu đề và nội dung không được để trống" }, { status: 400 });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                excerpt: excerpt || content.substring(0, 200),
                category: category || "General",
                imageUrl: imageUrl || null,
                published: published ?? false,
                authorId: session.user.id,
            }
        });

        return NextResponse.json(post, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
