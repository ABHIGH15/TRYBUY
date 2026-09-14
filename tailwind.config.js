/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#211F1C",
        paper: "#F6F3EC",
        "paper-raised": "#FFFFFF",
        line: "#E4DFD3",
        blue: { DEFAULT: "#4C6B8A", bg: "#E9EFF3" },
        amber: { DEFAULT: "#AD7A2E", bg: "#F4ECDD" },
        closed: { DEFAULT: "#8C8272", bg: "#EDEAE2" },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Work Sans", "sans-serif"],
      }
    },
  },
  plugins: [],
}
