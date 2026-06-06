/** @type {import('tailwindcss').Config} */
// Shares the BICARD brand palette + Udemy-style typography with the website.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e8f3ee',
          100: '#c5e0d4',
          200: '#9ecdb8',
          300: '#71b89a',
          400: '#42a079',
          500: '#13865a',
          600: '#00633F',
          700: '#005537',
          800: '#00452d',
          900: '#003421',
          DEFAULT: '#00633F',
        },
        accent: {
          50: '#fdeaea',
          100: '#f7c5c6',
          400: '#d94a4e',
          500: '#C6272B',
          600: '#a81f23',
          DEFAULT: '#C6272B',
        },
        highlight: { 500: '#FDD303', DEFAULT: '#FDD303' },
        ink: { DEFAULT: '#1c1d1f', light: '#6a6f73' },
        paper: '#f4f6f8',
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
