/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Palette 2 Semantic Tokens ──
        bg: {
          DEFAULT: '#F7F3EC',
          alt: '#FBF8F2',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#FBF8F2',
        },
        border: {
          DEFAULT: '#E8DFD3',
          soft: '#F0E9DF',
        },
        primary: {
          DEFAULT: '#0B1F3A',
          2: '#1E3A5F',
          soft: '#E7ECF3',
        },
        accent: {
          DEFAULT: '#D4AF37',
          dark: '#B08D57',
          soft: '#F5E9C8',
        },
        blush: {
          DEFAULT: '#F3D9D4',
          dark: '#E8BFB8',
        },
        text: {
          DEFAULT: '#121212',
          strong: '#0B1F3A',
        },
        muted: {
          DEFAULT: '#6B6B6B',
          2: '#9A9A9A',
        },
        success: '#2E7D32',
        warning: '#B7791F',
        error: '#B3261E',
        info: '#1E3A5F',

        // ── Backward Compatible Aliases (Mapped to Palette 2) ──
        charcoal: {
          DEFAULT: '#0B1F3A',
          50: '#F0E9DF',
          100: '#E8DFD3',
          200: '#C9D2DE',
          300: '#9A9A9A',
          400: '#6B6B6B',
          500: '#3A4F6B',
          600: '#1E3A5F',
          700: '#0B1F3A',
          800: '#07162A',
          900: '#040C18',
        },
        ivory: {
          DEFAULT: '#F7F3EC',
          50: '#FFFFFF',
          100: '#FBF8F2',
          200: '#F7F3EC',
          300: '#F0E9DF',
          400: '#E8DFD3',
          500: '#D5CCC0',
        },
        champagne: {
          DEFAULT: '#F5E9C8',
          50: '#FCF8ED',
          100: '#F9F2DD',
          200: '#F5E9C8',
          300: '#E6D39E',
          400: '#D4AF37',
          500: '#B08D57',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FCF8ED',
          100: '#F9F2DD',
          200: '#F5E9C8',
          300: '#E0C163',
          400: '#D4AF37',
          500: '#B08D57',
          600: '#8C6E3D',
          700: '#664F28',
          800: '#423317',
          900: '#211909',
        },
        beige: {
          DEFAULT: '#FBF8F2',
          100: '#FBF8F2',
          200: '#F7F3EC',
          300: '#F0E9DF',
          400: '#E8DFD3',
          500: '#D5CCC0',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(3.5rem, 8vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2.5rem, 5vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.75rem, 3vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.2' }],
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
        },
      },
      boxShadow: {
        'premium': '0 2px 8px rgba(11, 31, 58, 0.04)',
        'premium-lg': '0 8px 24px rgba(11, 31, 58, 0.08)',
        'gold': '0 4px 14px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 6px 18px rgba(212, 175, 55, 0.35)',
        'inset-top': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
