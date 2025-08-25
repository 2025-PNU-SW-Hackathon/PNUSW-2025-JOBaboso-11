/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,css}'],
  theme: {
    extend: {
      colors: {
        mainBlue: '#1779FA',
        subSkyBlue: '#00B1FF',
        subDarkBlue: '#00228B',
        subLightBlue: '#E7F3FF',
        white: '#FFFFFF',
        heartOfIce: '#F7FBFE',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      fontSize: {
        h1: ['32px', { lineHeight: '42px', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '34px', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        h4: ['18px', { lineHeight: '26px', fontWeight: '500' }],
        bodyLg: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        bodyMd: ['14px', { lineHeight: '22px', fontWeight: '400' }],
        bodySm: ['12px', { lineHeight: '20px', fontWeight: '400' }],
        caption: ['10px', { lineHeight: '14px', fontWeight: '400' }],
      },
      height: {
        header: '104px',
        sidebar: '1120px',
        footer: '50px',
      },
      width: {
        sidebar: '430px',
        container: '1280px',
      },
      boxShadow: {
        even: '0 0 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
