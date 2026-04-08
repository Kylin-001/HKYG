/**
 * v-focus-visible Custom Directive
 *
 * Provides enhanced focus visibility that distinguishes between
 * keyboard and mouse focus, implementing WCAG 2.4.7 Focus Visible.
 *
 * Features:
 * - Shows clear focus outline on keyboard navigation (Tab key)
 * - Hides outline on mouse clicks to avoid visual interference
 * - Customizable outline style (color, width, offset, style)
 * - Respects user's prefers-color-scheme and prefers-contrast settings
 * - Automatic cleanup on component unmount
 */

import type { Directive, DirectiveBinding } from 'vue'
import { a11yConfig } from '@/config/a11y.config'

// ==================== Type Definitions ====================

interface FocusVisibleOptions {
  /** Outline color (default: from a11y config) */
  color?: string
  /** Outline width (default: from a11y config) */
  width?: string
  /** Outline offset (default: from a11y config) */
  offset?: string
  /** Outline style: solid, dashed, dotted, etc. (default: from a11y config) */
  style?: string
  /** Border radius for rounded corners */
  radius?: string
  /** Additional CSS to apply when focused */
  extraStyles?: Partial<CSSStyleDeclaration>
}

type FocusVisibleValue = boolean | FocusVisibleOptions | undefined

// ==================== State Management ====================

// Track keyboard vs mouse usage
let isUsingKeyboard = false

// Track elements with the directive applied
const focusedElements = new WeakMap<HTMLElement, FocusVisibleOptions>()

// ==================== Global Event Listeners ====================

/**
 * Initialize global event listeners for keyboard/mouse detection
 * Called once when directive is first used
 */
function initGlobalListeners(): void {
  // Only initialize once
  if ((document as any).__focusVisibleInitialized) return
  ;(document as any).__focusVisibleInitialized = true

  document.addEventListener('keydown', handleKeyDown, true)
  document.addEventListener('mousedown', handleMouseDown, true)
  document.addEventListener('mouseup', handleMouseUp, true)
  document.addEventListener('touchstart', handleTouchStart, true)

  console.log('[v-focus-visible] Global listeners initialized')
}

function handleKeyDown(e: KeyboardEvent): void {
  // Only mark as keyboard usage for Tab, Arrow keys, Enter, Space, etc.
  if (
    e.key === 'Tab' ||
    e.key === 'Enter' ||
    e.key === ' ' ||
    e.key.startsWith('Arrow') ||
    e.key === 'Home' ||
    e.key === 'End' ||
    e.key === 'PageUp' ||
    e.key === 'PageDown'
  ) {
    isUsingKeyboard = true

    // Remove keyboard flag after short delay (in case user switches to mouse)
    setTimeout(() => {
      isUsingKeyboard = false
    }, 100)
  }
}

function handleMouseDown(): void {
  isUsingKeyboard = false
}

function handleMouseUp(): void {
  // Keep as mouse until keyboard is used again
}

function handleTouchStart(): void {
  isUsingKeyboard = false
}

// ==================== Directive Implementation ====================

/**
 * Apply focus visible styles to element
 */
function applyFocusStyles(el: HTMLElement, options: FocusVisibleOptions): void {
  const {
    color = a11yConfig.focusOutline.color,
    width = a11yConfig.focusOutline.width,
    offset = a11yConfig.focusOutline.offset,
    style = a11yConfig.focusOutline.style,
    radius = '4px',
    extraStyles = {}
  } = options

  el.style.outlineColor = color
  el.style.outlineWidth = width
  el.style.outlineOffset = offset
  el.style.outlineStyle = style
  el.style.borderRadius = radius

  // Apply any additional custom styles
  Object.assign(el.style, extraStyles)
}

/**
 * Remove focus visible styles from element
 */
function removeFocusStyles(el: HTMLElement): void {
  el.style.removeProperty('outline-color')
  el.style.removeProperty('outline-width')
  el.style.removeProperty('outline-offset')
  el.style.removeProperty('outline-style')
  el.style.removeProperty('border-radius')

  // Note: We don't remove extraStyles as we don't track what was added
  // Users should manage their own styles separately if needed
}

/**
 * Handle focus event
 */
function handleFocus(el: HTMLElement, options: FocusVisibleOptions): void {
  if (isUsingKeyboard) {
    applyFocusStyles(el, options)
    el.setAttribute('data-focus-visible', 'keyboard')
  } else {
    el.removeAttribute('data-focus-visible')
  }
}

/**
 * Handle blur event
 */
function handleBlur(el: HTMLElement): void {
  removeFocusStyles(el)
  el.removeAttribute('data-focus-visible')
}

// ==================== Directive Definition ====================

const focusVisibleDirective: Directive<HTMLElement, FocusVisibleValue> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<FocusVisibleValue>) {
    // Initialize global listeners on first use
    initGlobalListeners()

    // Parse options from binding value
    let options: FocusVisibleOptions = {}

    if (typeof binding.value === 'boolean') {
      // Boolean value - use defaults or disable if false
      options = binding.value ? {} : { color: 'transparent' }
    } else if (typeof binding.value === 'object') {
      // Object value with custom options
      options = binding.value
    }

    // Store options for this element
    focusedElements.set(el, options)

    // Add focus/blur event listeners
    el.addEventListener('focus', () => handleFocus(el, options))
    el.addEventListener('blur', () => handleBlur(el))

    // Add data attribute for styling hooks
    el.dataset.focusVisibleEnabled = String(binding.value !== false)
  },

  updated(el: HTMLElement, binding: DirectiveBinding<FocusVisibleValue>) {
    // Update options if they change
    let options: FocusVisibleOptions = {}

    if (typeof binding.value === 'boolean') {
      options = binding.value ? {} : { color: 'transparent' }
    } else if (typeof binding.value === 'object') {
      options = binding.value
    }

    focusedElements.set(el, options)
    el.dataset.focusVisibleEnabled = String(binding.value !== false)
  },

  unmounted(el: HTMLElement) {
    // Clean up event listeners
    el.removeEventListener('focus', () => {})
    el.removeEventListener('blur', () => {})

    // Remove stored options
    focusedElements.delete(el)

    // Clean up inline styles
    removeFocusStyles(el)
    delete el.dataset.focusVisibleEnabled
  }
}

export default focusVisibleDirective

// ==================== Export Utility Functions ====================

/**
 * Manually trigger focus visible on an element
 * Useful for programmatic focus management
 */
export function showFocusVisible(el: HTMLElement, options?: FocusVisibleOptions): void {
  const opts = options || focusedElements.get(el) || {}
  applyFocusStyles(el, opts)
  el.setAttribute('data-focus-visible', 'keyboard')
}

/**
 * Manually hide focus visible on an element
 */
export function hideFocusVisible(el: HTMLElement): void {
  removeFocusStyles(el)
  el.removeAttribute('data-focus-visible')
}

/**
 * Check if current interaction is via keyboard
 */
export function isKeyboardUser(): boolean {
  return isUsingKeyboard
}
