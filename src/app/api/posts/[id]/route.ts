import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/posts/[id] - Lấy bài viết theo ID
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, image: true }
                }
            }
        });

        if (!post) {
            return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}

// PATCH /api/posts/[id] - Cập nhật bài viết 
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Kiểm tra quyền sở hữu
        const existing = await prisma.post.findUnique({ where: { id } });
        if (!existing || existing.authorId !== session.user.id) {
            return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
        }

        const post = await prisma.post.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(post);
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}

// DELETE /api/posts/[id] - Xóa bài viết
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        const { id } = await params;
        const existing = await prisma.post.findUnique({ where: { id } });

        if (!existing || existing.authorId !== session.user.id) {
            return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
        }

        await prisma.post.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
