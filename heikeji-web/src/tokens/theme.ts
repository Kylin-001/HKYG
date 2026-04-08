import { ref, computed, watch, type Ref } from 'vue'
import type { ColorTokens } from './colors'
import type { TypographyTokens } from './typography'
import type { SpacingTokens, BorderRadiusTokens, ShadowTokens, BreakpointTokens, ZIndexTokens } from './spacing'
import type { AnimationTokens } from './animation'
import { lightColorTokens, darkColorTokens } from './colors'
import { typographyTokens } from './typography'
import { spacingTokens, borderRadiusTokens, shadowTokens, breakpointTokens, zIndexTokens } from './spacing'
import { animationTokens } from './animation'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeConfig {
  mode: ThemeMode
  primaryColor?: string
  borderRadius?: keyof BorderRadiusTokens
  fontSize?: 'sm' | 'base' | 'lg'
  denseMode?: boolean
}

class ThemeEngine {
  private _mode: Ref<ThemeMode>
  private _config: Ref<ThemeConfig>
  private _customColors: Partial<ColorTokens> = {}

  constructor() {
    const savedMode = (localStorage.getItem('theme-mode') as ThemeMode) || 'system'
    this._mode = ref(savedMode)
    this._config = ref({
      mode: savedMode,
      primaryColor: undefined,
      borderRadius: undefined,
      fontSize: undefined,
      denseMode: false
    })

    if (typeof window !== 'undefined') {
      this.applyTheme()
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this._mode.value === 'system') {
          this.applyTheme()
        }
      })
    }
  }

  get mode(): Ref<ThemeMode> {
    return this._mode
  }

  get config(): Readonly<Ref<ThemeConfig>> {
    return this._config as Readonly<Ref<ThemeConfig>>
  }

  get isDark(): boolean {
    if (this._mode.value === 'dark') return true
    if (this._mode.value === 'light') return false
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  get colors(): ColorTokens {
    const baseColors = this.isDark ? darkColorTokens : lightColorTokens

    if (this._config.value.primaryColor) {
      return {
        ...baseColors,
        primary: this.generatePrimaryScale(this._config.value.primaryColor)
      }
    }

    return { ...baseColors, ...this._customColors }
  }

  get typography(): TypographyTokens {
    return typographyTokens
  }

  get spacing(): SpacingTokens {
    return spacingTokens
  }

  get borderRadius(): BorderRadiusTokens {
    return borderRadiusTokens
  }

  get shadows(): ShadowTokens {
    return shadowTokens
  }

  get breakpoints(): BreakpointTokens {
    return breakpointTokens
  }

  get zIndex(): ZIndexTokens {
    return zIndexTokens
  }

  get animation(): AnimationTokens {
    return animationTokens
  }

  setMode(mode: ThemeMode): void {
    this._mode.value = mode
    this._config.value.mode = mode
    localStorage.setItem('theme-mode', mode)
    this.applyTheme()
  }

  updateConfig(config: Partial<ThemeConfig>): void {
    this._config.value = { ...this._config.value, ...config }
    if (config.mode) {
      this._mode.value = config.mode
      localStorage.setItem('theme-mode', config.mode)
    }
    this.applyTheme()
  }

  setCustomColors(colors: Partial<ColorTokens>): void {
    this._customColors = colors
    this.applyTheme()
  }

  generatePrimaryScale(baseColor: string): ColorTokens['primary'] {
    const hexToHSL = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0
      let s = 0
      const l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6
            break
          case g:
            h = ((b - r) / d + 2) / 6
            break
          case b:
            h = ((r - g) / d + 4) / 6
            break
        }
      }

      return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
    }

    const hslToHex = (h: number, s: number, l: number): string => {
      s /= 100
      l /= 100

      const c = (1 - Math.abs(2 * l - 1)) * s
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
      const m = l - c / 2

      let r = 0
      let g = 0
      let b = 0

      if (h >= 0 && h < 60) {
        r = c; g = x; b = 0
      } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0
      } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x
      } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c
      } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c
      } else if (h >= 300 && h < 360) {
        r = c; g = 0; b = x
      }

      const toHex = (n: number): string => {
        const hex = Math.round((n + m) * 255).toString(16)
        return hex.length === 1 ? `0${hex}` : hex
      }

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    const [h, s, l] = hexToHSL(baseColor)

    return {
      50: hslToHex(h, s, 97),
      100: hslToHex(h, s, 93),
      200: hslToHex(h, s, 83),
      300: hslToHex(h, s, 72),
      400: hslToHex(h, s, 60),
      500: baseColor,
      600: hslToHex(h, s + 10, l - 8),
      700: hslToHex(h, s + 15, l - 15),
      800: hslToHex(h, s + 15, l - 20),
      900: hslToHex(h, s + 20, l - 25),
      950: hslToHex(h, s + 25, l - 30)
    }
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const isDark = this.isDark

    root.classList.toggle('dark', isDark)
    root.setAttribute('data-theme', isDark ? 'dark' : 'light')

    const colors = this.colors

    Object.entries(colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value)
    })

    root.style.setProperty('--color-success', colors.success.DEFAULT)
    root.style.setProperty('--color-warning', colors.warning.DEFAULT)
    root.style.setProperty('--color-danger', colors.danger.DEFAULT)
    root.style.setProperty('--color-info', colors.info.DEFAULT)

    Object.entries(colors.neutral).forEach(([key, value]) => {
      root.style.setProperty(`--color-neutral-${key}`, value)
    })
  }

  getTokenValue(category: 'spacing' | 'borderRadius', token: string): string {
    switch (category) {
      case 'spacing':
        return (spacingTokens as Record<string, string>)[token] || token
      case 'borderRadius':
        return (borderRadiusTokens as Record<string, string>)[token] || token
      default:
        return token
    }
  }
}

export const themeEngine = new ThemeEngine()
export type { ThemeConfig, ThemeMode }
