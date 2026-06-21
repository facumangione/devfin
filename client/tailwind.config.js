/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f5f2fc',
          100: '#ece5f9',
          200: '#d8caf2',
          400: '#a78bd8',
          600: '#8266c4',
          800: '#3a3550',
        },
        mint: {
          50: '#eaf7f1',
          100: '#d3eee2',
          400: '#4d9b7a',
          600: '#357a5e',
        },
        peach: {
          50: '#fdf0ec',
          100: '#fadfd6',
          400: '#d97a6c',
          600: '#bd5a4b',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
