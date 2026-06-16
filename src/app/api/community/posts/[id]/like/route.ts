import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const postId = params.id;
        const userId = session.user.id;

        // Check if like exists
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId
                }
            }
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: { id: existingLike.id }
            });
            return NextResponse.json({ liked: false });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    postId,
                    userId
                }
            });
            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        console.error("POST like error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
