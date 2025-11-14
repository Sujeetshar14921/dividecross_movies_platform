/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinebg: "#0F0F0F",
        cineaccent: "#E50914"
      }
    },
  },
  plugins: [],
}
