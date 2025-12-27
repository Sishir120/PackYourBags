import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const workouts = await prisma.workout.findMany({
        include: {
            exercises: {
                include: {
                    exercise: true
                }
            }
        }
    });

    if (workouts.length === 0) {
        // Seed default workouts if empty
        // Note: This requires exercises to exist first
        // For now, return empty array or create a proper seeding script
        return NextResponse.json([]);
    }

    return NextResponse.json(workouts);
}
