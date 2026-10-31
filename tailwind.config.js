/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lacviet: {
          brown: {
            DEFAULT: '#543310',
            light: '#6F441E',
            dark: '#3B220C',
            deep: '#2E1A09',
            warm: '#7D4D24',
          },
          red: {
            DEFAULT: '#543310',
            light: '#6F441E',
            dark: '#3B220C',
            wine: '#2E1A09',
          },
          gold: {
            DEFAULT: '#C5A059',
            light: '#E5C07B',
            dark: '#9A7730',
            royal: '#D4AF37',
            glow: '#F6E5B8',
          },
          cream: {
            DEFAULT: '#FAF6EE',
            paper: '#F4EFE6',
            pure: '#FDFBF7',
            card: '#FFFDF9',
          },
          navy: {
            DEFAULT: '#16192B',
            surface: '#1E2438',
            deep: '#0F121E',
          },
          card: {
            knowledge: '#2563EB', // Thẻ Kiến thức - Xanh tri thức
            festival: '#D97706',  // Thẻ Lễ hội - Vàng cam hội hè
            market: '#059669',    // Thẻ Thị trường - Xanh ngọc
            challenge: '#DC2626', // Thẻ Thử thách - Đỏ rực
          }
        }
      },
      fontFamily: {
        display: ['Cinzel', 'Playfair Display', 'Merriweather', 'serif'],
        sans: ['Be Vietnam Pro', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(197, 160, 89, 0.45)',
        'red-glow': '0 0 15px rgba(84, 51, 16, 0.45)',
        'brown-glow': '0 0 15px rgba(84, 51, 16, 0.45)',
        'card': '0 4px 14px 0 rgba(0, 0, 0, 0.08)',
        'board': '0 10px 30px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}

