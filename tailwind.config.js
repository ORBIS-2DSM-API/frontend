/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    'bg-orange-400',
    'bg-sky-400',
    'bg-lime-500',
    'bg-pink-300',
    'bg-yellow-300',
  ],
  theme: {
    extend: {fontFamily:{
      poppins:["Poppins", "sans-serif"],
      inter: ['Inter', 'sans-serif'],
      manrope: ['Manrope', 'sans-serif'],
    }},
  },
  plugins: [],
};