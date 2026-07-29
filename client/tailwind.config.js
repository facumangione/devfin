/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#faf8f5',
          100: '#efeae1',
          200: '#ded5c4',
          300: '#c2b7a2',
          400: '#9c9186',
          600: '#5c554b',
          800: '#211d17',
        },
        gold: {
          50: '#faf3e6',
          100: '#f2e3c2',
          300: '#dbb769',
          500: '#a17636',
          600: '#7d5a29',
        },
        mint: {
          50: '#eaf3ec',
          100: '#d3e8da',
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
