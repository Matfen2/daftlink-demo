/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#eab308',
          dark: '#ca9a06',
          light: '#fbbf24',
        },
        black: {
          DEFAULT: '#000000',
          light: '#0a0a0a',
          card: '#111111',
          hover: '#1a1a1a',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(234, 179, 8, 0.3)',
        'gold-lg': '0 10px 30px rgba(234, 179, 8, 0.4)',
        'glow-gold': '0 0 30px rgba(234, 179, 8, 0.2)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
