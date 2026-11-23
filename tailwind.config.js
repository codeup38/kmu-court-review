/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Pretendard"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
      },
      colors: {
        canvas: '#f8fafc',
        ink: {
          DEFAULT: '#0f172a',
          secondary: '#334155',
          body: '#475569',
          muted: '#64748b',
        },
        navy: {
          DEFAULT: '#1e3a8a',
          dark: '#172554',
          tint: '#eff6ff',
          border: '#93c5fd',
        },
        crimson: {
          DEFAULT: '#b91c1c',
          dark: '#991b1b',
          tint: '#fef2f2',
          border: '#fca5a5',
        },
        verified: {
          DEFAULT: '#0f766e',
          tint: '#f0fdfa',
          border: '#99f6e4',
        },
      },
    },
  },
  plugins: [],
};
