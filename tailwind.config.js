/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // Includes className strings stored in lib/ data tables — e.g. the
    // premium gradient stops in lib/cosmetics-store.ts NAME_COLORS.
    // Without this, JIT silently drops `from-yellow-200`, `via-amber-400`
    // etc., and `text-transparent` makes the picker swatches invisible.
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pop': 'pop 0.15s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
