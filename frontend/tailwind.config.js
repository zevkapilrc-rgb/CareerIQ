/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#A3779D", // Soft Violet
          light: "#E6C7E6", // Lilac Mist
          dark: "#663399", // Royal Amethyst
        },
        plum: {
          DEFAULT: "#2E1A47", // Midnight Plum
        },
      },
      backgroundImage: {
        "purple-glass":
          "radial-gradient(circle at top, rgba(230,199,230,0.18), transparent 55%), radial-gradient(circle at bottom, rgba(102,51,153,0.35), rgba(46,26,71,1))",
      },
    },
  },
  plugins: [],
};

