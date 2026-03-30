import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7bb842',
          light: '#8ec95a',
          dark: '#64a01d',
          forest: '#26750b',
        },
        dark: {
          DEFAULT: '#141414',
          surface: '#222222',
          deep: '#101010',
          text: '#1c1c1c',
        },
        price: {
          DEFAULT: '#f83015',
          old: '#9aa5b3',
        },
        surface: {
          DEFAULT: '#f8f8f8',
          light: '#f1f1f1',
          card: '#f9f9f9',
          hover: '#f5f5f5',
        },
        border: {
          DEFAULT: '#ebebeb',
          light: '#e5e5e5',
          section: '#ddd',
        },
        // Keep some useful Tailwind-like colors
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#7bb842',
          600: '#64a01d',
          700: '#26750b',
          800: '#1a5c08',
          900: '#14450a',
        },
      },
      fontFamily: {
        sans: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      fontSize: {
        'xxs': ['1rem', { lineHeight: '1.4' }],       // 10px
        'xs': ['1.1rem', { lineHeight: '1.4' }],      // 11px
        'sm': ['1.3rem', { lineHeight: '1.5' }],      // 13px
        'base': ['1.6rem', { lineHeight: '1.7' }],    // 16px (body)
        'lg': ['1.8rem', { lineHeight: '1.5' }],      // 18px
        'xl': ['2rem', { lineHeight: '1.4' }],        // 20px
        '2xl': ['2.3rem', { lineHeight: '1.3' }],     // 23px
        '3xl': ['2.5rem', { lineHeight: '1.2' }],     // 25px
        '4xl': ['2.8rem', { lineHeight: '1.2' }],     // 28px
      },
      screens: {
        'xs': '480px',
        'sm': '576px',
        'md': '768px',
        'lg': '992px',
        'xl': '1200px',
        '2xl': '1349px',
      },
      maxWidth: {
        'container': '1349px',
      },
      spacing: {
        'gutter': '10px',
        'gutter-mobile': '7px',
        'container-px': '14px',
        'container-px-xl': '45px',
      },
      borderRadius: {
        'card': '10px',
        'section': '12px',
        'button': '8px',
        'pill': '50px',
      },
      boxShadow: {
        'card': '0 0 6px 0 rgba(50,50,93,0.15), 1px 1px 5px rgba(0,0,0,0.05)',
        'card-hover': 'rgba(60,64,67,0.1) 0 1px 2px 0, rgba(60,64,67,0.15) 0 2px 6px 2px',
        'dropdown': '0 2px 6px 0 rgba(50,50,50,0.33)',
        'gallery': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
        'gallery-hover': '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        'blog': '0 0 10px rgba(0,0,0,0.25)',
        'footer-top': '0 -2px 5px rgba(0,0,0,0.1)',
      },
      keyframes: {
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '125%' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 50px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        zoomPulse: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', visibility: 'hidden' as const },
          '100%': { transform: 'translateY(0)', visibility: 'visible' as const },
        },
        slideRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'shine': 'shine 1.1s ease-in-out',
        'fade-in-up': 'fadeInUp 1s ease both',
        'zoom-pulse': 'zoomPulse 3s linear 0.2s infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        'slide-right': 'slideRight 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.28, 0.12, 0.22, 1)',
        'smooth-out': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'cart': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
