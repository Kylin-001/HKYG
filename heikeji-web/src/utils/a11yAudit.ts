/**
 * A11y Audit Tool for 黑科易购
 *
 * Development utility for running comprehensive accessibility audits.
 * Automatically runs in development mode to catch A11y issues early.
 *
 * Checks include:
 * - Image alt text presence
 * - Form label associations
 * - Button accessible names
 * - Heading hierarchy (h1-h6 order)
 * - Color contrast ratios
 * - ARIA attribute correctness
 * - Keyboard accessibility
 * - Skip links existence
 * - Language attribute declaration
 *
 * Usage:
 * ```typescript
 * import { runA11yAudit } from '@/utils/a11yAudit'
 *
 * // Run full audit
 * const report = await runA11yAudit()
 * console.log(report)
 * ```
 */

// ==================== Type Definitions ====================

export interface AuditIssue {
  id: string
  severity: 'error' | 'warning' | 'info'
  category: string
  rule: string
  description: string
  element?: HTMLElement
  selector?: string
  suggestion?: string
  wcagCriterion?: string
}

export interface AuditReport {
  timestamp: Date
  url: string
  totalIssues: number
  errors: number
  warnings: number
  info: number
  issues: AuditIssue[]
  score: number // 0-100, higher is better
  summary: {
    imagesWithoutAlt: number
    formsWithoutLabels: number
    buttonsWithoutName: number
    headingOrderIssues: number
    contrastFailures: number
    ariaIssues: number
    keyboardIssues: number
    missingSkipLinks: boolean
    missingLangAttribute: boolean
  }
}

export interface AuditOptions {
  /** Include contrast checks (slower) */
  checkContrast?: boolean
  /** Log results to console */
  consoleOutput?: boolean
  /** Show visual overlay panel */
  showPanel?: boolean
  /** Specific elements to audit (default: document.body) */
  container?: HTMLElement | null
  /** Rules to exclude */
  excludeRules?: string[]
}

// ==================== Default Options ====================

const DEFAULT_OPTIONS: AuditOptions = {
  checkContrast: true,
  consoleOutput: true,
  showPanel: false,
  container: null,
  excludeRules: []
}

// ==================== Main Audit Function ====================

/**
 * Run a complete accessibility audit on the page
 */
export async function runA11yAudit(options: Partial<AuditOptions> = {}): Promise<AuditReport> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const container = opts.container || document.body

  const startTime = performance.now()
  const issues: AuditIssue[] = []

  // Run all audit checks
  await Promise.all([
    checkImageAltText(container, issues),
    checkFormLabels(container, issues),
    checkButtonAccessibleNames(container, issues),
    checkHeadingHierarchy(container, issues),
    ...(opts.checkContrast ? [checkColorContrast(container, issues)] : []),
    checkARIAAttributes(container, issues),
    checkKeyboardAccessibility(container, issues),
    checkSkipLinks(issues),
    checkLanguageAttribute(issues),
    checkFocusManagement(issues)
  ])

  // Calculate report
  const endTime = performance.now()
  const duration = Math.round(endTime - startTime)

  const report = generateReport(issues, opts, duration)

  // Output results
  if (opts.consoleOutput) {
    logToConsole(report)
  }

  if (opts.showPanel) {
    showVisualPanel(report)
  }

  return report
}

// ==================== Individual Check Functions ====================

/**
 * Check 1: Images must have alt text (WCAG 1.1.1 Non-text Content)
 */
async function checkImageAltText(
  container: HTMLElement,
  issues: AuditIssue[]
): Promise<void> {
  const images = container.querySelectorAll<HTMLImageElement>('img')

  images.forEach((img, index) => {
    // Skip decorative images with empty alt
    if (img.alt === '' && img.getAttribute('role') === 'presentation') {
      return // This is intentional decorative image
    }

    if (!img.hasAttribute('alt')) {
      issues.push({
        id: `img-no-alt-${index}`,
        severity: 'error',
        category: 'Images',
        rule: 'img-alt',
        description: `Image missing alt text: ${img.src.substring(0, 50)}...`,
        element: img,
        selector: generateSelector(img),
        suggestion: 'Add descriptive alt text or alt="" for decorative images',
        wcagCriterion: '1.1.1'
      })
    }
  })
}

/**
 * Check 2: Form inputs must have associated labels (WCAG 3.3.2 Labels or Instructions)
 */
async function checkFormLabels(
  container: HTMLElement,
  issues: AuditIssue[]
): Promise<void> {
  const inputs = container.querySelectorAll<HTMLElement>(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), textarea, select'
  )

  inputs.forEach((input, index) => {
    const hasLabel =
      input.id && container.querySelector(`label[for="${input.id}"]`) ||
      input.closest('label') ||
      input.getAttribute('aria-label') ||
      input.getAttribute('aria-labelledby')

    if (!hasLabel) {
      issues.push({
        id: `form-no-label-${index}`,
        severity: 'error',
        category: 'Forms',
        rule: 'label',
        description: `Form element without associated label: <${input.tagName.toLowerCase()}>`,
        element: input,
        selector: generateSelector(input),
        suggestion: 'Add a label element with matching "for" attribute, wrap in label, or use aria-label/aria-labelledby',
        wcagCriterion: '3.3.2'
      })
    }
  })
}

/**
 * Check 3: Buttons must have accessible names (WCAG 4.1.2 Name, Role, Value)
 */
async function checkButtonAccessibleNames(
  container: HTMLElement,
  issues: AuditIssue[]
): Promise<void> {
  const buttons = container.querySelectorAll<HTMLElement>(
    'button, [role="button"], input[type="submit"], input[type="button"], input[type="reset"]'
  )

  buttons.forEach((btn, index) => {
    const accessibleName =
      btn.textContent?.trim() ||
      btn.getAttribute('aria-label') ||
      btn.getAttribute('title') ||
      (btn as HTMLInputElement).value?.trim()

    if (!accessibleName) {
      issues.push({
        id: `btn-no-name-${index}`,
        severity: 'error',
        category: 'Buttons',
        rule: 'button-name',
        description: `Button/interactive element without accessible name`,
        element: btn,
        selector: generateSelector(btn),
        suggestion: 'Add text content, aria-label, or title attribute',
        wcagCriterion: '4.1.2'
      })
    }
  })
}

/**
 * Check 4: Heading hierarchy must be logical (WCAG 1.3.1 Info and Relationships)
 */
async function checkHeadingHierarchy(
  container: HTMLElement,
  issues: AuditIssue[]
): Promise<void> {
  const headings = Array.from(container.querySelectorAll<HTMLHeadingElement>(
    'h1, h2, h3, h4, h5, h6'
  ))

  let previousLevel = 0

  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.charAt(1))

    // Check that heading levels don't skip more than one level
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      issues.push({
        id: `heading-skip-${index}`,
        severity: 'warning',
        category: 'Headings',
        rule: 'heading-order',
        description: `Heading level skipped from h${previousLevel} to h${currentLevel}: "${heading.textContent?.trim().substring(0, 30)}"`,
        element: heading,
        selector: generateSelector(heading),
        suggestion: `Consider adding an h${previousLevel + 1} heading between h${previousLevel} and h${currentLevel}`,
        wcagCriterion: '1.3.1'
      })
    }

    // Check for multiple h1s (should typically only be one per page)
    if (currentLevel === 1 && headings.filter(h => h.tagName === 'H1').length > 1) {
      // Only warn once for multiple h1s
      if (headings.indexOf(heading) === headings.findIndex(h => h.tagName === 'H1')) {
        issues.push({
          id: `multiple-h1-${index}`,
          severity: 'warning',
          category: 'Headings',
          rule: 'single-h1',
          description: 'Multiple H1 headings found on page',
          element: heading,
          selector: generateSelector(heading),
          suggestion: 'Consider using a single H1 for the main page title and H2+ for subheadings',
          wcagCriterion: '1.3.1'
        })
      }
    }

    previousLevel = currentLevel
  })

  // Warn if no headings found at all
  if (headings.length === 0) {
    issues.push({
      id: 'no-headings',
      severity: 'warning',
      category: 'Headings',
      rule: 'headings-exist',
      description: 'No heading elements found on page',
      suggestion: 'Use semantic headings (h1-h6) to structure your content',
      wcagCriterion: '1.3.1'
    })
  }
}

/**
 * Check 5: Color contrast ratios meet WCAG standards (WCAG 1.4.3 Contrast)
 */
async function checkColorContrast(
  container: HTMLElement,
  issues: AuditIssue[]
): Promise<void> {
  // Dynamic import of color library for size optimization
  try {
    // Get all text-containing elements
    const textElements = container.querySelectorAll<HTMLElement>(
      'p, span, div, td, th, li, a, button, label, h1, h2, h3, h4, h5, h6'
    )

    let checkedCount = 0
    const maxChecks = 50 // Limit for performance

    textElements.forEach((el, index) => {
      if (checkedCount >= maxChecks) return

      const style = window.getComputedStyle(el)
      const color = style.color
      const bgColor = style.backgroundColor

      // Skip transparent backgrounds (will inherit)
      if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') return

      // Calculate contrast ratio (simplified version)
      const ratio = calculateContrastRatio(color, bgColor)

      // Check against WCAG AA (4.5:1 for normal text, 3:1 for large text)
      const fontSize = parseFloat(style.fontSize)
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && parseInt(style.fontWeight) >= 700)
      const minimumRatio = isLargeText ? 3 : 4.5

      if (ratio < minimumRatio && el.textContent?.trim()) {
        issues.push({
          id: `contrast-fail-${checkedCount}`,
          severity: 'warning',
          category: 'Contrast',
          rule: 'color-contrast',
          description: `Low contrast ratio (${ratio.toFixed(2)}:1, need ${minimumRatio}:1+)`,
          element: el,
          selector: generateSelector(el),
          suggestion: `Increase color contrast to at least ${minimumRatio}:1 for accessibility`,
          wcagCriterion: '1.4.3'
        })
      }

      checkedCount++
    })
  } catch (error) {
    console.warn('[A11y-Audit] Contrast check failed:', error)
  }
}

/**
 * Calculate simplified contrast ratio between two CSS colors
 */
function calculateContrastRatio(fgColor: string, bgColor: string): number {
  try {
    const fgRGB = parseCSSColor(fgColor)
    const bgRGB = parseCSSColor(bgColor)

    const fgLuminance = getLuminance(fgRGB)
    const bgLuminance = getLuminance(bgRGB)

    const lighter = Math.max(fgLuminance, bgLuminance)
    const darker = Math.min(fgLuminance, bgLuminance)

    return (lighter + 0.05) / (darker + 0.05)
  } catch {
    return 10 // Return high value on error (assume OK)
  }
}

function parseCSSColor(cssColor: string): { r: number; g: number; b: number } {
  const match = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    }
  }
  return { r: 0, g: 0, b: 0 }
}

function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const normalize = (c: number) => {
    const srgb = c / 255
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * normalize(rgb.r) + 0.7152 * normalize(rgb.g) + 0.0722 * normalize(rgb.b)
}

/**
 * Check 6: ARIA attributes are used correctly (WCAG 4.1.2)
 */
async function checkARIAAttributes(
  container: HTMLElement,
  issues: AuditIssue[]
): Promise<void> {
  // Check for invalid role usage
  const elementsWithRole = container.querySelectorAll<HTMLElement>('[role]')

  elementsWithRole.forEach((el, index) => {
    const role = el.getAttribute('role')
    const validRoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
      'cell', 'checkbox', 'columnheader', 'combobox', 'command', 'complementary',
      'composite', 'contentinfo', 'definition', 'dialog', 'directory', 'document',
      'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 'img',
      'input', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee',
      'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
      'navigation', 'none', 'note', 'option', 'presentation', 'progressbar',
      'radio', 'radiogroup', 'region', 'row', 'rowgroup', 'rowheader',
      'scrollbar', 'searchbox', 'section', 'sectionhead', 'select', 'separator',
      'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist',
      'tabpanel', 'term', 'textbox', 'toolbar', 'tooltip', 'tree', 'treegrid',
      'treeitem'
    ]

    if (!validRoles.includes(role || '')) {
      issues.push({
        id: `invalid-role-${index}`,
        severity: 'error',
        category: 'ARIA',
        rule: 'valid-role',
        description: `Invalid ARIA role: "${role}"`,
        element: el,
        selector: generateSelector(el),
        suggestion: `Use a valid ARIA role from the list of allowed roles`
      })
    }
  })

  // Check for aria-label on interactive elements without visible text
  const interactiveElements = container.querySelectorAll<HTMLElement>(
    'a[href], button, [tabindex]:not([tabindex="-1"])'
  )

  interactiveElements.forEach((el, index) => {
    const hasVisibleContent = el.textContent?.trim()
    const hasAriaLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')

    if (!hasVisibleContent && !hasAriaLabel && !el.querySelector('svg, img')) {
      issues.push({
        id: `aria-missing-label-${index}`,
        severity: 'error',
        category: 'ARIA',
        rule: 'aria-label-required',
        description: `Interactive element has no visible content or aria-label`,
        element: el,
        selector: generateSelector(el),
        suggestion: 'Add visible text, aria-label, or aria-labelledby to provide accessible name',
        wcagCriterion: '4.1.2'
      })
    }
  })
}

/**
 * Check 7: Keyboard accessibility (WCAG 2.1.1 Keyboard)
 */
async function checkKeyboardAccessibility(
  container: HTMLElement,
  issues: AuditIssue[]
): Promise<void> {
  // Check for onclick handlers without keyboard support
  const clickOnlyElements = container.querySelectorAll<HTMLElement>(
    '[onclick]:not(button):not(a):not(input):not([role="button"]):not([tabindex])'
  )

  clickOnlyElements.forEach((el, index) => {
    issues.push({
      id: `keyboard-click-only-${index}`,
      severity: 'error',
      category: 'Keyboard',
      rule: 'keyboard-accessible',
      description: `Element with onclick handler lacks keyboard accessibility`,
      element: el,
      selector: generateSelector(el),
      suggestion: 'Make element focusable with tabindex and handle keyboard events (Enter/Space), or use semantic HTML',
      wcagCriterion: '2.1.1'
    })
  })

  // Check for tabindex="-1" which removes from tab order
  const negativeTabindex = container.querySelectorAll<HTMLElement>('[tabindex="-1"]')

  negativeTabindex.forEach((el, index) => {
    // Only warn if it's an interactive element
    if (el.onclick || el.getAttribute('role')) {
      issues.push({
        id: `negative-tabindex-${index}`,
        severity: 'warning',
        category: 'Keyboard',
        rule: 'tabindex-negative',
        description: `Interactive element removed from tab order with tabindex="-1"`,
        element: el,
        selector: generateSelector(el),
        suggestion: 'Ensure there\'s an alternative way to access this element via keyboard'
      })
    }
  })
}

/**
 * Check 8: Skip navigation links exist (WCAG 2.4.1 Bypass Blocks)
 */
async function checkSkipLinks(issues: AuditIssue[]): Promise<void> {
  const skipLinks = document.querySelectorAll<HTMLElement>(
    'a[href="#main-content"], a[href="#main"], .skip-link, .skip-link a, [class*="skip-to"]'
  )

  if (skipLinks.length === 0) {
    issues.push({
      id: 'missing-skip-links',
      severity: 'warning',
      category: 'Navigation',
      rule: 'skip-links',
      description: 'No skip navigation links found',
      suggestion: 'Add skip links to allow keyboard users to bypass repetitive content',
      wcagCriterion: '2.4.1'
    })
  }
}

/**
 * Check 9: Language attribute declared (WCAG 3.1.1 Language of Page)
 */
async function checkLanguageAttribute(issues: AuditIssue[]): Promise<void> {
  const htmlElement = document.documentElement

  if (!htmlElement.hasAttribute('lang')) {
    issues.push({
      id: 'missing-lang',
      severity: 'error',
      category: 'Language',
      rule: 'lang-attribute',
      description: '<html> element missing lang attribute',
      suggestion: 'Add lang attribute to specify page language (e.g., lang="zh-CN")',
      wcagCriterion: '3.1.1'
    })
  }
}

/**
 * Check 10: Focus management for modals and dialogs
 */
async function checkFocusManagement(issues: AuditIssue[]): Promise<void> {
  // Check for modal/dialog patterns
  const modals = document.querySelectorAll<HTMLElement>(
    '[role="dialog"], [role="modaldialog"], [aria-modal="true"]'
  )

  modals.forEach((modal, index) => {
    // Check if modal has focusable elements
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) {
      issues.push({
        id: `modal-no-focusable-${index}`,
        severity: 'warning',
        category: 'Focus Management',
        rule: 'modal-focus',
        description: `Modal/dialog contains no focusable elements`,
        element: modal,
        selector: generateSelector(modal),
        suggestion: 'Ensure modal has at least one focusable element for initial focus'
      })
    }
  })
}

// ==================== Utility Functions ====================

function generateSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${element.id}`
  }

  if (element.className && typeof element.className === 'string') {
    const classes = element.className.split(' ').filter(c => c.trim()).slice(0, 2)
    if (classes.length > 0) {
      return `${element.tagName.toLowerCase()}.${classes.join('.')}`
    }
  }

  return element.tagName.toLowerCase()
}

function generateReport(
  issues: AuditIssue[],
  options: AuditOptions,
  durationMs: number
): AuditReport {
  const errors = issues.filter(i => i.severity === 'error').length
  const warnings = issues.filter(i => i.severity === 'warning').length
  const info = issues.filter(i => i.severity === 'info').length

  // Calculate score (100 minus penalties)
  let score = 100
  score -= errors * 10
  score -= warnings * 3
  score -= info * 1
  score = Math.max(0, score)

  return {
    timestamp: new Date(),
    url: window.location.href,
    totalIssues: issues.length,
    errors,
    warnings,
    info,
    issues,
    score,
    summary: {
      imagesWithoutAlt: issues.filter(i => i.rule === 'img-alt').length,
      formsWithoutLabels: issues.filter(i => i.rule === 'label').length,
      buttonsWithoutName: issues.filter(i => i.rule === 'button-name').length,
      headingOrderIssues: issues.filter(i => i.category === 'Headings' && i.severity !== 'info').length,
      contrastFailures: issues.filter(i => i.category === 'Contrast').length,
      ariaIssues: issues.filter(i => i.category === 'ARIA').length,
      keyboardIssues: issues.filter(i => i.category === 'Keyboard').length,
      missingSkipLinks: issues.some(i => i.rule === 'skip-links'),
      missingLangAttribute: issues.some(i => i.rule === 'lang-attribute')
    }
  }
}

function logToConsole(report: AuditReport): void {
  const style = {
    error: 'color: #DC2626; font-weight: bold;',
    warning: 'color: #D97706; font-weight: bold;',
    info: 'color: #2563EB; font-weight: bold;',
    success: 'color: #059669; font-weight: bold;'
  }

  console.group('%c[A11y Audit Report]', 'font-size: 16px; font-weight: bold; color: #003B80;')
  console.log(`%cScore: ${report.score}/100`, report.score >= 80 ? style.success : report.score >= 60 ? style.warning : style.error)
  console.log(`Duration: ${(performance.now() - report.timestamp.getTime())}ms`)
  console.log(`URL: ${report.url}`)
  console.log(`Total Issues: ${report.totalIssues}`)

  console.group('%cSummary', 'font-weight: bold; margin-top: 8px;')
  console.log(`${style.error.replace('font-weight: bold;', '')} Errors: ${report.errors}`)
  console.log(`${style.warning.replace('font-weight: bold;', '')} Warnings: ${report.warnings}`)
  console.log(`${style.info.replace('font-weight: bold;', '')} Info: ${report.info}`)
  console.groupEnd()

  if (report.issues.length > 0) {
    console.group('%cIssues', 'font-weight: bold; margin-top: 8px;')
    report.issues.forEach(issue => {
      const severityStyle = style[issue.severity]
      console.log(
        `%c[${issue.severity.toUpperCase()}] ${issue.rule}: ${issue.description}`,
        severityStyle
      )
      if (issue.selector) {
        console.log(`   Element: ${issue.selector}`)
      }
      if (issue.suggestion) {
        console.log(`   Suggestion: ${issue.suggestion}`)
      }
    })
    console.groupEnd()
  }

  console.groupEnd()
}

function showVisualPanel(report: AuditReport): void {
  // Create floating panel
  const panel = document.createElement('div')
  panel.id = 'a11y-audit-panel'
  panel.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      padding: 20px;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; font-size: 18px; color: #1F2937;">A11y Audit Report</h3>
        <button onclick="this.closest('#a11y-audit-panel').remove()" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6B7280;
          line-height: 1;
        ">&times;</button>
      </div>

      <div style="
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        padding: 12px;
        background: ${report.score >= 80 ? '#F0FDF4' : report.score >= 60 ? '#FFFBEB' : '#FEF2F2'};
        border-radius: 8px;
        border-left: 4px solid ${report.score >= 80 ? '#059669' : report.score >= 60 ? '#D97706' : '#DC2626'};
      ">
        <span style="font-size: 32px; font-weight: 700; color: ${report.score >= 80 ? '#059669' : report.score >= 60 ? '#D97706' : '#DC2626'};">${report.score}</span>
        <div>
          <div style="font-size: 12px; color: #6B7280;">Accessibility Score</div>
          <div style="font-size: 14px; font-weight: 600; color: #1F2937;">${report.errors} errors, ${report.warnings} warnings</div>
        </div>
      </div>

      ${report.issues.slice(0, 20).map(issue => `
        <div style="
          padding: 8px 12px;
          margin-bottom: 8px;
          background: ${issue.severity === 'error' ? '#FEF2F2' : issue.severity === 'warning' ? '#FFFBEB' : '#EFF6FF'};
          border-radius: 6px;
          border-left: 3px solid ${issue.severity === 'error' ? '#DC2626' : issue.severity === 'warning' ? '#D97706' : '#2563EB'};
        ">
          <strong>${issue.rule}</strong>: ${issue.description}
        </div>
      `).join('')}

      ${report.issues.length > 20 ? `<p style="text-align: center; color: #6B7280;">...and ${report.issues.length - 20} more issues</p>` : ''}
    </div>
  `

  document.body.appendChild(panel)
}

// ==================== Auto-run in Development ====================

if (import.meta.env?.DEV || process.env?.NODE_ENV === 'development') {
  // Auto-run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => runA11yAudit(), 1000) // Delay to allow app to render
    })
  } else {
    setTimeout(() => runA11yAudit(), 1000)
  }
}
