export interface AnimationTokens {
  duration: {
    fast: string
    normal: string
    slow: string
  }
  easing: {
    default: string
    linear: string
    easeIn: string
    easeOut: string
    easeInOut: string
    bounce: string
  }
}

export const animationTokens: AnimationTokens = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
}

export interface TransitionPresets {
  fade: string
  'fade-up': string
  'fade-down': string
  'fade-left': string
  'fade-right': string
  scale: string
  slide: string
  bounce: string
  shake: string
  pulse: string
  spin: string
}

export const transitionPresets: TransitionPresets = {
  fade: 'opacity 0.3s ease-in-out',
  'fade-up': 'opacity 0.3s ease-out, transform 0.3s ease-out',
  'fade-down': 'opacity 0.3s ease-out, transform 0.3s ease-out',
  'fade-left': 'opacity 0.3s ease-out, transform 0.3s ease-out',
  'fade-right': 'opacity 0.3s ease-out, transform 0.3s ease-out',
  scale: 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  slide: 'transform 0.3s ease-in-out',
  bounce: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  shake: 'translateX 0.5s ease-in-out',
  pulse: 'transform 0.3s ease-in-out',
  spin: 'transform 0.5s linear'
}
