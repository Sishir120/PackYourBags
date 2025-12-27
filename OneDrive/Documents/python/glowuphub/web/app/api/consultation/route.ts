import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const { date, notes } = data;

        const consultation = await prisma.consultationSession.create({
            data: {
                userId: session.user.id,
                date: new Date(date),
                notes,
                status: "scheduled"
            }
        });

        return NextResponse.json(consultation);
    } catch (error) {
        console.error("CONSULTATION_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const consultations = await prisma.consultationSession.findMany({
            where: { userId: session.user.id },
            orderBy: { date: 'asc' }
        });

        return NextResponse.json(consultations);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
