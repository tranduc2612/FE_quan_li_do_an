/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'default': 'rgba(0, 0, 0, 0.4) 0px 30px 90px;',
      }
    },
  },
  plugins: [],
}

