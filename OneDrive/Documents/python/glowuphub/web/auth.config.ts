
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import prisma from "@/lib/prisma"

export const authConfig = {
    providers: [
        Google,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || !user.password) {
                    return null;
                }

                // Import bcrypt dynamically to avoid edge runtime issues
                const bcrypt = await import('bcryptjs');
                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!passwordsMatch) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role, // Pass role
                };
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            // Define protected routes
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') ||
                nextUrl.pathname.startsWith('/admin') ||
                nextUrl.pathname.startsWith('/expert') ||
                nextUrl.pathname.startsWith('/track') ||
                nextUrl.pathname.startsWith('/routines') ||
                nextUrl.pathname.startsWith('/calendar') ||
                nextUrl.pathname.startsWith('/movement') ||
                nextUrl.pathname.startsWith('/plan') ||
                nextUrl.pathname.startsWith('/chat') ||
                nextUrl.pathname.startsWith('/profile') ||
                nextUrl.pathname.startsWith('/settings');

            const isOnAuth = nextUrl.pathname.startsWith('/login') ||
                nextUrl.pathname.startsWith('/register');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            } else if (isOnAuth) {
                if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
                return true;
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user && token?.sub) {
                session.user.id = token.sub;
                session.user.role = token.role as string; // Pass role to session
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = user.role; // Store role in token
            }
            return token;
        }
    },
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET, // Fails fast if not set in production
} satisfies NextAuthConfig
