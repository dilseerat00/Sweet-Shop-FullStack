/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f3',
          100: '#fce8e5',
          200: '#f9d5cf',
          300: '#f5b5ab',
          400: '#ee8978',
          500: '#e3654e',
          600: '#d04a31',
          700: '#ae3b25',
          800: '#8f3423',
          900: '#762f23',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      }
    },
  },
  plugins: [],
}
