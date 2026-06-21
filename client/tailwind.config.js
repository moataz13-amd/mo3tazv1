/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00E5FF',
        secondary: '#4F46E5',
        background: '#050816',
        surface: 'rgba(11,18,36,0.65)',
        'neon-blue': '#00E5FF',
        'neon-purple': '#7C3AED',
        'neon-cyan': '#00E5FF',
        'glass-border': 'rgba(0, 229, 255, 0.2)',
      },
      fontFamily: {
        sans: ['Milan Display', 'Cairo', 'Inter', 'Outfit', 'sans-serif'],
        display: ['Milan Display', 'Sahara Bold', 'Cairo', 'Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-neon': 'linear-gradient(135deg, #00E5FF 0%, #4F46E5 100%)',
        'gradient-dark': 'linear-gradient(135deg, #050816 0%, #0a0f2c 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(79,70,229,0.05) 100%)',
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 229, 255, 0.4), 0 0 60px rgba(0, 229, 255, 0.15)',
        'neon-sm': '0 0 10px rgba(0, 229, 255, 0.3)',
        'neon-lg': '0 0 40px rgba(0, 229, 255, 0.5), 0 0 120px rgba(0, 229, 255, 0.2)',
        'neon-purple': '0 0 20px rgba(79,70,229,0.4), 0 0 60px rgba(79,70,229,0.15)',
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-lg': '0 25px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'border-flow': 'borderFlow 4s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'slide-in-left': 'slideInLeft 0.5s ease forwards',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,191,255,0.4), 0 0 60px rgba(0,191,255,0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(0,191,255,0.7), 0 0 90px rgba(0,191,255,0.3)' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
};
