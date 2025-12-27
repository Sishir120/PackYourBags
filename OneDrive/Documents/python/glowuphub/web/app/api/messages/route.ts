import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const { receiverId, content, mediaUrl, mediaType } = data;

        const message = await prisma.message.create({
            data: {
                senderId: session.user.id,
                receiverId,
                content,
                mediaUrl,
                mediaType,
            }
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("MESSAGE_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get('userId');

    if (!otherUserId) return new NextResponse("Missing userId", { status: 400 });

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: session.user.id }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json(messages);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
