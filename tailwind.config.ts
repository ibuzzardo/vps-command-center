import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B1120',
        foreground: '#F9FAFB',
        card: '#111827',
        'card-foreground': '#F9FAFB',
        primary: '#3B82F6',
        'primary-foreground': '#FFFFFF',
        secondary: '#9CA3AF',
        'secondary-foreground': '#F9FAFB',
        muted: '#374151',
        'muted-foreground': '#9CA3AF',
        accent: '#3B82F6',
        'accent-foreground': '#FFFFFF',
        destructive: '#EF4444',
        'destructive-foreground': '#FFFFFF',
        border: '#374151',
        input: '#374151',
        ring: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px'
      }
    },
  },
  plugins: [],
}

export default config