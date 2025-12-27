import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { habitId } = await req.json();
        if (!habitId) return new NextResponse("Missing habitId", { status: 400 });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Get or create today's log
        let log = await prisma.dailyLog.findFirst({
            where: {
                userId: session.user.id,
                date: { gte: startOfDay }
            }
        });

        if (!log) {
            log = await prisma.dailyLog.create({
                data: {
                    userId: session.user.id,
                    date: new Date(),
                    completedHabits: '[]',
                    moveScore: 0,
                    glowScore: 0,
                    mindScore: 0,
                }
            });
        }

        // Toggle habit
        const habits: string[] = JSON.parse(log.completedHabits as string || '[]');
        const index = habits.indexOf(habitId);

        if (index > -1) {
            habits.splice(index, 1);
        } else {
            habits.push(habitId);
        }

        const updatedLog = await prisma.dailyLog.update({
            where: { id: log.id },
            data: {
                completedHabits: JSON.stringify(habits)
            }
        });

        return NextResponse.json({ success: true, habits });
    } catch (error) {
        console.error("HABIT_LOG_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
