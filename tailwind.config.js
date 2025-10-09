import { colors as defaultColors } from 'tailwindcss/defaultTheme'

export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-destructive)',
        info: 'var(--color-info)',
        success: 'var(--color-success)',
        border: 'var(--color-border)',
        background: 'var(--color-bg)',
        foreground: 'var(--color-text)',
      },
    },
  },
}
