/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ====== 色彩系统 - 科大蓝品牌体系 v3.0 ======
      colors: {
        // 主色系 - 科大蓝 (USTH Primary Blue)
        primary: {
          25: 'var(--color-primary-25)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        
        // 品牌辅助色
        gold: {
          light: 'var(--color-gold-light)',
          DEFAULT: 'var(--color-gold)',
          dark: 'var(--color-gold-dark)',
          bg: 'var(--color-gold-bg)',
        },
        
        crimson: {
          light: 'var(--color-crimson-light)',
          DEFAULT: 'var(--color-crimson)',
          dark: 'var(--color-crimson-dark)',
          bg: 'var(--color-crimson-bg)',
        },
        
        pine: {
          light: 'var(--color-pine-light)',
          DEFAULT: 'var(--color-pine)',
          dark: 'var(--color-pine-dark)',
          bg: 'var(--color-pine-bg)',
        },

        // 语义化颜色 (WCAG AA 合规)
        success: {
          light: 'var(--color-success-light)',
          DEFAULT: 'var(--color-success)',
          dark: 'var(--color-success-dark)',
          bg: 'var(--color-success-bg)',
        },
        warning: {
          light: 'var(--color-warning-light)',
          DEFAULT: 'var(--color-warning)',
          dark: 'var(--color-warning-dark)',
          bg: 'var(--color-warning-bg)',
        },
        error: {
          light: 'var(--color-error-light)',
          DEFAULT: 'var(--color-error)',
          dark: 'var(--color-error-dark)',
          bg: 'var(--color-error-bg)',
        },
        info: {
          light: 'var(--color-info-light)',
          DEFAULT: 'var(--color-info)',
          dark: 'var(--color-info-dark)',
          bg: 'var(--color-info-bg)',
        },

        // 中性色 (学术灰阶)
        surface: {
          DEFAULT: 'var(--color-surface)',
          secondary: 'var(--color-surface-secondary)',
          tertiary: 'var(--color-surface-tertiary)',
          elevated: 'var(--color-surface-elevated)',
        },
        
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          quaternary: 'var(--color-text-quaternary)',
          inverse: 'var(--color-text-inverse)',
          disabled: 'var(--color-text-disabled)',
          link: 'var(--color-text-link)',
        },
        
        border: {
          subtle: 'var(--color-border-subtle)',
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
          focus: 'var(--color-border-focus)',
        },
      },

      // ====== 字体系统 - 高校规范 ======
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
          '"PingFang SC"', '"Microsoft YaHei"', '"Hiragino Sans GB"',
          '"Noto Sans SC"', '"Helvetica Neue"', 'Arial', 'sans-serif'
        ],
        serif: [
          '"Noto Serif SC"', '"SimSun"', '"STSong"',
          'Georgia', '"Times New Roman"', 'serif'
        ],
        mono: [
          '"SF Mono"', 'SFMono-Regular', 'Consolas',
          '"Liberation Mono"', 'Menlo', 'Courier', 'monospace'
        ],
      },

      // ====== 字体尺寸 - 流体排版 ======
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        base: ['1rem', { lineHeight: '1.625', letterSpacing: '0.01em' }],
        lg: ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.005em' }],
        xl: ['1.25rem', { lineHeight: '1.4', letterSpacing: '0em' }],
        '2xl': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        '3xl': ['clamp(1.75rem, 4vw, 1.875rem)', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['clamp(2rem, 5vw, 2.25rem)', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '5xl': ['clamp(2.5rem, 6vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '6xl': ['clamp(3rem, 7vw, 3.75rem)', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
      },

      // ====== 间距系统 ======
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        base: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },

      // ====== 圆角系统 ======
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        full: '9999px',
      },

      // ====== 阴影系统 ======
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        brand: 'var(--shadow-brand)',
        gold: 'var(--shadow-gold)',
        glow: 'var(--shadow-glow)',
        inner: 'var(--shadow-inner)',
      },

      // ====== 动画缓动曲线 ======
      transitionTimingFunction: {
        default: 'var(--ease-default)',
        out: 'var(--ease-out)',
        in: 'var(--ease-in)',
        spring: 'var(--ease-spring)',
        academic: 'var(--ease-academic)',
      },

      // ====== 动画预设 ======
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-down': 'slideDown 0.25s ease-out',
        'slide-left': 'slideLeft 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'spin-slow': 'spin 1s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shake': 'shake 0.5s ease-in-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-40px)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },

      // ====== 响应式断点 ======
      screens: {
        xs: '0px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1400px',
      },

      // ====== Z-Index 层级 ======
      zIndex: {
        base: '0',
        sticky: '10',
        content: '50',
        'back-to-top': '90',
        'nav-header': '100',
        'notification-panel': '150',
        drawer: '200',
        'dialog-overlay': '1000',
        'dialog-content': '1010',
        dialog-popper: '1100',
        toast: '2000',
      },

      // ====== 过渡时间 ======
      transitionDuration: {
        instant: '100ms',
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
        slower: '500ms',
      },

      // ====== 模糊效果 ======
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
