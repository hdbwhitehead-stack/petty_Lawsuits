import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        muted: 'var(--muted)',
        'muted-2': 'var(--muted-2)',
        'paper-alt': 'var(--paper-alt)',
        border: 'var(--border)',
        accent: 'var(--accent)',
        'accent-dark': 'var(--accent-dark)',
        'accent-tint': 'var(--accent-tint)',
        lemon: 'var(--lemon)',
        'lemon-tint': 'var(--lemon-tint)',
        pink: 'var(--pink)',
        'pink-tint': 'var(--pink-tint)',
        sky: 'var(--sky)',
        'sky-tint': 'var(--sky-tint)',
        grass: 'var(--grass)',
        'grass-tint': 'var(--grass-tint)',
        stamp: 'var(--stamp)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        marker: ['Caveat', 'cursive'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        sticker: '3px 3px 0 #1A1814',
        'sticker-lg': '5px 5px 0 #1A1814',
      },
      borderWidth: {
        '2.5': '2.5px',
      },
    },
  },
  plugins: [],
};
export default config;
