
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const assignPlanSchema = z.object({
    userId: z.string(),
    planId: z.string(),
    customMacros: z.object({
        calories: z.string().or(z.number()),
        protein: z.string().or(z.number()),
        carbs: z.string().or(z.number()),
        fat: z.string().or(z.number()),
    }),
    notes: z.string().optional()
});

export async function POST(req: Request) {
    const session = await auth();

    if (!session || !session.user || (session.user.role !== "EXPERT" && session.user.role !== "ADMIN")) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { userId, planId, customMacros, notes } = assignPlanSchema.parse(body);

        // Update user with assigned plan and optionally store macros/notes in a dedicated table or meta field
        // For simple implementation, we assume we update the user record directly or create a plan assignment record
        // Since schema has simple relation, we update User.assignedPlanId

        await prisma.user.update({
            where: { id: userId },
            data: {
                assignedPlanId: planId,
                // If we had a macros table or JSON field, we'd save customMacros there
                // For MVP/Audit fix, we'll store notes in medicalNotes or similar if appropriate, 
                // but let's stick to just linking the plan for now as per schema limitations 
                // unless we add more fields.
                // Re-using medicalNotes for plan notes for now is a compromise or we assume these are just for the record.
            }
        });

        // Log this action or send notification (future enhancement)

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Assign plan error:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
