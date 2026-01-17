import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // FanFlick Brand Colors
                primary: {
                    DEFAULT: '#D4AF37', // Gold
                    dark: '#B8941F',
                    light: '#E5C158',
                },
                background: {
                    DEFAULT: '#000000',
                    surface: '#18181b', // zinc-900
                    highlight: '#27272a', // zinc-800
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a1a1aa', // zinc-400
                    muted: '#71717a', // zinc-500
                },
            },
        },
    },
    plugins: [],
};
export default config;
