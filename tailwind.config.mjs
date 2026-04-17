/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Adwaita Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrainsMono NF', 'monospace'],
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
