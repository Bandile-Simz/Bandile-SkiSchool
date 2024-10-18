/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'hero-btn': 'rgba(255, 0, 0, 0.7)', // Read More Button color
        'hero-btn-hover': '#ff6347', // Read More Button hover color
        'nav-bg': 'rgba(0, 0, 0, 0.4)', // Navbar scrolled background
        'nav-link-hover': 'white', // Nav link hover effect
      },
      animation: {
        fadeIn: 'fadeIn 1.5s ease-out forwards',
        slideInRight: 'slideInRight 0.3s ease',
        slideInLeft: 'slideInLeft 0.3s ease',
        typing: 'typing 4s steps(40, end) 1s normal both',
        blinkCaret: 'blink-caret 0.75s step-end infinite',
        unveil: 'unveil 3.5s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blinkCaret: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#fff' },
        },
        unveil: {
          '0%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
