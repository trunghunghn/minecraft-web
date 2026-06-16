import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const targetUserId = params.id;
        const currentUserId = session.user.id;

        if (targetUserId === currentUserId) {
            return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
        }

        // Check if already following
        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId
                }
            }
        });

        if (existingFollow) {
            // Unfollow
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: targetUserId
                    }
                }
            });
            return NextResponse.json({ following: false });
        } else {
            // Follow
            await prisma.follows.create({
                data: {
                    followerId: currentUserId,
                    followingId: targetUserId
                }
            });
            return NextResponse.json({ following: true });
        }
    } catch (error) {
        console.error("POST follow error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
