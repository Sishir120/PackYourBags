import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                "primary-soft": "var(--primary-soft)",
                secondary: "var(--secondary)",
                "secondary-foreground": "var(--secondary-foreground)",
                sage: "var(--sage)",
                lavender: "var(--lavender)",
                coral: "var(--coral)",
                blush: "var(--blush)",
            },
            animation: {
                breathe: "breathe 4s ease-in-out infinite",
                float: "float 6s ease-in-out infinite",
                "spin-slow": "spin 3s linear infinite",
                beat: "beat 1s infinite",
            },
            keyframes: {
                breathe: {
                    "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
                    "50%": { transform: "scale(1.02)", opacity: "1" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                },
                beat: {
                    "0%, 100%": { transform: "scale(1)" },
                    "25%": { transform: "scale(1.1)" },
                }
            }
        },
    },
    plugins: [],
};
export default config;
