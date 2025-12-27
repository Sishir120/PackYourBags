import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const { workoutId, difficulty, feedback } = data;

        const log = await prisma.workoutLog.create({
            data: {
                userId: session.user.id,
                workoutId,
                difficulty,
                feedback,
            }
        });

        return NextResponse.json(log);
    } catch (error) {
        console.error("WORKOUT_LOG_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const logs = await prisma.workoutLog.findMany({
            where: { userId: session.user.id },
            include: { workout: true },
            orderBy: { date: 'desc' }
        });

        return NextResponse.json(logs);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
