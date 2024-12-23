/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: "rgba(255, 255, 255, 0.5)",
          100: "#eeeeef",
          200: "#e6e9ed",
          600: "#95989c"
        },
        purple: {
          200: "#d9ddee", // Light purple
          300: "#b8aee0", // New purple shade 300
          500: "#9492db", // Default purple
          600: "#7164c0", // Dark purple
          700: "#4e46a1", // New purple shade 700
        },
        backgroundImage: {
          'grid-white': 'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        },
      }
    },
  },
  plugins: [],
}