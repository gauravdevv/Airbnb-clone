/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      colors: {
        primary: '#ffbd00',
        secondary:'#fff8e8'
      }
    },
  },
  plugins: [],
}
