/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0f0f23',
          800: '#1a1a2e',
          700: '#16213e',
          600: '#0f3460'
        },
        neon: {
          blue: '#00d4ff',
          purple: '#8b5cf6',
          glow: '#00d4ff80'
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px #00d4ff40' },
          '100%': { boxShadow: '0 0 40px #00d4ff80' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }
    },
  },
  plugins: [],
}