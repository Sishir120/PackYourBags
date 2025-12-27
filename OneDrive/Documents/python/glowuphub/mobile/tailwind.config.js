/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // Warm, Calm Theme - matching web
                background: "#FFFBF9",
                "background-muted": "#FFF8F5",
                foreground: "#3D3D3D",
                "foreground-muted": "#7A7A7A",

                primary: "#E8B4B8",
                "primary-soft": "#FDF2F4",
                "primary-foreground": "#3D3D3D",

                secondary: "#F5F5F2",
                "secondary-foreground": "#3D3D3D",

                // Accent palette
                sage: "#A8C5A8",
                lavender: "#C9B8D9",
                coral: "#F5C6AA",
                blush: "#F8E1E4",

                muted: "#FAF7F5",
                "muted-foreground": "#9A9A9A",

                accent: "#FFF8F5",
                "accent-foreground": "#E8B4B8",

                card: "#FFFFFF",
                "card-foreground": "#3D3D3D",

                border: "#F0E8E5",
                input: "#F5F0ED",

                // Glow Ring Colors
                "ring-glow": "#E8B4B8",
                "ring-move": "#A8C5A8",
                "ring-mind": "#C9B8D9",

                // Glass effects
                glass: "rgba(255, 255, 255, 0.7)",
                "glass-border": "rgba(232, 180, 184, 0.1)",
            },
        },
    },
    plugins: [],
}
