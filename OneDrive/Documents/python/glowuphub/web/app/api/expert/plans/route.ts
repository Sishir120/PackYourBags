
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const session = await auth();

    if (!session || !session.user || (session.user.role !== "EXPERT" && session.user.role !== "ADMIN")) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Cast to any to bypass generic Prisma Client type lag found in some environments
        const plans = await (prisma as any).nutritionPlan.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Parse features JSON string to array provided it was stored securely
        // @ts-ignore - Prisma client update might lag in IDE
        const parsedPlans = plans.map((plan: any) => ({
            ...plan,
            features: plan.features ? JSON.parse(plan.features) : []
        }));

        return NextResponse.json(parsedPlans);
    } catch (error) {
        console.error("Failed to fetch plans:", error); // Replaced Sentry in next steps
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
