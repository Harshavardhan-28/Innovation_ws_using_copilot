import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme base colors
        dark: {
          900: '#020617',
          800: '#0b1120',
          700: '#0f172a',
          600: '#1e293b',
          500: '#334155',
        },
        // Accent colors
        accent: {
          cyan: '#22d3ee',
          purple: '#a855f7',
          pink: '#ec4899',
        },
        // Primary gradient-based palette (cyan)
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Surface colors for cards/panels
        surface: {
          DEFAULT: 'rgba(11, 17, 32, 0.7)',
          light: 'rgba(15, 23, 42, 0.8)',
          solid: '#0b1120',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(34, 211, 238, 0.15), transparent)',
        'card-gradient': 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(168, 85, 247, 0.1))',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(34, 211, 238, 0.2)',
        'glow': '0 0 20px rgba(34, 211, 238, 0.3)',
        'glow-lg': '0 0 40px rgba(34, 211, 238, 0.4)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(34, 211, 238, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      borderColor: {
        glass: 'rgba(30, 41, 59, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
