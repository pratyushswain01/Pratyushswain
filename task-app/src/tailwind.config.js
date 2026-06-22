/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // "Mastery Matrix" palette
        ink: {
          DEFAULT: '#0A0A0A',
          soft: '#1C1C1E',
          muted: '#3A3A3C',
        },
        slate: {
          ui: '#8E8E93',
          border: '#D1D1D6',
          surface: '#F2F2F7',
        },
        accent: {
          DEFAULT: '#0066FF',
          hover: '#0052CC',
          subtle: '#EBF2FF',
        },
        status: {
          green: '#00C853',
          amber: '#FF9500',
          red: '#FF3B30',
        },
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
