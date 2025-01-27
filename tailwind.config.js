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
      'secondary': '#F3F4F6',
    }),
    textColor: theme => ({
      ...theme('colors'),
      'primary': '#DC0A2D',
    }),
    
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}

