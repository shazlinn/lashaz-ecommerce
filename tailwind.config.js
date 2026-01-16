// ecommerce/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}',
    './app/components/**/*.{js,ts,jsx,tsx}' // Added this to catch subfolders
  ],
  theme: {
    extend: {
      fontFamily: {
        // Ensure these match the 'variable' strings in your layout.tsx
        sans: ['var(--font-sans)', 'sans-serif'],
        josefin: ['var(--font-josefin)', 'sans-serif'],
        work: ['var(--font-work)', 'sans-serif'],
      },
      fontSize: {
        // Increased the clamp max to 9rem for a bigger editorial look
        'huge': ['clamp(3rem, 12vw, 9rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
      },
    },
  },
  plugins: [],
};