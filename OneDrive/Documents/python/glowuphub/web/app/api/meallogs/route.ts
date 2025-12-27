import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const { mealType, calories, protein, carbs, fat, fiber, description, photoUrl } = data;

        const log = await prisma.mealLog.create({
            data: {
                userId: session.user.id,
                mealType,
                calories,
                protein,
                carbs,
                fat,
                fiber,
                description,
                photoUrl,
            }
        });

        return NextResponse.json(log);
    } catch (error) {
        console.error("MEAL_LOG_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    const date = dateStr ? new Date(dateStr) : new Date();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const logs = await prisma.mealLog.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        return NextResponse.json(logs);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
