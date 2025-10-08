export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        slideDown: 'slideDown 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        blob: 'blob 7s infinite',
        float: 'float 3s ease-in-out infinite',
        spinslow: 'spin 20s linear infinite',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
      },
      colors: {
        pumpkin: {
          50: 'hsl(var(--pumpkin-50) / <alpha-value>)',
          100: 'hsl(var(--pumpkin-100) / <alpha-value>)',
          200: 'hsl(var(--pumpkin-200) / <alpha-value>)',
          300: 'hsl(var(--pumpkin-300) / <alpha-value>)',
          400: 'hsl(var(--pumpkin-400) / <alpha-value>)',
          500: 'hsl(var(--pumpkin-500) / <alpha-value>)',
          600: 'hsl(var(--pumpkin-600) / <alpha-value>)',
          700: 'hsl(var(--pumpkin-700) / <alpha-value>)',
          800: 'hsl(var(--pumpkin-800) / <alpha-value>)',
          900: 'hsl(var(--pumpkin-900) / <alpha-value>)',
          950: 'hsl(var(--pumpkin-950) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
