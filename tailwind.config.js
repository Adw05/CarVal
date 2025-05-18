/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark': {
          '50': '#f5f5f5',
          '100': '#e6e6e6',
          '200': '#cccccc',
          '300': '#b3b3b3',
          '400': '#999999',
          '500': '#808080',
          '600': '#666666',
          '700': '#4d4d4d',
          '800': '#1a1a1a',
          '900': '#0d0d0d',
          '950': '#050505',
        },
        'racing-red': {
          '50': '#fff0f0',
          '100': '#ffe0e0',
          '200': '#ffc0c0',
          '300': '#ff9090',
          '400': '#ff5050',
          '500': '#ff2020',
          '600': '#e60000',
          '700': '#c10000',
          '800': '#900000',
          '900': '#700000',
          '950': '#4c0000',
        }
      },
      fontFamily: {
        'racing': ['Orbitron', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'zoom-in': 'zoom-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'zoom-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'racing-gradient': 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)',
        'result-gradient': 'linear-gradient(135deg, rgba(5, 5, 5, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
      }
    },
  },
  plugins: [],
};