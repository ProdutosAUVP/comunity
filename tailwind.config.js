/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'auvp-green': '#023619',
        'auvp-green-dark': '#011F0E',
        'auvp-yellow': '#EFBE4F',
        'auvp-gray': '#F2F2F2',
        'auvp-gray-mid': '#6B6B6B',
        'auvp-chumbo': '#1B1B1B',
      },
      fontFamily: {
        anek: ['"Anek Latin"', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      },
      boxShadow: {
        'auvp-card': '0 8px 24px rgba(0,0,0,0.06)',
      },
      transitionDuration: {
        240: '240ms',
      },
    },
  },
  plugins: [],
}
