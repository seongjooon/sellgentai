/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './entrypoints/**/*.{js,ts,jsx,tsx,html}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          primary: '#00D084',
          'primary-dark': '#00B872',
          secondary: '#FF6B35',
          danger: '#FF3B30',
          warning: '#FFB84D',
        },
        // Backgrounds - Dark Mode
        bg: {
          primary: '#0A0E14',
          secondary: '#151921',
          tertiary: '#1E2430',
          elevated: '#252C3A',
          card: '#1C1F26',
        },
        // Text
        text: {
          primary: '#FFFFFF',
          secondary: '#8B92A0',
          tertiary: '#5A6170',
        },
        // Borders
        border: {
          DEFAULT: '#2D3340',
          light: '#3A4252',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '20px',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
        md: '0 4px 16px rgba(0, 0, 0, 0.4)',
        lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
        glow: '0 0 0 3px rgba(0, 208, 132, 0.1)',
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'value-appear': 'valueAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'progress-slide': 'progressSlide 1.2s ease-out',
        'badge-pop': 'badgePop 0.5s ease-out 0.3s both',
        loading: 'loading 1.5s ease-in-out infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        valueAppear: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        progressSlide: {
          from: { width: '0%' },
        },
        badgePop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        loading: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
