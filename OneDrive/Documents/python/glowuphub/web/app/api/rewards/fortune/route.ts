import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const MOTIVATIONAL_MESSAGES = [
    "Your progress is not always visible, but it is always real.",
    "Consistency is the bridges between goals and accomplishment.",
    "You are stronger than your excuses.",
    "Every small step is leading you to a big transformation.",
    "The person you are becoming is worth the effort.",
    "Trust the process, even when you can't see the finish line.",
    "One day at a time. One meal at a time. One breath at a time.",
    "Your relationship with yourself is the most important one you'll ever have.",
    "Radiance starts from within.",
    "Keep showing up. That is the winning move.",
    "Small wins are the seeds of great transformations.",
    "Your future self will thank you for what you do today.",
    "Energy flows where intention goes. Keep your focus bright.",
    "You are the architect of your own well-being.",
    "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    "Believe in the power of 'yet'. You haven't reached your peak *yet*.",
    "Today is another opportunity to outshine yesterday.",
    "Your body is your temple. Honor it with your choices today.",
    "Manifesting your best self starts with the practice you do right now.",
    "You have the discipline to follow through on your dreams.",
    "Every drop of water, every step, every conscious bite is a vote for the person you want to be.",
    "Progress, not perfection. You are doing enough.",
    "The glow you seek is already inside you. Consistency just lets it out.",
    "You are worthy of the health and vitality you are creating.",
    "Confidence is a muscle. You are building it every single day."
];

export async function POST(request: Request) {
    const { userId } = await request.json();

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return a random motivational message
        const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

        return NextResponse.json({ message });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to open fortune cookie' }, { status: 500 });
    }
}
