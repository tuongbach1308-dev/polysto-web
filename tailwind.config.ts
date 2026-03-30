import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Override default breakpoints — match website gốc (Bootstrap 4 breakpoints)
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1400px',
    },
    extend: {
      colors: {
        // Brand colors — extract từ XML :root + CSS
        main: {
          DEFAULT: '#7bb842',
          dark: '#26750b',
          light: '#64a01d',
        },
        dark: {
          DEFAULT: '#141414',
          soft: '#222',
          deep: '#101010',
          header: '#111',
        },
        price: {
          DEFAULT: '#f83015',
          old: '#9aa5b3',
        },
        surface: {
          DEFAULT: '#f8f8f8',
          card: '#ffffff',
          promo: '#f1f1f1',
          section: '#f9f9f9',
          content: '#F7F7F7',
        },
        border: {
          DEFAULT: '#ebebeb',
          light: '#e5e5e5',
          input: '#dfe3e8',
          section: '#ddd',
          menu: 'rgba(255,255,255,0.2)',
        },
        text: {
          DEFAULT: '#333',
          body: '#231f20',
          secondary: '#656565',
          muted: '#484848',
          light: '#9e9e9e',
          placeholder: '#cdcfdd',
        },
        badge: {
          green: '#15b41f',
          sale: '#64a01d',
          soldout: '#afafaf',
          secondary: '#e8684a',
        },
        social: {
          phone: '#4EB625',
          messenger: '#31ADFF',
          zalo: '#0165f8',
          maps: '#d94234',
        },
        service: {
          blue: '#EBF2FC',
          pink: '#FAE9EF',
          yellow: '#FFFBDB',
          green: '#E9FFE3',
        },
      },

      fontFamily: {
        nunito: ['var(--font-nunito)', 'Nunito', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },

      fontSize: {
        // px-based (vì html font-size 62.5%, Tailwind default rem sẽ bị scale sai)
        'xs': ['12px', { lineHeight: '1.4' }],
        'sm': ['13px', { lineHeight: '1.4' }],
        'base': ['16px', { lineHeight: '1.7' }],
        'lg': ['18px', { lineHeight: '1.4' }],
        'xl': ['20px', { lineHeight: '1.4' }],
        '2xl': ['22px', { lineHeight: '1.4' }],
        '3xl': ['25px', { lineHeight: '1.4' }],
        '4xl': ['26px', { lineHeight: '1.2' }],
        // Product specific
        'price': ['18px', { lineHeight: '1' }],
        'price-mobile': ['16px', { lineHeight: '1' }],
        'price-xs': ['14px', { lineHeight: '1' }],
        'price-detail': ['23px', { lineHeight: '1' }],
        'product-name': ['16px', { lineHeight: '1.4' }],
        'product-name-mobile': ['14px', { lineHeight: '1.4' }],
        // Section
        'section-title': ['20px', { lineHeight: '1.4' }],
        'section-title-mobile': ['20px', { lineHeight: '1.4' }],
        // Footer
        'footer-title': ['15px', { lineHeight: '1.4' }],
        // Header nav
        'nav': ['16px', { lineHeight: '1' }],
        // Small UI elements
        'badge': ['12px', { lineHeight: '20px' }],
        'tag': ['11px', { lineHeight: '1' }],
        'acc-small': ['11px', { lineHeight: '16px' }],
        'acc': ['13px', { lineHeight: '16px' }],
      },

      borderRadius: {
        'card': '10px',
        'section': '12px',
        'button': '8px',
        'sheet': '16px',
        'pill': '50px',
      },

      boxShadow: {
        'card': '0 0 6px 0 rgba(50,50,93,0.15), 1px 1px 5px rgba(0,0,0,0.05)',
        'card-hover': 'rgba(60,64,67,0.1) 0 1px 2px 0, rgba(60,64,67,0.15) 0 2px 6px 2px',
        'dropdown': '2px 4px 9px rgba(0,0,0,0.329)',
        'mega-menu': '0 2px 6px 0 rgba(50,50,50,0.33)',
        'footer': '0 -2px 5px rgba(0,0,0,0.1)',
        'blog': '0 0 10px rgba(0,0,0,0.25)',
        'gallery': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
        'gallery-hover': '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        'widget': '0 0 10px rgba(0,0,0,0.2)',
        'service': 'rgba(60,64,67,0.1) 0 1px 1px 0',
        'sheet': '0 -4px 15px rgba(0,0,0,0.15)',
        'search': '0 1px 5px 2px rgba(0,0,0,0.1)',
      },

      maxWidth: {
        'container': '1349px',
      },

      aspectRatio: {
        'logo': '249/26',
        'product': '1/1',
        'blog-thumb': '1/1',
        'banner-product': '573/502',
        'blog-wide': '800/450',
      },

      transitionTimingFunction: {
        'sheet': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'cart': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        'action-btn': 'cubic-bezier(0.28, 0.12, 0.22, 1)',
      },

      animation: {
        'shine': 'shine 1.1s',
        'pulse-widget': 'zoomzoom 3s linear 0.2s infinite',
        'fade-in-up': 'fadeInUp 1s ease both',
        'snake': 'snakeItem 3s ease alternate both infinite 1s',
        'alert-in': 'alert-fade-in-up 0.3s ease-out forwards',
        'alert-out': 'alert-fade-out 0.3s ease-out forwards',
        'spinner': 'spinner 1s infinite linear',
      },

      keyframes: {
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '125%' },
        },
        zoomzoom: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1.2)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 50px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        snakeItem: {
          '50%': { transform: 'translate(0, -8px)' },
        },
        'alert-fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'alert-fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        spinner: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      zIndex: {
        'header': '999',
        'mega-menu': '1030',
        'modal-overlay': '1040',
        'modal': '1050',
        'cart-sidebar': '999999',
        'backdrop': '9999',
        'widget': '1000',
        'toast': '9999',
        'bottom-nav': '10000',
        'bottom-sheet': '10001',
      },

      spacing: {
        'container': '14px',
        'container-xl': '45px',
        'gutter': '10px',
        'gutter-mobile': '7px',
      },
    },
  },
  plugins: [],
};

export default config;
