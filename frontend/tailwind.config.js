/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        blue:{
          700:"#4393d0",
          500:"#a6d8f3",
          300:"#d9edfa",
          200:"#ffffff"
        },
        purple:{
          500:"#7c6ab9"
        }
      }
    },
  },
  plugins: [],
}

