/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        elev: 'var(--elev)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        fg: 'var(--fg)',
        'fg-muted': 'var(--fg-muted)',
        'fg-subtle': 'var(--fg-subtle)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        primary: 'var(--primary)',
        'primary-2': 'var(--primary-2)',
        'on-primary': 'var(--on-primary)',
        profit: 'var(--profit)',
        loss: 'var(--loss)',
        ai: 'var(--ai)',
        roas: 'var(--roas)',
        ring: 'var(--ring)'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }]
      },
      boxShadow: {
        glow: 'var(--glow)',
        card: 'var(--glass-shadow)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both'
      }
    }
  },
  plugins: []
}
