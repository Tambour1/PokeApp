/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        'pokemon': ['Poppins', 'sans-serif'],
      },
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      'primary': '#DC0A2D',
      'secondary': '#EFEFEF',
    }),
  },
  plugins: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}

