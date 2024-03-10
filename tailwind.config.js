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
        'gray-default': '#271756',
        'light-blue': "#DEECFF",
        'medium-blue': "#DEECFF",
        'primary-blue': "#2074b0",
        'text-color':"#333"
      },
      gridColumn: {
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        '24': 'repeat(24, minmax(0, 1fr))',
        '23': 'repeat(23, minmax(0, 1fr))',
        '22': 'repeat(22, minmax(0, 1fr))',
        '21': 'repeat(21, minmax(0, 1fr))',

      }
    },
  },
  plugins: [require("daisyui")],
}

