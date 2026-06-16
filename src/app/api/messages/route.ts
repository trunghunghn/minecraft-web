import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const partnerId = searchParams.get("partnerId");

        if (!partnerId) {
            // Get conversation list (latest message for each partner)
            // Simplified for now: just get users we have messages with
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { messagesSent: { some: { receiverId: session.user.id } } },
                        { messagesReceived: { some: { senderId: session.user.id } } }
                    ]
                },
                select: { id: true, name: true, image: true }
            });
            return NextResponse.json(users);
        }

        // Get messages with specific partner
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId: partnerId },
                    { senderId: partnerId, receiverId: session.user.id }
                ]
            },
            orderBy: { createdAt: "asc" },
            take: 100 // limit to last 100 messages
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("GET messages error:", error);
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
        const { receiverId, content } = body;

        if (!receiverId || !content) {
            return NextResponse.json({ error: "Receiver ID and content are required" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId: session.user.id,
                receiverId
            }
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("POST message error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
