/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      flex: {
        3: "3 3 0%",
      },
      colors: {
        'primary-blue': '#3978D3',
        'secondary-blue': '#334d72',
        'primary-gray': 'rgb(218, 218, 218)'
      }
    },
  },
  plugins: [],
}