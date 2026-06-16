import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                author: {
                    select: { id: true, name: true, image: true }
                },
                _count: {
                    select: { comments: true, likes: true }
                },
                likes: { // Need this to check if current user liked it, but maybe better to fetch separately or join
                    select: { userId: true }
                }
            }
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("GET posts error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { content, imageUrl } = body;

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const post = await prisma.post.create({
            data: {
                content,
                imageUrl,
                authorId: session.user.id,
                title: "", // Social posts usually don't have titles
            },
            include: {
                author: { select: { id: true, name: true, image: true } },
                _count: { select: { comments: true, likes: true } },
                likes: true
            }
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("POST posts error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
