import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId: params.id },
            orderBy: { createdAt: "asc" },
            include: {
                author: { select: { id: true, name: true, image: true } }
            }
        });
        return NextResponse.json(comments);
    } catch (error) {
        console.error("GET comments error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: params.id,
                authorId: session.user.id
            },
            include: {
                author: { select: { id: true, name: true, image: true } }
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("POST comment error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
