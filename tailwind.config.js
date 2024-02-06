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
        'light': 'rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;',
        'md-light': 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'
      },
      colors: {
        'yellow-default': '#fcc808',
        'gray-default': '#271756'
      },
    },
  },
  plugins: [],
}

