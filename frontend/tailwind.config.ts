/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdf4ff',
          100: '#f9e8ff',
          200: '#f3d0fe',
          300: '#e9a8fd',
          400: '#d870fb',
          500: '#c344f6',
          600: '#a821db',
          700: '#8e18b8',
          800: '#761895',
          900: '#611679',
          950: '#430057',
        },
        ink: {
          50: '#f8f7f4',
          100: '#efecea',
          200: '#dcd8d2',
          300: '#c3bcb4',
          400: '#a89b90',
          500: '#8f7e72',
          600: '#7a6960',
          700: '#645650',
          800: '#544a45',
          900: '#48403c',
          950: '#272120',
        }
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
        'elevated': '0 16px 48px rgba(0,0,0,0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
