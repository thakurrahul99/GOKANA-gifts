/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Palette 2 — Core Tokens ──────────────────────────────
        // 60% Neutral (backgrounds, surfaces, borders)
        bg: '#F7F3EC',          // Warm Ivory — page background
        surface: '#FFFFFF',     // Cards, modals, sheets
        'surface-alt': '#FBF8F2', // Alternate section backgrounds
        'border-color': '#E8DFD3', // Borders, dividers
        'border-soft': '#F0E9DF',  // Subtle borders

        // 30% Primary — Midnight Navy (headings, buttons, footer, navbar)
        primary: {
          DEFAULT: '#0B1F3A',   // Midnight Navy — brand core
          2: '#1E3A5F',         // Navy Secondary — hover, gradients
          soft: '#E7ECF3',      // Navy tint for backgrounds
        },

        // 10% Accent — Antique Gold + Blush (CTAs, icons, badges)
        accent: {
          DEFAULT: '#D4AF37',   // Antique Gold — CTA, icons
          dark: '#B08D57',      // Gold hover
          soft: '#F5E9C8',      // Gold tint backgrounds
        },
        blush: {
          DEFAULT: '#F3D9D4',   // Soft rose accent — badges, tags
          dark: '#E8BFB8',
        },

        // Text tokens
        'text-main': '#121212',   // Main body text
        'text-strong': '#0B1F3A', // Headings
        muted: '#6B6B6B',        // Secondary text
        'muted-2': '#9A9A9A',    // Placeholder, disabled

        // Semantic states
        success: '#2E7D32',
        warning: '#B7791F',
        error: '#B3261E',
        info: '#1E3A5F',

        // ── Backwards compat aliases ──────────────────────────────
        // (used by admin pages and any remnant references)
        charcoal: {
          DEFAULT: '#0B1F3A',
          50: '#F5F6F9',
          100: '#E7ECF3',
          200: '#C4D0E3',
          300: '#96AECA',
          400: '#5F7EA3',
          500: '#2E5481',
          600: '#1E3A5F',
          700: '#0B1F3A',
          800: '#071426',
          900: '#030B16',
        },
        ivory: {
          DEFAULT: '#F7F3EC',
          50: '#FDFCF9',
          100: '#F7F3EC',
          200: '#EDE4D8',
          300: '#E2D3C3',
          400: '#D5BFAB',
          500: '#C7A994',
        },
        champagne: {
          DEFAULT: '#F5E9C8',
          50: '#FEFBF3',
          100: '#FBF4E0',
          200: '#F5E9C8',
          300: '#EDDA9F',
          400: '#E3C86D',
          500: '#D4AF37',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FDF8E7',
          100: '#F9EEC4',
          200: '#F0D97A',
          300: '#E5C23B',
          400: '#D4AF37',
          500: '#B08D57',
          600: '#8C6E3E',
          700: '#6B522F',
          800: '#4A3820',
          900: '#2D2213',
        },
        beige: {
          DEFAULT: '#E8DFD3',
          100: '#F7F3EC',
          200: '#E8DFD3',
          300: '#D8C9B7',
          400: '#C5B09A',
          500: '#B09880',
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
        'ticker': 'ticker 25s linear infinite',
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.3)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212,175,55,0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      boxShadow: {
        'premium': '0 2px 8px rgba(11,31,58,0.04)',
        'premium-lg': '0 8px 24px rgba(11,31,58,0.08)',
        'premium-xl': '0 16px 48px rgba(11,31,58,0.12)',
        'gold': '0 4px 14px rgba(212,175,55,0.25)',
        'gold-lg': '0 8px 32px rgba(212,175,55,0.35)',
        'inset-top': 'inset 0 1px 0 rgba(255,255,255,0.1)',
        'card': '0 2px 8px rgba(11,31,58,0.04)',
        'card-hover': '0 8px 24px rgba(11,31,58,0.08)',
      },

      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
