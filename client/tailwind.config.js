/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: { 50: '#fffde7', 100: '#fff9c4', 200: '#fff59d', 300: '#fff176', 400: '#ffee58', 500: '#FFD600', 600: '#FFC107', 700: '#FFB300', 800: '#FF8F00', 900: '#FF6F00' },
                dark: { 50: '#f8f8f8', 100: '#e8e8e8', 200: '#d0d0d0', 300: '#a8a8a8', 400: '#787878', 500: '#484848', 600: '#383838', 700: '#282828', 800: '#181818', 900: '#0a0a0a' },
            },
            fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68,-0.55,0.27,1.55)',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
                'counter': 'counter 1.5s ease-out',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
                slideIn: { '0%': { transform: 'translateY(-10px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
                bounceIn: { '0%': { transform: 'scale(0.8)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
            },
            backdropBlur: { xs: '2px' },
        },
    },
    plugins: [],
}
