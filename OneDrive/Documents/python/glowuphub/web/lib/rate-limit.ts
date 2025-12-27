import { NextRequest } from 'next/server';

// Simple in-memory rate limiting without external dependencies like Redis
// Note: This resets on server restart/redeploy, which is acceptable for this scale
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Basic in-memory rate limiter using IP address
 * @param req NextRequest object
 * @param limit Max requests allowed
 * @param windowMs Time window in milliseconds
 * @returns boolean - true if request is allowed, false if blocked
 */
export function checkRateLimit(
    req: NextRequest,
    limit: number = 10,
    windowMs: number = 60000 // 1 minute default
): boolean {
    // Get IP from headers (x-forwarded-for is standard for Vercel/proxies)
    const ip = req.headers.get('x-forwarded-for') || 'unknown-ip';
    const now = Date.now();

    const record = rateLimitMap.get(ip);

    // Clean up old record or create new one
    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    // Check limit
    if (record.count >= limit) {
        return false;
    }

    // Increment
    record.count++;
    return true;
}
