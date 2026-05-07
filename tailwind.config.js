/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0d0f12',
          800: '#13161b',
          700: '#1b1f26',
          600: '#252a33',
          500: '#3a4150',
          400: '#5b6372',
          300: '#8a93a3',
          200: '#c7ccd6',
          100: '#eef0f5',
        },
        accent: {
          500: '#7c8cff',
          400: '#a4b0ff',
          600: '#5a6cea',
        },
        good: '#3fbf7f',
        warn: '#f0b240',
        bad: '#e3556a',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
