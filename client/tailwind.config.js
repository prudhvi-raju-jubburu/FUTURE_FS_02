module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem'
    },
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#0f172a',
        accent: '#10B981',
        surface: '#0f172a'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'card': '0 6px 18px rgba(17,24,39,0.08)',
        'elevated': '0 10px 30px rgba(17,24,39,0.12)'
      }
    }
  },
  plugins: []
}
