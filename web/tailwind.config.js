/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0066CC',
          'blue-dark': '#004499',
          'blue-light': '#E8F2FF',
          canvas: '#F5F5F7',
          surface: '#FFFFFF',
          border: '#E5E5EA',
          'text-primary': '#1D1D1F',
          'text-secondary': '#424245',
          'text-muted': '#86868B',
        },
        doctor: {
          blue: '#007AFF',
          bg: '#E5F1FF',
        },
        bills: {
          green: '#34C759',
          bg: '#EAF9EC',
        },
        forms: {
          orange: '#FF9500',
          bg: '#FFF4E5',
        },
        help: {
          purple: '#AF52DE',
          bg: '#F7EBFD',
        },
        sos: {
          red: '#FF3B30',
          bg: '#FFEBEA',
        },
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'glow-blue': '0 0 24px rgba(0, 102, 204, 0.25)',
        'glow-red': '0 0 24px rgba(255, 59, 48, 0.35)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(0.96)', opacity: '0.4' },
          '50%': { transform: 'scale(1.15)', opacity: '0.85' },
        },
        ripple: {
          '0%': { transform: 'scale(0.9)', opacity: '1' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'ripple': 'ripple 1.5s infinite ease-out',
      },
    },
  },
  plugins: [],
}
