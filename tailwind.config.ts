module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: false, // disables dark mode entirely
  // or:
  // darkMode: 'class', // for manual dark mode control via a class
}