/**
 * Enhanced Accessibility (A11y) Composable for 黑科易购
 *
 * Provides comprehensive accessibility features including:
 * - Focus management and trapping (for modals/dialogs)
 * - Screen reader announcements via ARIA live regions
 * - Keyboard navigation enhancements
 * - Color contrast ratio checking (WCAG compliance)
 * - Font size adjustment utilities
 * - Reduced motion detection and support
 *
 * WCAG 2.1 Level AA compliant
 */

import { ref, onMounted, onUnmounted, watch } from 'vue'
import { a11yConfig } from '@/config/a11y.config'

// ==================== Type Definitions ====================

export interface FocusTrapOptions {
  /** Whether to auto-focus the first element when trap is activated */
  autoFocus?: boolean
  /** Whether to return focus to previously focused element when trap is released */
  returnFocus?: boolean
  /** Additional elements to include in focusable set */
  additionalSelectors?: string[]
}

export interface KeyboardNavigationConfig {
  /** Enable/disable keyboard shortcuts */
  enabled?: boolean
  /** Custom key bindings */
  bindings?: KeyboardBinding[]
  /** Container to scope keyboard events to */
  container?: HTMLElement | null
  /** Callback when a shortcut is triggered */
  onShortcut?: (action: string, event: KeyboardEvent) => void
}

export interface KeyboardBinding {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  action: string
  description?: string
  preventDefault?: boolean
}

export interface ContrastResult {
  ratio: number
  passesAA: boolean
  passesAAA: boolean
  passesAALarge: boolean
  passesAAALarge: boolean
  fgColor: string
  bgColor: string
}

export type FontSizeLevel = 'small' | 'medium' | 'large' | 'xlarge'

export interface AnnouncementPriority {
  polite: 'polite'
  assertive: 'assertive'
}

type AnnouncementPriorityValue = AnnouncementPriority[keyof AnnouncementPriority]

// ==================== State Management ====================

let activeFocusTrapCleanup: (() => void) | null = null
let previousActiveElement: Element | null = null
let keyboardListeners: Array<{ element: HTMLElement | Document; handler: (e: KeyboardEvent) => void }> = []
let announcementElement: HTMLDivElement | null = null

const currentFontSize = ref<FontSizeLevel>('medium')
const prefersReducedMotion = ref(false)

// ==================== Focus Management ====================

/**
 * Trap focus within a container element (essential for modals/dialogs)
 * Implements WCAG 2.4.3 Focus Order and 2.1.1 Keyboard
 */
function trapFocus(container: HTMLElement, options: FocusTrapOptions = {}): void {
  const {
    autoFocus = true,
    returnFocus = true,
    additionalSelectors = []
  } = options

  // Store reference to currently focused element for restoration later
  if (returnFocus) {
    previousActiveElement = document.activeElement
  }

  // Get all focusable elements within container
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
    ...additionalSelectors
  ].join(', ')

  const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector)

  if (focusableElements.length === 0) {
    console.warn('[useA11y] No focusable elements found in container')
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  // Auto-focus first element if requested
  if (autoFocus) {
    // Use setTimeout to ensure DOM is ready
    requestAnimationFrame(() => {
      firstElement.focus()
    })
  }

  /**
   * Handle Tab key to cycle through focusable elements
   */
  function handleTabKey(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift+Tab: If at first element, wrap to last
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab: If at last element, wrap to first
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  // Add event listener
  container.addEventListener('keydown', handleTabKey)

  // Create cleanup function
  activeFocusTrapCleanup = () => {
    container.removeEventListener('keydown', handleTabKey)

    // Restore previous focus if needed
    if (returnFocus && previousActiveElement instanceof HTMLElement) {
      previousActiveElement.focus()
      previousActiveElement = null
    }

    activeFocusTrapCleanup = null
  }
}

/**
 * Release the current focus trap
 */
function releaseFocus(): void {
  if (activeFocusTrapCleanup) {
    activeFocusTrapCleanup()
  }
}

/**
 * Focus the first focusable element in a container
 */
function focusFirstElement(container: HTMLElement): boolean {
  const focusableElements = getFocusableElements(container)

  if (focusableElements.length > 0) {
    focusableElements[0].focus()
    return true
  }

  return false
}

/**
 * Focus the last focusable element in a container
 */
function focusLastElement(container: HTMLElement): boolean {
  const focusableElements = getFocusableElements(container)

  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus()
    return true
  }

  return false
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ')

  return Array.from(container.querySelectorAll<HTMLElement>(selector))
}

// ==================== Screen Reader Announcements ====================

/**
 * Announce message to screen readers using ARIA live region
 * Implements WCAG 4.1.3 Status Messages
 */
function announceToScreenReader(
  message: string,
  priority: AnnouncementPriorityValue = 'polite'
): void {
  // Ensure announcement element exists
  if (!announcementElement) {
    createAnnouncementRegion()
  }

  if (!announcementElement) return

  // Clear previous content
  announcementElement.textContent = ''

  // Set priority
  announcementElement.setAttribute('aria-live', priority)

  // Set new message (triggers screen reader announcement)
  requestAnimationFrame(() => {
    announcementElement!.textContent = message
  })

  // Auto-remove after announcement (with delay for screen readers)
  setTimeout(() => {
    if (announcementElement && announcementElement.textContent === message) {
      announcementElement.textContent = ''
    }
  }, 1000)
}

/**
 * Create hidden ARIA live region for announcements
 */
function createAnnouncementRegion(): void {
  const existing = document.getElementById('a11y-announcement-region')

  if (existing) {
    announcementElement = existing as HTMLDivElement
    return
  }

  announcementElement = document.createElement('div')
  announcementElement.id = 'a11y-announcement-region'
  announcementElement.setAttribute('role', 'status')
  announcementElement.setAttribute('aria-live', 'polite')
  announcementElement.setAttribute('aria-atomic', 'true')
  announcementElement.className = 'sr-only'

  // Ensure sr-only styles are applied
  Object.assign(announcementElement.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0'
  })

  document.body.appendChild(announcementElement)
}

// ==================== Keyboard Navigation ====================

/**
 * Setup enhanced keyboard navigation with custom shortcuts
 * Implements WCAG 2.1.1 Keyboard
 */
function setupKeyboardNavigation(config: KeyboardNavigationConfig): () => void {
  const {
    enabled = true,
    bindings = [],
    container = document,
    onShortcut
  } = config

  if (!enabled) return () => {}

  // Default keyboard shortcuts
  const defaultBindings: KeyboardBinding[] = [
    { key: 'Escape', action: 'close', description: '关闭弹窗/菜单', preventDefault: true },
    { key: 'Enter', action: 'activate', description: '激活当前项' },
    { key: ' ', action: 'activate-space', description: '激活/切换（空格键）', preventDefault: true },
    { key: 'ArrowUp', action: 'navigate-up', description: '向上导航' },
    { key: 'ArrowDown', action: 'navigate-down', description: '向下导航' },
    { key: 'ArrowLeft', action: 'navigate-left', description: '向左导航' },
    { key: 'ArrowRight', action: 'navigate-right', description: '向右导航' },
    { key: 'Home', action: 'navigate-first', description: '跳转到首项', preventDefault: true },
    { key: 'End', action: 'navigate-last', description: '跳转到末项', preventDefault: true },
    { key: 'PageUp', action: 'page-up', description: '向上翻页', preventDefault: true },
    { key: 'PageDown', action: 'page-down', description: '向下翻页', preventDefault: true }
  ]

  const allBindings = [...defaultBindings, ...bindings]

  function handleKeyDown(e: KeyboardEvent): void {
    const matchingBinding = allBindings.find(binding => {
      return (
        e.key.toLowerCase() === binding.key.toLowerCase() &&
        !!e.ctrlKey === !!binding.ctrlKey &&
        !!e.shiftKey === !!binding.shiftKey &&
        !!e.altKey === !!binding.altKey &&
        !!e.metaKey === !!binding.metaKey
      )
    })

    if (matchingBinding) {
      if (matchingBinding.preventDefault !== false) {
        e.preventDefault()
        e.stopPropagation()
      }

      onShortcut?.(matchingBinding.action, e)

      // Dispatch custom event for other listeners
      window.dispatchEvent(new CustomEvent('a11y-keyboard-shortcut', {
        detail: {
          action: matchingBinding.action,
          binding: matchingBinding,
          originalEvent: e
        }
      }))
    }
  }

  container.addEventListener('keydown', handleKeyDown)
  keyboardListeners.push({ element: container as HTMLElement, handler: handleKeyDown })

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown)
    keyboardListeners = keyboardListeners.filter(
      listener => listener.handler !== handleKeyDown
    )
  }
}

// ==================== Color Contrast Checking ====================

/**
 * Check color contrast ratio against WCAG guidelines
 * Implements WCAG 1.4.3 Contrast (Minimum) and 1.4.6 Contrast (Enhanced)
 */
function checkContrastRatio(fgColor: string, bgColor: string): ContrastResult {
  // Parse colors to RGB
  const fgRGB = parseColor(fgColor)
  const bgRGB = parseColor(bgColor)

  // Calculate relative luminance
  const fgLuminance = getRelativeLuminance(fgRGB)
  const bgLuminance = getRelativeLuminance(bgRGB)

  // Calculate contrast ratio
  const lighter = Math.max(fgLuminance, bgLuminance)
  const darker = Math.min(fgLuminance, bgLuminance)
  const ratio = (lighter + 0.05) / (darker + 0.05)

  // Check WCAG compliance (rounded to 2 decimal places)
  const roundedRatio = Math.round(ratio * 100) / 100

  return {
    ratio: roundedRatio,
    passesAA: roundedRatio >= 4.5,
    passesAAA: roundedRatio >= 7,
    passesAALarge: roundedRatio >= 3,
    passesAAALarge: roundedRatio >= 4.5,
    fgColor,
    bgColor
  }
}

/**
 * Parse color string to RGB values
 */
function parseColor(color: string): { r: number; g: number; b: number } {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1)

    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16)
      }
    }

    if (hex.length === 6 || hex.length === 8) {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      }
    }
  }

  // Handle rgb/rgba colors
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)

  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    }
  }

  // Default to black
  return { r: 0, g: 0, b: 0 }
}

/**
 * Calculate relative luminance per WCAG formula
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const normalize = (c: number) => {
    const sRGB = c / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  }

  return 0.2126 * normalize(rgb.r) + 0.7152 * normalize(rgb.g) + 0.0722 * normalize(rgb.b)
}

// ==================== Font Size Management ====================

/**
 * Get current font size level
 */
function getFontSize(): FontSizeLevel {
  return currentFontSize.value
}

/**
 * Set font size level and update CSS variable
 * Implements WCAG 1.4.4 Resize Text
 */
function setFontSize(level: FontSizeLevel): void {
  currentFontSize.value = level

  // Save preference to localStorage
  try {
    localStorage.setItem('a11y-font-size-level', level)
  } catch (error) {
    console.warn('[useA11y] Failed to save font size preference:', error)
  }

  // Update CSS variable on root element
  const fontSize = a11yConfig.fontSizes[level]
  document.documentElement.style.setProperty('--base-font-size', fontSize)

  // Announce change to screen readers
  announceToScreenReader(`字体大小已调整为${getFontSizeLabel(level)}`)
}

/**
 * Load saved font size preference
 */
function loadFontSizePreference(): void {
  try {
    const saved = localStorage.getItem('a11y-font-size-level') as FontSizeLevel | null

    if (saved && a11yConfig.fontSizes[saved]) {
      setFontSize(saved)
    } else {
      // Apply default font size
      document.documentElement.style.setProperty(
        '--base-font-size',
        a11yConfig.fontSizes.medium
      )
    }
  } catch (error) {
    console.warn('[useA11y] Failed to load font size preference:', error)
  }
}

/**
 * Get localized label for font size level
 */
function getFontSizeLabel(level: FontSizeLevel): string {
  const labels: Record<FontSizeLevel, string> = {
    small: '小',
    medium: '中（默认）',
    large: '大',
    xlarge: '特大'
  }

  return labels[level]
}

// ==================== Reduced Motion Detection ====================

/**
 * Check if user prefers reduced motion
 * Implements WCAG 2.3.3 Animation from Interactions
 */
function checkPrefersReducedMotion(): boolean {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches
  return mediaQuery.matches
}

/**
 * Listen for reduced motion preference changes
 */
function onReducedMotionChange(callback: (prefersReduced: boolean) => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  const handler = (event: MediaQueryListEvent) => {
    prefersReducedMotion.value = event.matches
    callback(event.matches)
  }

  mediaQuery.addEventListener('change', handler)

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handler)
  }
}

// ==================== Composable Export ====================

export function useA11y() {
  // Initialize on mount
  onMounted(() => {
    // Load font size preference
    loadFontSizePreference()

    // Check reduced motion preference
    checkPrefersReducedMotion()

    // Create announcement region
    createAnnouncementRegion()

    // Listen for reduced motion changes
    onReducedMotionChange((reduced) => {
      if (reduced) {
        announceToScreenReader('已启用减少动画模式')
      }
    })
  })

  // Cleanup on unmount
  onUnmounted(() => {
    releaseFocus()

    // Remove all keyboard listeners
    keyboardListeners.forEach(({ element, handler }) => {
      element.removeEventListener('keydown', handler)
    })
    keyboardListeners = []

    // Clean up announcement element
    if (announcementElement && announcementElement.parentNode) {
      announcementElement.parentNode.removeChild(announcementElement)
      announcementElement = null
    }
  })

  // Watch for font size changes
  watch(currentFontSize, (newLevel) => {
    const fontSize = a11yConfig.fontSizes[newLevel]
    document.documentElement.style.setProperty('--base-font-size', fontSize)
  })

  return {
    // Focus management
    trapFocus,
    releaseFocus,
    focusFirstElement,
    focusLastElement,

    // Screen reader announcements
    announceToScreenReader,

    // Keyboard navigation
    setupKeyboardNavigation,

    // Color contrast checking
    checkContrastRatio,

    // Font size management
    getFontSize,
    setFontSize,
    currentFontSize,

    // Reduced motion
    prefersReducedMotion,
    checkPrefersReducedMotion,
    onReducedMotionChange
  }
}
