/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'chart-bg': '#1a1a2e',
        'panel-bg': '#16213e',
        'accent': '#0f3460',
        'bullish': '#26a69a',
        'bearish': '#ef5350',
      }
    },
  },
  plugins: [],
}
