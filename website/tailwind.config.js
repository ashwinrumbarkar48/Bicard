/** @type {import('tailwindcss').Config} */
// BICARD brand palette (brighter emerald primary + #00633F for depth) with
// Udemy-style typography. Tuned for a modern, vibrant aesthetic.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — brighter emerald, rooted in BICARD green
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#047857', // primary
          700: '#036348',
          800: '#00533a',
          900: '#00422e',
          DEFAULT: '#047857',
        },
        // Deep BICARD green — used for depth (footer, gradients, dark accents)
        deep: {
          DEFAULT: '#00633F',
          dark: '#004d31',
        },
        // Accent — BICARD red (#C6272B)
        accent: {
          50: '#fdeaea',
          100: '#f7c5c6',
          200: '#ef9b9d',
          300: '#e66e71',
          400: '#d94a4e',
          500: '#C6272B',
          600: '#a81f23',
          700: '#85181b',
          DEFAULT: '#C6272B',
        },
        // Highlight — BICARD yellow (#FDD303)
        highlight: {
          400: '#ffe04d',
          500: '#FDD303',
          600: '#e0bb00',
          DEFAULT: '#FDD303',
        },
        ink: {
          DEFAULT: '#1c1d1f',
          light: '#6a6f73',
          lighter: '#a3a3a3',
        },
        paper: '#f6faf8',
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['"Hanken Grotesk"', 'system-ui', 'Segoe UI', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 4px 16px rgba(16,24,40,0.06)',
        'card-hover': '0 8px 16px rgba(4,120,87,0.10), 0 16px 40px rgba(16,24,40,0.12)',
        nav: '0 1px 0 rgba(16,24,40,0.06), 0 8px 24px rgba(16,24,40,0.04)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(4,120,87,0.35)',
      },
      borderRadius: {
        card: '14px',
        xl2: '20px',
      },
      maxWidth: {
        container: '1320px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #00633F 0%, #047857 45%, #0a8f5c 100%)',
        'brand-radial': 'radial-gradient(60% 80% at 80% 0%, rgba(16,185,129,0.35) 0%, rgba(0,99,63,0) 60%)',
        'mint-fade': 'linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
        'spin-reverse': {
          to: { transform: 'rotate(-360deg)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        float: 'float 7s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
        'spin-slow': 'spin 1.6s linear infinite',
        'spin-reverse': 'spin-reverse 1.1s linear infinite',
        shimmer: 'shimmer 1.6s infinite',
        'bounce-dot': 'bounce-dot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
