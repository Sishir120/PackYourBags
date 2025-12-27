import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    // Mock auth - getting first user or creating default
    let user = await prisma.user.findFirst({
        include: {
            logs: {
                orderBy: { date: 'desc' },
                take: 1
            }
        }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'user@glowup.hub',
                name: 'Client One',
                role: 'CLIENT',
                height: 165,
                currentWeight: 65,
                gender: 'F',
                activityLevel: 'MODERATE',
                goal: 'MAINTENANCE',
                glowScore: 100,
                streak: 0,
                points: 0,
                logs: {
                    create: {
                        moveScore: 0,
                        glowScore: 0,
                        mindScore: 0,
                        water: 0
                    }
                }
            },
            include: {
                logs: true
            }
        });
    }

    // Streak Logic: Check latest log to determine if streak should be reset
    if (user && user.logs && user.logs.length > 0) {
        const lastLog = user.logs[0];
        const lastDate = new Date(lastLog.date);
        lastDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays > 1 && user.streak > 0) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { streak: 0 },
                include: {
                    logs: {
                        orderBy: { date: 'desc' },
                        take: 1
                    }
                }
            });
        }
    }

    // Get today's log or create if missing (simple logic)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add subscription fields to response
    // TODO: When Prisma schema is updated, read from DB
    const userWithSubscription = {
        ...user,
        subscriptionTier: 'free', // 'free' | 'premium' | 'trial'
        subscriptionExpiresAt: null,
        trialUsed: false,
        points: user.points ?? 0,
    };

    return NextResponse.json(userWithSubscription);
}

export async function PUT(request: Request) {
    const data = await request.json();
    const { email, name, height, currentWeight, gender, dob, activityLevel, goal, dietaryPref } = data;

    // In a real app, we'd get the user ID from the session
    // For now, we update the first user or find by email
    const user = await prisma.user.findFirst();

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            name,
            height: Number(height),
            currentWeight: Number(currentWeight),
            gender,
            activityLevel,
            goal,
            dietaryPref,
            // Assuming dob is passed as string, sanitize if needed
        }
    });

    return NextResponse.json(updatedUser);
}

