/**
 * Global Accessibility (A11y) Configuration
 *
 * Central configuration for all accessibility features in 黑科易购.
 * This file provides customizable defaults that can be overridden
 * per-environment or user preference.
 *
 * WCAG 2.1 Level AA compliant configuration
 */

// ==================== Type Definitions ====================

export interface A11yConfig {
  /** Focus outline styling */
  focusOutline: FocusOutlineConfig
  /** Animation and motion preferences */
  reduceMotion: ReduceMotionConfig
  /** Font size levels for text scaling */
  fontSizes: FontSizeConfig
  /** Screen reader optimization settings */
  screenReader: ScreenReaderConfig
  /** Keyboard navigation settings */
  keyboardNav: KeyboardNavConfig
  /** Color contrast requirements */
  contrast: ContrastConfig
  /** Announcement settings */
  announcements: AnnouncementConfig
}

export interface FocusOutlineConfig {
  color: string
  width: string
  offset: string
  style: 'solid' | 'dashed' | 'dotted' | 'double'
  radius?: string
}

export interface ReduceMotionConfig {
  respectPrefersReducedMotion: boolean
  fallbackDuration: string
  disableTransitions: boolean
  disableAnimations: boolean
}

export interface FontSizeConfig {
  small: string
  medium: string // Default
  large: string
  xlarge: string
}

export interface ScreenReaderConfig {
  announcePageTitles: boolean
  announceRouteChanges: boolean
  announceErrors: boolean
  politeDelay: number // milliseconds
  assertiveDelay: number // milliseconds
  hideDecorativeContent: boolean
}

export interface KeyboardNavConfig {
  enableShortcuts: boolean
  highlightFocusedItem: boolean
  scrollIntoView: boolean
  focusVisibleIndicator: boolean
  skipLinkTargetId: string
}

export interface ContrastConfig {
  minimumRatioAA: number // Normal text (4.5:1)
  minimumRatioAALarge: number // Large text (3:1)
  minimumRatioAAA: number // Normal text (7:1)
  minimumRatioAAALarge: number // Large text (4.5:1)
  largeTextThreshold: { fontSize: number; fontWeight: number }
  autoCheckEnabled: boolean
}

export interface AnnouncementConfig {
  maxMessages: number
  defaultPriority: 'polite' | 'assertive'
  clearAfterDelay: number // milliseconds
  queueBehavior: 'replace' | 'queue' | 'ignore'
}

// ==================== Main Configuration Export ====================

/**
 * Global accessibility configuration
 *
 * All values are optimized for WCAG 2.1 Level AA compliance.
 * Modify these defaults to match your brand guidelines while
 * maintaining accessibility standards.
 */
export const a11yConfig: A11yConfig = {
  // ==================== Focus Outline ====================
  /**
   * Visual indicator for keyboard-focused elements
   * Implements WCAG 2.4.7 Focus Visible
   */
  focusOutline: {
    // Primary brand color for focus indication
    color: '#003B80',
    // Outline width - visible but not overwhelming
    width: '2px',
    // Space between outline and element
    offset: '2px',
    // Solid line for maximum visibility
    style: 'solid',
    // Optional rounded corners
    radius: '4px'
  },

  // ==================== Reduced Motion ====================
  /**
   * Respect users who prefer reduced motion
   * Implements WCAG 2.3.3 Animation from Interactions
   */
  reduceMotion: {
    // Always check and respect the prefers-reduced-motion media query
    respectPrefersReducedMotion: true,
    // Fallback duration when motion is reduced (essentially instant)
    fallbackDuration: '0.01s',
    // Disable CSS transitions when reduced motion is preferred
    disableTransitions: true,
    // Disable CSS animations when reduced motion is preferred
    disableAnimations: true
  },

  // ==================== Font Sizes ====================
  /**
   * Font size options for text scaling feature
   * Implements WCAG 1.4.4 Resize Text
   *
   * Users can scale text up to 200% without loss of functionality.
   * These sizes are relative to browser's base font size (usually 16px).
   */
  fontSizes: {
    // Small: 14px (-12.5% from default)
    small: '14px',
    // Medium/Default: 16px (100% - browser default)
    medium: '16px',
    // Large: 18px (+12.5% from default)
    large: '18px',
    // Extra Large: 20px (+25% from default)
    xlarge: '20px'
  },

  // ==================== Screen Reader ====================
  /**
   * Optimization for assistive technology users
   * Implements WCAG 4.1.2 Name, Role, Value & 4.1.3 Status Messages
   */
  screenReader: {
    // Announce page titles when navigating
    announcePageTitles: true,
    // Announce route changes for SPAs
    announceRouteChanges: true,
    // Announce form validation errors immediately
    announceErrors: true,
    // Delay before polite announcements (allows batching)
    politeDelay: 100,
    // Delay before assertive announcements (immediate feedback)
    assertiveDelay: 50,
    // Hide decorative content from screen readers by default
    hideDecorativeContent: true
  },

  // ==================== Keyboard Navigation ====================
  /**
   * Keyboard accessibility enhancements
   * Implements WCAG 2.1.1 Keyboard
   */
  keyboardNav: {
    // Enable built-in keyboard shortcuts
    enableShortcuts: true,
    // Visually highlight the currently focused item
    highlightFocusedItem: true,
    // Automatically scroll focused items into view
    scrollIntoView: true,
    // Show enhanced focus indicator via v-focus-visible directive
    focusVisibleIndicator: true,
    // Target ID for skip-to-content link
    skipLinkTargetId: 'main-content'
  },

  // ==================== Color Contrast ====================
  /**
   * Color contrast requirements based on WCAG guidelines
   * Implements WCAG 1.4.3 Contrast (Minimum) & 1.4.6 Contrast (Enhanced)
   */
  contrast: {
    // Minimum contrast ratio for normal text (WCAG AA)
    minimumRatioAA: 4.5,
    // Minimum contrast ratio for large/bold text (WCAG AA)
    minimumRatioAALarge: 3.0,
    // Minimum contrast ratio for normal text (WCAG AAA)
    minimumRatioAAA: 7.0,
    // Minimum contrast ratio for large/bold text (WCAG AAA)
    minimumRatioAAALarge: 4.5,
    // Threshold for considering text as "large"
    largeTextThreshold: {
      fontSize: 18, // 18pt or 24px
      fontWeight: 700 // Bold (700 weight) or 14pt+
    },
    // Enable automatic contrast checking in development
    autoCheckEnabled: import.meta.env?.DEV || false
  },

  // ==================== Announcements ====================
  /**
   * Configuration for ARIA live region announcements
   * Controls how messages are delivered to screen readers
   */
  announcements: {
    // Maximum queued announcements (older ones dropped)
    maxMessages: 10,
    // Default priority level for announcements
    defaultPriority: 'polite',
    // Time in ms after which announcement elements are cleared
    clearAfterDelay: 1000,
    // How to handle multiple rapid announcements
    queueBehavior: 'replace' // Options: 'replace', 'queue', 'ignore'
  }
}

// ==================== Utility Functions ====================

/**
 * Get a specific config value with optional override
 */
export function getA11ySetting<K extends keyof A11yConfig>(
  key: K
): A11yConfig[K] {
  return a11yConfig[key]
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof A11yConfig): boolean {
  const config = a11yConfig[feature]
  return config !== undefined && config !== null && config !== false
}

/**
 * Get CSS custom property value for current font size
 */
export function getFontSizeCSSVar(): string {
  const savedLevel = localStorage.getItem('a11y-font-size-level') as
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | null

  if (savedLevel && a11yConfig.fontSizes[savedLevel]) {
    return a11yConfig.fontSizes[savedLevel]
  }

  return a11yConfig.fontSizes.medium
}

/**
 * Apply all A11y configurations to document root
 * Call this once during app initialization
 */
export function applyGlobalA11ySettings(): void {
  const root = document.documentElement

  // Set base font size
  root.style.setProperty('--base-font-size', getFontSizeCSSVar())

  // Set focus outline custom properties
  root.style.setProperty(
    '--a11y-focus-color',
    a11yConfig.focusOutline.color
  )
  root.style.setProperty(
    '--a11y-focus-width',
    a11yConfig.focusOutline.width
  )
  root.style.setProperty(
    '--a11y-focus-offset',
    a11yConfig.focusOutline.offset
  )
  root.style.setProperty(
    '--a11y-focus-style',
    a11yConfig.focusOutline.style
  )

  // Set animation duration variable (respects reduced motion)
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (prefersReducedMotion && a11yConfig.reduceMotion.respectPrefersReducedMotion) {
    root.style.setProperty(
      '--animation-duration',
      a11yConfig.reduceMotion.fallbackDuration
    )
    root.style.setProperty(
      '--transition-duration',
      a11yConfig.reduceMotion.fallbackDuration
    )
    root.classList.add('reduce-motion')
  }

  console.log('[A11y-Config] Global accessibility settings applied')
}
