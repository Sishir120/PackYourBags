
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, height, currentWeight, gender, activityLevel, goal, age } = body;

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                height: height ? Number(height) : undefined,
                currentWeight: currentWeight ? Number(currentWeight) : undefined,
                gender,
                activityLevel,
                goal,
                dob: age ? new Date(new Date().setFullYear(new Date().getFullYear() - Number(age))) : undefined // Simplified age storage
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Update Error:', error);
        return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
    }
}
