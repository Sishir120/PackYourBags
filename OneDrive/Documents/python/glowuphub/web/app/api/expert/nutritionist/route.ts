import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get nutritionist ID (Sabita Subedi - the admin)
const NUTRITIONIST_ID = "nutritionist_sabita";

/**
 * GET /api/expert/nutritionist
 * Returns the default nutritionist (Sabita Subedi)
 */
export async function GET() {
    try {
        // Try to find or create the nutritionist account
        let nutritionist = await prisma.user.findFirst({
            where: { role: "EXPERT" }
        });

        if (!nutritionist) {
            // Create the default nutritionist account
            nutritionist = await prisma.user.create({
                data: {
                    id: NUTRITIONIST_ID,
                    name: "Sabita Subedi",
                    email: "sabita@glowuphub.com",
                    role: "EXPERT",
                    // Add professional details
                }
            });
        }

        return NextResponse.json({
            id: nutritionist.id,
            name: nutritionist.name,
            email: nutritionist.email,
            role: nutritionist.role,
            avatar: "SS",
            specialty: "Clinical Nutrition",
            responseTime: "24-48h",
            rating: 4.9,
            clientsHelped: 10000,
            yearsExperience: 4
        });
    } catch (error) {
        console.error("NUTRITIONIST_ERROR", error);
        // Return default even if DB fails
        return NextResponse.json({
            id: NUTRITIONIST_ID,
            name: "Sabita Subedi",
            email: "sabita@glowuphub.com",
            role: "EXPERT",
            avatar: "SS",
            specialty: "Clinical Nutrition",
            responseTime: "24-48h",
            rating: 4.9,
            clientsHelped: 10000,
            yearsExperience: 4
        });
    }
}
