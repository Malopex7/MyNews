/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './App.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './screens/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // FanFlick Cinematic Palette
                background: '#09090b', // zinc-950
                surface: {
                    DEFAULT: '#18181b', // zinc-900
                    highlight: '#27272a', // zinc-800
                },
                primary: {
                    DEFAULT: '#f59e0b', // amber-500 (Cinema Gold)
                    content: '#ffffff',
                },
                accent: {
                    DEFAULT: '#e11d48', // rose-600 (Record Red)
                },
                text: {
                    primary: '#f4f4f5', // zinc-100
                    secondary: '#a1a1aa', // zinc-400
                    muted: '#52525b', // zinc-600
                },
                // Keep generic utilities if needed, but prefer semantic names above
                zinc: {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b',
                },
                amber: {
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                },
            },
            fontFamily: {
                sans: ['Lato-Regular', 'system-ui', 'sans-serif'],
                cinematic: ['BebasNeue-Regular', 'sans-serif'],
                body: ['Lato-Regular', 'sans-serif'],
                'body-bold': ['Lato-Bold', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
