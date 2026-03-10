/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#131315',
        card: '#1c1c1e',
        'card-hover': '#242427',
        primary: '#a3e635', // vibrant green
        'primary-hover': '#84cc16',
        secondary: '#22c55e', 
        muted: '#52525b',
        'muted-foreground': '#a1a1aa',
        border: '#27272a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
