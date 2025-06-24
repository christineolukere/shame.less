/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      colors: {
        // Warm, healing color palette
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d0c7',
          300: '#a3b2a3',
          400: '#7d927d',
          500: '#5f7a5f',
          600: '#4a614a',
          700: '#3d503d',
          800: '#334233',
          900: '#2b372b',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#fbeae3',
          200: '#f6d2c2',
          300: '#efb297',
          400: '#e6896a',
          500: '#de6b47',
          600: '#cf5233',
          700: '#ac4029',
          800: '#8a3626',
          900: '#703024',
        },
        lavender: {
          50: '#faf9fc',
          100: '#f3f1f8',
          200: '#e9e5f1',
          300: '#d8d0e6',
          400: '#c2b3d7',
          500: '#a892c4',
          600: '#9075ae',
          700: '#7a6196',
          800: '#65517c',
          900: '#544465',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#faf1e4',
          300: '#f5e6cc',
          400: '#eed5a8',
          500: '#e4c078',
          600: '#d6a854',
          700: '#c19240',
          800: '#9f7636',
          900: '#82612f',
        },
      },
      animation: {
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
        'soft-bounce': 'soft-bounce 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'gentle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'soft-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};