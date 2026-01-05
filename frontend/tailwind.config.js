/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',
        secondary: '#10B981',
        accent: '#F59E0B',
      },
    },
  },
  plugins: [],
};
