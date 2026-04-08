export interface SpacingTokens {
  0: string
  0.5: string
  1: string
  1.5: string
  2: string
  2.5: string
  3: string
  4: string
  5: string
  6: string
  8: string
  10: string
  12: string
  16: string
  20: string
  24: string
  32: string
  40: string
  48: string
  56: string
  64: string
  72: string
  80: string
  96: string
}

export const spacingTokens: SpacingTokens = {
  '0': '0px',
  '0.5': '2px',
  '1': '4px',
  '1.5': '6px',
  '2': '8px',
  '2.5': '10px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '20': '80px',
  '24': '96px',
  '32': '128px',
  '40': '160px',
  '48': '192px',
  '56': '224px',
  '64': '256px',
  '72': '288px',
  '80': '320px',
  '96': '384px'
}

export interface BorderRadiusTokens {
  none: string
  sm: string
  DEFAULT: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  full: string
}

export const borderRadiusTokens: BorderRadiusTokens = {
  none: '0px',
  sm: '2px',
  DEFAULT: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px'
}

export interface ShadowTokens {
  xs: string
  sm: string
  DEFAULT: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
  none: string
}

export const shadowTokens: ShadowTokens = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000'
}

export interface BreakpointTokens {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

export const breakpointTokens: BreakpointTokens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export interface ZIndexTokens {
  hide: number
  dropdown: number
  sticky: number
  fixed: number
  'modal-backdrop': number
  modal: number
  popover: number
  tooltip: number
  max: number
}

export const zIndexTokens: ZIndexTokens = {
  hide: -1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  'modal-backdrop': 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  max: 9999
}
