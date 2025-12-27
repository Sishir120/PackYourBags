import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlowUp Hub – Daily Self-Care App for Face Yoga & Breathwork",
  description: "Build lasting radiance with GlowUp Hub. The daily self-care app for face yoga, breathwork, and journaling routines. Start your 15-minute practice today.",
  keywords: ["daily self-care app", "face yoga app", "breathwork routine", "glow up challenge", "wellness journal", "skincare routine tracker"],
  openGraph: {
    title: "GlowUp Hub – Nurture Your Natural Glow",
    description: "Your daily sanctuary for face yoga, breathwork, and guided journaling. Join 10,000+ members building confidence from the inside out.",
    url: "https://glowuphub.com",
    siteName: "GlowUp Hub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GlowUp Hub App Interface showing daily rings and wellness cards",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlowUp Hub – Daily Self-Care App",
    description: "Face yoga, breathwork, and journaling in one beautiful daily routine.",
    images: ["/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground pb-20 md:pb-0`}
      >
        <Providers>
          {children}
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
