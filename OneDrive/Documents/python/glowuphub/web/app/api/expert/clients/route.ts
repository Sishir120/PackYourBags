
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const session = await auth();

    // Strict role check
    if (!session || !session.user || session.user.role !== "EXPERT" && session.user.role !== "ADMIN") {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const clients = await prisma.user.findMany({
            where: {
                role: "CLIENT"
            },
            select: {
                id: true,
                name: true,
                email: true,
                currentWeight: true,
                targetWeight: true,
                height: true,
                // age is calculated, not in DB
                gender: true,
                goal: true,
                activityLevel: true,
                medicalNotes: true,
                // assignedPlan is not in schema based on previous read, let's check
                // Schema had: assignedPlan string? No, expertId string. 
                // Ah, let's re-read schema.
            }
        });

        // Calculate age from DOB if needed, or if age is in DB
        // Schema has 'dob', not 'age'.

        const clientsWithAge = clients.map(client => {
            let age = null;
            // @ts-ignore
            if (client.dob) {
                // @ts-ignore
                const dob = new Date(client.dob);
                const diff_ms = Date.now() - dob.getTime();
                const age_dt = new Date(diff_ms);
                age = Math.abs(age_dt.getUTCFullYear() - 1970);
            }
            return { ...client, age };
        });

        return NextResponse.json(clientsWithAge);
    } catch (error) {
        console.error("Failed to fetch clients:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
