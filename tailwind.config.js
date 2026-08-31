/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hood: {
          green: '#00F58C',
          darkgreen: '#00B865',
          neon: '#25FF9C',
          glow: 'rgba(0, 245, 140, 0.35)',
        },
        cyber: {
          black: '#07090E',
          card: '#0D111A',
          cardHover: '#131926',
          border: '#1E293B',
          cyan: '#00E5FF',
          pink: '#FF007A',
          gold: '#FFD700',
          yellow: '#FFDF00',
          purple: '#A855F7',
          orange: '#FF6B00',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'ticker': 'ticker 30s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'laser': 'laser 1.5s infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(0, 245, 140, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(0, 245, 140, 0.85))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        laser: {
          '0%': { filter: 'drop-shadow(0 0 8px #FFD700)' },
          '100%': { filter: 'drop-shadow(0 0 24px #FF007A)' },
        }
      }
    },
  },
  plugins: [],
}
