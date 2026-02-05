/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#e0f7ff',
          100: '#b0eaff',
          200: '#7fd8ff',
          300: '#4dc6ff',
          400: '#1ab4ff',
          500: '#009de6',
          600: '#007ab4',
          700: '#005782',
          800: '#003551',
          900: '#001220',
        },
        sand: {
          50: '#fefaf5',
          100: '#fef3e6',
          200: '#fce7cd',
          300: '#fad2a4',
          400: '#f8bd7b',
          500: '#f5a952',
          600: '#d88c3a',
          700: '#b16f29',
          800: '#8a5218',
          900: '#633607',
        }
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
