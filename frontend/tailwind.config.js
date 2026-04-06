/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: "#262626",
        secondhand: "#3f3f3f",
        whitish: "#f5f5f5",
        lightgrey: "#dcdcdc",
        accent: "#c8a97e",
      },
    },
  },
  plugins: [],
}
