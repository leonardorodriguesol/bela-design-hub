/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f7',
          100: '#ffe4ec',
          200: '#ffbed1',
          300: '#ff94b4',
          400: '#ff6c99',
          500: '#f14684',
          600: '#d12f71',
          700: '#a9215a',
          800: '#7a1742',
          900: '#4d0d2a',
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

