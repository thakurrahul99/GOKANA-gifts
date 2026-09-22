/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Luxury Editorial Palette: Charcoal & Champagne Gold ──
        bg: {
          DEFAULT: '#111111',  // Main page background
          alt: '#171717',      // Alternate section
          surface: '#1E1E1E',  // Normal card/surface
          elevated: '#242424', // Elevated card / modal
          banner: '#0B0B0B',   // Deepest / Hero / Navbar
        },
        surface: {
          DEFAULT: '#1E1E1E',
          alt: '#242424',
          tint: '#282828',
          skeleton: '#242424',
        },
        border: {
          DEFAULT: '#303030',
          soft: 'rgba(197, 160, 89, 0.22)',
          gold: '#C5A059',
        },
        badge: {
          'sale-bg': 'rgba(197, 160, 89, 0.12)',
          'sale-text': '#E5C378',
          'sale-border': 'rgba(197, 160, 89, 0.3)',
        },
        primary: {
          DEFAULT: '#111111',
          2: '#171717',
          dark: '#0B0B0B',
          soft: '#1E1E1E',
        },
        accent: {
          DEFAULT: '#C5A059', // Main Gold
          dark: '#9E7B36',   // Deep Metallic Gold
          light: '#E5C378',  // Light Gold / Hover
          soft: '#E8D5B5',   // Soft Champagne
        },
        ivory: {
          DEFAULT: '#FAF8F5',
          soft: '#F5F2EB',
          muted: '#B0AAA0',
        },
        text: {
          DEFAULT: '#FAF8F5',
          strong: '#FAF8F5',
          secondary: '#B0AAA0',
          muted: '#77736D',
        },
        muted: {
          DEFAULT: '#B0AAA0',
          2: '#77736D',
        },
        success: '#2E7D32',
        warning: '#C5A059',
        error: '#B3261E',
        info: '#C5A059',

        // ── Backward Compatible Aliases (Mapped to Charcoal & Champagne Gold) ──
        charcoal: {
          DEFAULT: '#1E1E1E',
          50: '#FAF8F5',
          100: '#E8D5B5',
          200: '#303030',
          300: '#77736D',
          400: '#B0AAA0',
          500: '#242424',
          600: '#1E1E1E',
          700: '#171717',
          800: '#111111',
          900: '#0B0B0B',
        },
        champagne: {
          DEFAULT: '#C5A059',
          50: '#FAF8F5',
          100: '#F5F2EB',
          200: '#E8D5B5',
          300: '#E5C378',
          400: '#C5A059',
          500: '#9E7B36',
        },
        gold: {
          DEFAULT: '#C5A059',
          50: '#FAF8F5',
          100: '#F5F2EB',
          200: '#E8D5B5',
          300: '#E5C378',
          400: '#C5A059',
          500: '#9E7B36',
          600: '#8A6828',
          700: '#6E521C',
          800: '#523D14',
          900: '#38290B',
        },
        beige: {
          DEFAULT: '#242424',
          100: '#FAF8F5',
          200: '#F5F2EB',
          300: '#E8D5B5',
          400: '#303030',
          500: '#242424',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.5rem, 7vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2rem, 5vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(1.65rem, 4vw, 4rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.4rem, 3vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.2rem, 2.5vw, 2.25rem)', { lineHeight: '1.25' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'reveal': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(196, 136, 96, 0.3)' },
          '50%': { boxShadow: '0 0 0 10px rgba(196, 136, 96, 0)' },
        },
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(0, 0, 0, 0.45)',
        'premium-lg': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'gold': '0 4px 14px rgba(197, 160, 89, 0.22)',
        'gold-lg': '0 6px 20px rgba(197, 160, 89, 0.32)',
        'inset-top': 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
