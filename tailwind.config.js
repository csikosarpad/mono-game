/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/**/*.{js,ts,jsx,tsx}',
    './packages/shared/**/*.{js,ts,jsx,tsx}',
    './packages/shared-ui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom colors for better theming
        'game-bg': {
          light: '#f3f4f6',
          dark: '#111827',
        },
        'game-card': {
          light: '#ffffff',
          dark: '#1f2937',
        },
        'game-text': {
          light: '#111827',
          dark: '#f9fafb',
        },
        'game-border': {
          light: '#e5e7eb',
          dark: '#374151',
        },
      },
    },
  },
  plugins: [],
};
