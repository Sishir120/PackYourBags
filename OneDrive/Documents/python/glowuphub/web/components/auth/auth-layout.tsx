"use client";

import Link from "next/link";

interface AuthLayoutProps {
    children: React.ReactNode;
    heading: string;
    subheading: string;
}

export function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left: Content */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24">
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
                    <span className="text-xl font-semibold tracking-tight text-foreground">
                        GlowUp<span className="text-primary">Hub</span>
                    </span>
                </Link>
                <div className="mx-auto w-full max-w-sm">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                            {heading}
                        </h1>
                        <p className="text-sm text-muted-foreground">{subheading}</p>
                    </div>
                    <div className="mt-8">{children}</div>
                </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:block lg:w-1/2 relative bg-secondary">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[300px] h-[300px] rounded-full bg-white/30 backdrop-blur-3xl" />
                    <div className="absolute w-[400px] h-[400px] border border-white/20 rounded-full animate-pulse opacity-50" />
                    <div className="absolute z-10 p-8 text-center">
                        <blockquote className="text-lg font-medium text-foreground italic leading-loose">
                            "Confidence is not thinking you look good. <br />
                            Confidence is knowing you show up for yourself daily."
                        </blockquote>
                    </div>
                </div>
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im5vaXNlIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+') " }}></div>
            </div>
        </div>
    );
}
