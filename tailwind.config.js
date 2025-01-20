/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        'pokemon': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}

