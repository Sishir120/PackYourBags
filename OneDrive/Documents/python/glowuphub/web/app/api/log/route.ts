import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const { weight, water, sleep, steps } = data;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const log = await prisma.dailyLog.upsert({
            where: {
                // Since we don't have a unique constraint on (userId, date), 
                // we'll find today's log first for better production reliability.
                id: (await prisma.dailyLog.findFirst({
                    where: {
                        userId: session.user.id,
                        date: { gte: startOfDay }
                    }
                }))?.id || 'new_log'
            },
            update: {
                weight: weight !== undefined ? weight : undefined,
                water: water !== undefined ? { increment: water } : undefined,
                sleep: sleep !== undefined ? sleep : undefined,
                steps: steps !== undefined ? steps : undefined,
            },
            create: {
                userId: session.user.id,
                weight,
                water,
                sleep,
                steps,
                date: new Date(),
            }
        });

        return NextResponse.json(log);
    } catch (error) {
        console.error("DAILY_LOG_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const logs = await prisma.dailyLog.findMany({
            where: { userId: session.user.id },
            orderBy: { date: 'desc' },
            take: 30
        });

        return NextResponse.json(logs);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
