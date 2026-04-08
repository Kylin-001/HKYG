<script setup lang="ts">
/**
 * RichEditor - 黑科易购富文本编辑器组件
 *
 * 轻量级自研富文本编辑器，基于 contenteditable 实现
 * 用于社区帖子发布、活动详情描述等场景
 * 品牌色：#003B80 科大蓝
 */

import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

// ==================== Types ====================
interface Props {
  modelValue?: string       // v-model 双向绑定 (HTML)
  placeholder?: string      // 占位文字
  maxLength?: number        // 最大字符数（0=不限）
  height?: string           // 固定高度（如 '300px'，不设置则自适应）
  disabled?: boolean        // 禁用状态
  showToolbar?: boolean     // 是否显示工具栏（默认 true）
  toolbarPosition?: 'top' | 'bottom' | 'float' // 工具栏位置
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '写下你的想法...',
  maxLength: 0,
  height: '',
  disabled: false,
  showToolbar: true,
  toolbarPosition: 'top'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'image-upload': [file: File]
  'blur': []
}>()

// ==================== Refs ====================
const editorRef = ref<HTMLDivElement>()
const fileInputRef = ref<HTMLInputElement>()
const isFocused = ref(false)
const currentCharCount = ref(0)
const showColorPicker = ref(false)
const showHeadingPicker = ref(false)
const showImageSizeMenu = ref(false)
const imageCount = ref(0)

// 历史记录栈（用于撤销/重做）
const historyStack = ref<string[]>([])
const historyIndex = ref(-1)
const isComposing = ref(false) // 输入法组合状态

// 预设品牌色
const brandColors = [
  { name: '科大蓝', value: '#003B80' },
  { name: '深蓝',   value: '#002560' },
  { name: '浅蓝',   value: '#1A5FB4' },
  { name: '金色',   value: '#B8860B' },
  { name: '红色',   value: '#C41E3A' },
  { name: '绿色',   value: '#2D6A4F' },
  { name: '灰色',   value: '#4A5568' },
  { name: '黑色',   value: '#1A1A2E' }
]

// 标题选项
const headingOptions = [
  { label: 'H1', tag: 'h1', style: 'font-size:24px;font-weight:700;' },
  { label: 'H2', tag: 'h2', style: 'font-size:20px;font-weight:600;' },
  { label: 'H3', tag: 'h3', style: 'font-size:17px;font-weight:600;' },
  { label: '正文', tag: 'p', style: 'font-size:15px;font-weight:normal;' }
]

// 图片尺寸选项
const imageSizeOptions = [
  { label: '小', width: '30%' },
  { label: '中', width: '60%' },
  { label: '大', width: '100%' }
]

// ==================== Computed ====================
const editorStyle = computed(() => {
  const base: Record<string, string> = {
    minHeight: '200px',
    maxHeight: props.height || '500px',
    overflowY: 'auto'
  }
  if (props.height) {
    base.height = props.height
    delete base.minHeight
    delete base.maxHeight
  }
  return base
})

const isMaxLengthReached = computed(() => {
  return props.maxLength > 0 && currentCharCount.value >= props.maxLength
})

/** 图片尺寸菜单位置（定位到目标图片附近） */
const imageMenuPosition = computed(() => {
  const targetImg = editorRef.value?.querySelector('[data-image-target="true"]') as HTMLImageElement | null
  if (!targetImg) return { position: 'fixed', left: '0px', top: '0px', visibility: 'hidden' as const }
  const rect = targetImg.getBoundingClientRect()
  return {
    position: 'fixed',
    left: `${rect.left + rect.width / 2 - 50}px`,
    top: `${rect.bottom + 8}px`,
    visibility: 'visible' as const
  }
})

// ==================== Methods ====================

/** 执行文档命令 */
function execCommand(command: string, value?: string) {
  if (props.disabled) return
  closeAllPopups()
  editorRef.value?.focus()
  document.execCommand(command, false, value ?? '')
  updateContent()
}

/** 切换块级元素 */
function formatBlock(tag: string) {
  if (props.disabled) return
  closeAllPopups()
  editorRef.value?.focus()
  document.execCommand('formatBlock', false, tag)
  updateContent()
}

/** 插入链接 */
function insertLink() {
  if (props.disabled) return
  const url = prompt('请输入链接地址：', 'https://')
  if (url) {
    editorRef.value?.focus()
    document.execCommand('createLink', false, url)
    updateContent()
  }
}

/** 触发图片文件选择 */
function triggerImageSelect() {
  if (props.disabled) return
  if (imageCount.value >= 9) {
    alert('最多只能插入9张图片')
    return
  }
  fileInputRef.value?.click()
}

/** 处理图片选择 */
function handleImageSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  Array.from(files).forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`图片 "${file.name}" 超过 5MB 限制`)
      return
    }
    if (imageCount.value >= 9) {
      alert('最多只能插入9张图片')
      return
    }
    emit('image-upload', file)

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      insertImage(base64)
    }
    reader.readAsDataURL(file)
  })
  input.value = ''
}

/** 插入图片到编辑器 */
function insertImage(src: string, size: string = '60%') {
  editorRef.value?.focus()

  const img = document.createElement('img')
  img.src = src
  img.style.width = size
  img.style.maxWidth = '100%'
  img.style.height = 'auto'
  img.style.borderRadius = '8px'
  img.style.margin = '8px 0'
  img.style.cursor = 'pointer'
  img.className = 'rich-editor-image'

  img.addEventListener('click', (e) => {
    e.stopPropagation()
    showImageSizeMenu.value = true
    ;(e.target as HTMLElement).dataset.imageTarget = 'true'
  })

  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    range.insertNode(img)
    range.setStartAfter(img)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    editorRef.value?.appendChild(img)
  }

  imageCount.value++
  updateContent()
}

/** 设置选中图片的尺寸 */
function setImageSize(width: string) {
  const targetImg = editorRef.value?.querySelector('[data-image-target="true"]') as HTMLImageElement | null
  if (targetImg) {
    targetImg.style.width = width
    targetImg.removeAttribute('data-image-target')
    updateContent()
  }
  showImageSizeMenu.value = false
}

/** 撤销 */
function undo() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    const content = historyStack.value[historyIndex.value]
    if (editorRef.value && content !== undefined) {
      editorRef.value.innerHTML = content
      emitUpdate(content)
    }
  }
}

/** 重做 */
function redo() {
  if (historyIndex.value < historyStack.value.length - 1) {
    historyIndex.value++
    const content = historyStack.value[historyIndex.value]
    if (editorRef.value && content !== undefined) {
      editorRef.value.innerHTML = content
      emitUpdate(content)
    }
  }
}

/** 更新内容并触发事件 */
function updateContent() {
  if (!editorRef.value) return
  const html = editorRef.value.innerHTML
  const text = getTextInternal()
  currentCharCount.value = text.length
  pushHistory(html)
  emitUpdate(html)
  emit('change', html)
}

/** 推入历史栈 */
function pushHistory(html: string) {
  if (historyIndex.value < historyStack.value.length - 1) {
    historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
  }
  if (historyStack.value[historyIndex.value] === html) return
  historyStack.value.push(html)
  historyIndex.value++
  if (historyStack.value.length > 50) {
    historyStack.value.shift()
    historyIndex.value--
  }
}

/** 发送 v-model 更新 */
function emitUpdate(value: string) {
  emit('update:modelValue', value)
}

// ==================== 公开方法 ====================

/** 获取 HTML 内容 */
function getHTML(): string {
  return editorRef.value?.innerHTML ?? ''
}

/** 获取纯文本内容 */
function getText(): string {
  return getTextInternal()
}

/** 内部获取纯文本 */
function getTextInternal(): string {
  if (!editorRef.value) return ''
  return editorRef.value.innerText || editorRef.value.textContent || ''
}

/** 将 HTML 转换为简化 Markdown */
function getMarkdown(): string {
  if (!editorRef.value) return ''

  function processNode(el: Element): string {
    let result = ''
    el.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        result += child.textContent || ''
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const elem = child as Element
        const tag = elem.tagName.toLowerCase()

        switch (tag) {
          case 'h1': result += `\n# ${elem.textContent}\n`; break
          case 'h2': result += `\n## ${elem.textContent}\n`; break
          case 'h3': result += `\n### ${elem.textContent}\n`; break
          case 'p': result += `${processNode(elem)}\n\n`; break
          case 'br': result += '\n'; break
          case 'strong':
          case 'b': result += `**${elem.textContent}**`; break
          case 'em':
          case 'i': result += `*${elem.textContent}*`; break
          case 's':
          case 'del': result += `~~${elem.textContent}~~`; break
          case 'code': result += `\`${elem.textContent}\``; break
          case 'a': result += `[${elem.textContent}](${elem.getAttribute('href') || ''})`; break
          case 'img': result += `![${elem.alt || ''}](${elem.getAttribute('src') || ''})`; break
          case 'blockquote': result += `\n> ${processNode(elem).trim()}\n`; break
          case 'ul':
            elem.querySelectorAll(':scope > li').forEach((li) => { result += `- ${li.textContent}\n` })
            break
          case 'ol':
            elem.querySelectorAll(':scope > li').forEach((li, i) => { result += `${i + 1}. ${li.textContent}\n` })
            break
          case 'li': result += processNode(elem); break
          case 'hr': result += '\n---\n'; break
          case 'div':
          case 'section': result += processNode(elem); break
          default: result += elem.textContent || ''
        }
      }
    })
    return result
  }

  return processNode(editorRef.value).trim()
}

/** 检查是否为空 */
function isEmpty(): boolean {
  if (!editorRef.value) return true
  const text = editorRef.value.innerText.trim()
  const html = editorRef.value.innerHTML.trim()
  return text === '' || html === '' || html === '<br>'
}

/** 聚焦编辑器 */
function focus() {
  editorRef.value?.focus()
}

/** 清空编辑器 */
function clear() {
  if (editorRef.value) {
    editorRef.value.innerHTML = ''
    imageCount.value = 0
    updateContent()
  }
}

defineExpose({ getHTML, getText, getMarkdown, isEmpty, focus, clear })

// ==================== 事件处理 ====================

/** 处理输入事件 */
function handleInput() {
  if (isComposing.value) return

  if (isMaxLengthReached.value) {
    const text = getTextInternal()
    if (text.length > props.maxLength!) return
  }

  checkHorizontalRule()
  updateContent()
}

/** 检测输入法组合开始/结束 */
function handleCompositionStart() { isComposing.value = true }

function handleCompositionEnd() {
  isComposing.value = false
  handleInput()
}

/** 处理键盘快捷键 */
function handleKeydown(e: KeyboardEvent) {
  // Ctrl+B 粗体
  if (e.ctrlKey && e.key === 'b') { e.preventDefault(); execCommand('bold'); return }
  // Ctrl+I 斜体
  if (e.ctrlKey && e.key === 'i') { e.preventDefault(); execCommand('italic'); return }
  // Ctrl+U 下划线
  if (e.ctrlKey && e.key === 'u') { e.preventDefault(); execCommand('underline'); return }
  // Ctrl+Shift+X 行内代码
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
    e.preventDefault()
    execCommand('insertHTML', '<code></code>')
    nextTick(() => {
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const code = editorRef.value?.querySelector('code:last-child')
        if (code) {
          const range = document.createRange()
          range.selectNodeContents(code)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    })
    return
  }
  // Ctrl+Z 撤销
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return }
  // Ctrl+Shift+Z / Ctrl+Y 重做
  if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) { e.preventDefault(); redo(); return }
  // Tab 缩进
  if (e.key === 'Tab') { e.preventDefault(); execCommand('insertText', '  '); return }
  // Enter 在列表项中让浏览器默认处理
  if (e.key === 'Enter' && !e.shiftKey) {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const container = sel.getRangeAt(0).startContainer
      const parentTag = container.parentElement?.tagName
      const grandParentTag = container.parentElement?.parentElement?.tagName
      if (parentTag === 'LI' || grandParentTag === 'LI') return
    }
  }
}

/** 检测 --- + Enter 转分割线 */
function checkHorizontalRule() {
  if (!editorRef.value) return
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return

  const range = sel.getRangeAt(0)
  let currentNode: Node | null = range.startContainer
  let lineText = ''

  while (currentNode && currentNode !== editorRef.value) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      lineText = (currentNode.textContent || '') + lineText
    }
    if (currentNode.previousSibling) {
      currentNode = currentNode.previousSibling
      if (currentNode.nodeType === Node.TEXT_NODE) {
        lineText = (currentNode.textContent || '') + lineText
      }
      break
    }
    currentNode = currentNode.parentNode
  }

  if (lineText.trim() === '---') {
    const p = range.startContainer.parentElement
    if (p) {
      p.innerHTML = ''
      const hr = document.createElement('hr')
      hr.style.cssText = 'border:none;border-top:1px solid #E2E8F0;margin:12px 0'
      p.appendChild(hr)
      const br = document.createElement('br')
      p.appendChild(br)

      const newRange = document.createRange()
      newRange.setStartAfter(hr)
      newRange.collapse(true)
      sel.removeAllRanges()
      sel.addRange(newRange)
    }
  }
}

/** 焦点事件 */
function handleFocus() { isFocused.value = true }

function handleBlur() {
  isFocused.value = false
  closeAllPopups()
  emit('blur')
}

/** 关闭所有弹出菜单 */
function closeAllPopups() {
  showColorPicker.value = false
  showHeadingPicker.value = false
  showImageSizeMenu.value = false
  const targetImg = editorRef.value?.querySelector('[data-image-target="true"]')
  if (targetImg) targetImg.removeAttribute('data-image-target')
}

/** 点击外部关闭菜单 */
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.rich-editor')) closeAllPopups()
}

// ==================== 监听器 ====================

watch(() => props.modelValue, (val) => {
  if (editorRef.value && val !== undefined && val !== editorRef.value.innerHTML) {
    editorRef.value.innerHTML = val
    imageCount.value = editorRef.value.querySelectorAll('img').length
    currentCharCount.value = getTextInternal().length
  }
}, { immediate: true })

watch(() => props.disabled, (val) => {
  if (editorRef.value) editorRef.value.contentEditable = val ? 'false' : 'true'
})

// ==================== 生命周期 ====================

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (editorRef.value) {
    historyStack.value = [editorRef.value.innerHTML]
    historyIndex.value = 0
    currentCharCount.value = getTextInternal().length
    imageCount.value = editorRef.value.querySelectorAll('img').length
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="rich-editor" :class="{ 'rich-editor--disabled': disabled, 'rich-editor--focused': isFocused }">

    <!-- ========== 工具栏 - 顶部 ========== -->
    <div v-if="showToolbar && toolbarPosition === 'top'" class="toolbar-wrapper">
      <div class="rich-editor-toolbar-inner">

        <!-- 撤销 / 重做 -->
        <div class="toolbar-group">
          <button class="toolbar-btn" title="撤销 (Ctrl+Z)" :disabled="disabled" @click="undo">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
          </button>
          <button class="toolbar-btn" title="重做 (Ctrl+Shift+Z)" :disabled="disabled" @click="redo">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"/></svg>
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 文本格式：粗体 / 斜体 / 删除线 / 行内代码 -->
        <div class="toolbar-group">
          <button class="toolbar-btn" title="粗体 (Ctrl+B)" :disabled="disabled" @click="execCommand('bold')"><strong>B</strong></button>
          <button class="toolbar-btn" title="斜体 (Ctrl+I)" :disabled="disabled" @click="execCommand('italic')"><em>I</em></button>
          <button class="toolbar-btn" title="删除线" :disabled="disabled" @click="execCommand('strikeThrough')"><s>S</s></button>
          <button class="toolbar-btn" title="行内代码 (Ctrl+Shift+X)" :disabled="disabled" @click="execCommand('insertHTML', '<code></code>')"><code>&lt;/&gt;</code></button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 标题选择 -->
        <div class="toolbar-group toolbar-group--dropdown">
          <button class="toolbar-btn toolbar-btn--dropdown" :class="{ 'toolbar-btn--active': showHeadingPicker }" title="标题" :disabled="disabled" @click="showHeadingPicker = !showHeadingPicker; showColorPicker = false">
            <span>H</span>
            <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor"><path d="M6 8L2 4h8z"/></svg>
          </button>
          <div v-if="showHeadingPicker" class="toolbar-dropdown">
            <div v-for="opt in headingOptions" :key="opt.tag" class="dropdown-item" :style="opt.style" @click="formatBlock(opt.tag); showHeadingPicker = false">{{ opt.label }}</div>
          </div>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 列表：无序 / 有序 / 任务 -->
        <div class="toolbar-group">
          <button class="toolbar-btn" title="无序列表" :disabled="disabled" @click="execCommand('insertUnorderedList')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
          </button>
          <button class="toolbar-btn" title="有序列表" :disabled="disabled" @click="execCommand('insertOrderedList')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="10" y1="18" x2="20" y2="18"/><text x="3" y="7.5" font-size="8" fill="currentColor" stroke="none">1</text><text x="3" y="13.5" font-size="8" fill="currentColor" stroke="none">2</text><text x="3" y="19.5" font-size="8" fill="currentColor" stroke="none">3</text></svg>
          </button>
          <button class="toolbar-btn" title="任务列表" :disabled="disabled" @click="execCommand('insertHTML', '<input type=\"checkbox\" /> ')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="M7 12l3 3 5-5"/></svg>
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 对齐：左 / 中 / 右 -->
        <div class="toolbar-group">
          <button class="toolbar-btn" title="左对齐" :disabled="disabled" @click="execCommand('justifyLeft')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
          </button>
          <button class="toolbar-btn" title="居中" :disabled="disabled" @click="execCommand('justifyCenter')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </button>
          <button class="toolbar-btn" title="右对齐" :disabled="disabled" @click="execCommand('justifyRight')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 文字颜色 -->
        <div class="toolbar-group toolbar-group--dropdown">
          <button class="toolbar-btn toolbar-btn--color" :class="{ 'toolbar-btn--active': showColorPicker }" title="文字颜色" :disabled="disabled" @click="showColorPicker = !showColorPicker; showHeadingPicker = false">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
            <span class="color-indicator"></span>
          </button>
          <div v-if="showColorPicker" class="toolbar-dropdown toolbar-dropdown--colors">
            <div class="color-grid">
              <div v-for="color in brandColors" :key="color.value" class="color-swatch" :style="{ backgroundColor: color.value }" :title="color.name" @click="execCommand('foreColor', color.value); showColorPicker = false"></div>
            </div>
          </div>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 插入：图片 / 链接 / 引用 / 分割线 -->
        <div class="toolbar-group">
          <button class="toolbar-btn" title="插入图片" :disabled="disabled" @click="triggerImageSelect()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>
          <button class="toolbar-btn" title="插入链接" :disabled="disabled" @click="insertLink()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </button>
          <button class="toolbar-btn" title="引用块" :disabled="disabled" @click="formatBlock('blockquote')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>
          </button>
          <button class="toolbar-btn" title="分割线" :disabled="disabled" @click="execCommand('insertHorizontalRule')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>
          </button>
        </div>

      </div>
    </div>

    <!-- ========== 编辑区域 ========== -->
    <div
      ref="editorRef"
      class="rich-editor-content"
      :style="editorStyle"
      :contenteditable="!disabled"
      :data-placeholder="placeholder"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
    ></div>

    <!-- 图片尺寸浮动菜单 (Teleport 到 body) -->
    <Teleport to="body">
      <div v-if="showImageSizeMenu" class="rich-editor-image-size-menu" :style="imageMenuPosition">
        <div class="image-size-menu-header">图片尺寸</div>
        <div v-for="opt in imageSizeOptions" :key="opt.label" class="image-size-menu-item" @click="setImageSize(opt.width)">
          {{ opt.label }}
        </div>
      </div>
    </Teleport>

    <!-- ========== 底部状态栏 ========== -->
    <div class="rich-editor-footer">
      <span v-if="maxLength > 0" class="char-count" :class="{ 'char-count--limit': isMaxLengthReached }">{{ currentCharCount }} / {{ maxLength }}</span>
      <span v-if="imageCount > 0" class="image-count">{{ imageCount }} 张图片</span>
    </div>

    <!-- ========== 工具栏 - 底部 ========== -->
    <div v-if="showToolbar && toolbarPosition === 'bottom'" class="toolbar-wrapper toolbar-wrapper--bottom">
      <!-- 与顶部工具栏完全相同的内容（通过复用逻辑） -->
      <div class="rich-editor-toolbar-inner">

        <!-- 撤销 / 重做 -->
        <div class="toolbar-group">
          <button class="toolbar-btn" title="撤销 (Ctrl+Z)" :disabled="disabled" @click="undo">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
          </button>
          <button class="toolbar-btn" title="重做 (Ctrl+Shift+Z)" :disabled="disabled" @click="redo">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"/></svg>
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 文本格式 -->
        <div class="toolbar-group">
          <button class="toolbar-btn" title="粗体 (Ctrl+B)" :disabled="disabled" @click="execCommand('bold')"><strong>B</strong></button>
          <button class="toolbar-btn" title="斜体 (Ctrl+I)" :disabled="disabled" @click="execCommand('italic')"><em>I</em></button>
          <button class="toolbar-btn" title="删除线" :disabled="disabled" @click="execCommand('strikeThrough')"><s>S</s></button>
          <button class="toolbar-btn" title="行内代码 (Ctrl+Shift+X)" :disabled="disabled" @click="execCommand('insertHTML', '<code></code>')"><code>&lt;/&gt;</code></button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 标题 -->
        <div class="toolbar-group toolbar-group--dropdown">
          <button class="toolbar-btn toolbar-btn--dropdown" :class="{ 'toolbar-btn--active': showHeadingPicker }" title="标题" :disabled="disabled" @click="showHeadingPicker = !showHeadingPicker; showColorPicker = false">
            <span>H</span><svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor"><path d="M6 8L2 4h8z"/></svg>
          </button>
          <div v-if="showHeadingPicker" class="toolbar-dropdown">
            <div v-for="opt in headingOptions" :key="opt.tag" class="dropdown-item" :style="opt.style" @click="formatBlock(opt.tag); showHeadingPicker = false">{{ opt.label }}</div>
          </div>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 列表 -->
        <div class="toolbar-group">
          <button class="toolbar-btn" title="无序列表" :disabled="disabled" @click="execCommand('insertUnorderedList')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
          </button>
          <button class="toolbar-btn" title="有序列表" :disabled="disabled" @click="execCommand('insertOrderedList')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="10" y1="18" x2="20" y2="18"/><text x="3" y="7.5" font-size="8" fill="currentColor" stroke="none">1</text><text x="3" y="13.5" font-size="8" fill="currentColor" stroke="none">2</text><text x="3" y="19.5" font-size="8" fill="currentColor" stroke="none">3</text></svg>
          </button>
          <button class="toolbar-btn" title="任务列表" :disabled="disabled" @click="execCommand('insertHTML', '<input type=\"checkbox\" /> ')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="M7 12l3 3 5-5"/></svg>
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 对齐 -->
        <div class="toolbar-group">
          <button class="toolbar-btn" title="左对齐" :disabled="disabled" @click="execCommand('justifyLeft')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
          </button>
          <button class="toolbar-btn" title="居中" :disabled="disabled" @click="execCommand('justifyCenter')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </button>
          <button class="toolbar-btn" title="右对齐" :disabled="disabled" @click="execCommand('justifyRight')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 颜色 -->
        <div class="toolbar-group toolbar-group--dropdown">
          <button class="toolbar-btn toolbar-btn--color" :class="{ 'toolbar-btn--active': showColorPicker }" title="文字颜色" :disabled="disabled" @click="showColorPicker = !showColorPicker; showHeadingPicker = false">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
            <span class="color-indicator"></span>
          </button>
          <div v-if="showColorPicker" class="toolbar-dropdown toolbar-dropdown--colors">
            <div class="color-grid">
              <div v-for="color in brandColors" :key="color.value" class="color-swatch" :style="{ backgroundColor: color.value }" :title="color.name" @click="execCommand('foreColor', color.value); showColorPicker = false"></div>
            </div>
          </div>
        </div>

        <div class="toolbar-divider"></div>

        <!-- 插入 -->
        <div class="toolbar-group">
          <button class="toolbar-btn" title="插入图片" :disabled="disabled" @click="triggerImageSelect()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>
          <button class="toolbar-btn" title="插入链接" :disabled="disabled" @click="insertLink()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </button>
          <button class="toolbar-btn" title="引用块" :disabled="disabled" @click="formatBlock('blockquote')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>
          </button>
          <button class="toolbar-btn" title="分割线" :disabled="disabled" @click="execCommand('insertHorizontalRule')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>
          </button>
        </div>

      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input ref="fileInputRef" type="file" accept="image/*" multiple style="display: none" @change="handleImageSelect" />

  </div>
</template>

<style scoped>
/* ============================================
   RichEditor - 富文本编辑器样式
   品牌：黑科易购校园服务平台
   主色：#003B80 科大蓝
   ============================================ */

/* ====== 容器 ====== */
.rich-editor {
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  background: #FFFFFF;
  overflow: hidden;
  transition: box-shadow 200ms ease, border-color 200ms ease;
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
}

.rich-editor:hover:not(.rich-editor--disabled) {
  border-color: #C5D4E8;
}

.rich-editor--focused {
  border-color: #003B80;
  box-shadow: 0 0 0 3px rgba(0, 59, 128, 0.1), 0 2px 8px rgba(0, 59, 128, 0.08);
}

.rich-editor--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #F9FAFB;
}

/* ====== 工具栏 ====== */
.toolbar-wrapper {
  background: linear-gradient(to bottom, #FAFBFC, #F5F7FA);
  border-bottom: 1px solid rgba(0, 59, 128, 0.06);
  flex-shrink: 0;
}

.toolbar-wrapper--bottom {
  order: 99;
  border-bottom: none;
  border-top: 1px solid rgba(0, 59, 128, 0.06);
}

.rich-editor-toolbar-inner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  padding: 8px 12px;
  min-height: 44px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #D1D5DB transparent;
}

.rich-editor-toolbar-inner::-webkit-scrollbar {
  height: 4px;
}
.rich-editor-toolbar-inner::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 2px;
}

/* 工具组 */
.toolbar-group {
  display: flex;
  align-items: center;
  gap: 1px;
  position: relative;
}

.toolbar-group--dropdown {
  position: relative;
}

/* 分隔线 */
.toolbar-divider {
  width: 1px;
  height: 22px;
  background: rgba(0, 59, 128, 0.1);
  margin: 0 6px;
  flex-shrink: 0;
}

/* 工具按钮 */
.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #4A5568;
  cursor: pointer;
  transition: all 150ms ease;
  font-size: 13px;
  white-space: nowrap;
  user-select: none;
  line-height: 1;
  position: relative;
}

.toolbar-btn:hover:not(:disabled) {
  background: rgba(0, 59, 128, 0.06);
  color: #003B80;
}

.toolbar-btn:active:not(:disabled) {
  background: rgba(0, 59, 128, 0.12);
  transform: scale(0.96);
}

.toolbar-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.toolbar-btn--active {
  background: rgba(0, 59, 128, 0.1);
  color: #003B80;
  font-weight: 600;
}

/* 下拉箭头旋转 */
.toolbar-btn--dropdown svg {
  opacity: 0.5;
  transition: transform 150ms ease;
}
.toolbar-btn--dropdown:hover svg,
.toolbar-btn--active svg {
  opacity: 1;
}
.toolbar-btn--active svg {
  transform: rotate(180deg);
}

/* 颜色指示点 */
.toolbar-btn--color .color-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #003B80;
  position: absolute;
  bottom: 5px;
  right: 5px;
}

/* 下拉面板 */
.toolbar-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 6px;
  animation: dropdownIn 150ms ease-out;
  min-width: 120px;
}

@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  transition: all 120ms ease;
  white-space: nowrap;
}

.dropdown-item:hover {
  background: rgba(0, 59, 128, 0.06);
  color: #003B80;
}

/* 颜色网格 */
.toolbar-dropdown--colors {
  padding: 10px;
  min-width: auto;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 120ms ease;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.color-swatch:hover {
  transform: scale(1.15);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* ====== 编辑区域 ====== */
.rich-editor-content {
  padding: 16px 20px;
  outline: none;
  font-size: 15px;
  line-height: 1.75;
  color: #1A1A2E;
  word-break: break-word;
  overflow-y: auto;
  min-height: 200px;
  flex: 1;
  position: relative;
}

.rich-editor-content:empty::before {
  content: attr(data-placeholder);
  color: #A0AEC0;
  pointer-events: none;
  position: absolute;
  left: 20px;
  top: 16px;
}

/* 编辑区域内排版 */
.rich-editor-content :deep(h1) { font-size: 24px; font-weight: 700; line-height: 1.35; margin: 16px 0 8px; color: #1A1A2E; }
.rich-editor-content :deep(h2) { font-size: 20px; font-weight: 600; line-height: 1.4; margin: 14px 0 6px; color: #1A1A2E; }
.rich-editor-content :deep(h3) { font-size: 17px; font-weight: 600; line-height: 1.45; margin: 12px 0 6px; color: #1A1A2E; }
.rich-editor-content :deep(p) { margin: 4px 0; }
.rich-editor-content :deep(strong),
.rich-editor-content :deep(b) { font-weight: 700; color: #111827; }
.rich-editor-content :deep(em),
.rich-editor-content :deep(i) { font-style: italic; }
.rich-editor-content :deep(s),
.rich-editor-content :deep(del) { text-decoration: line-through; color: #9CA3AF; }
.rich-editor-content :deep(code) {
  background: rgba(0, 59, 128, 0.06);
  color: #003B80;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', Consolas, Monaco, monospace;
  font-size: 0.89em;
  word-break: keep-all;
}
.rich-editor-content :deep(a) { color: #003B80; text-decoration: underline; text-underline-offset: 2px; }
.rich-editor-content :deep(a:hover) { color: #002560; }
.rich-editor-content :deep(blockquote) {
  border-left: 3px solid #003B80;
  margin: 12px 0;
  padding: 8px 16px;
  background: rgba(0, 59, 128, 0.03);
  border-radius: 0 8px 8px 0;
  color: #4A5568;
}
.rich-editor-content :deep(ul),
.rich-editor-content :deep(ol) { padding-left: 24px; margin: 8px 0; }
.rich-editor-content :deep(li) { margin: 4px 0; line-height: 1.65; }
.rich-editor-content :deep(li::marker) { color: #003B80; }
.rich-editor-content :deep(hr) { border: none; border-top: 1px solid #E2E8F0; margin: 12px 0; }
.rich-editor-content :deep(img) { max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; display: inline-block; }
.rich-editor-content :deep(.rich-editor-image) { cursor: pointer; transition: outline 120ms ease; }
.rich-editor-content :deep(.rich-editor-image:hover) { outline: 2px solid #003B80; outline-offset: 2px; }
.rich-editor-content :deep(input[type="checkbox"]) { margin-right: 6px; accent-color: #003B80; vertical-align: middle; }

/* ====== 图片尺寸菜单 ====== */
.rich-editor-image-size-menu {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 6px;
  animation: dropdownIn 150ms ease-out;
  min-width: 100px;
}

.image-size-menu-header {
  font-size: 11px;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 10px 2px;
  font-weight: 600;
}

.image-size-menu-item {
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  transition: all 120ms ease;
}

.image-size-menu-item:hover {
  background: rgba(0, 59, 128, 0.06);
  color: #003B80;
}

/* ====== 底部状态栏 ====== */
.rich-editor-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 6px 16px;
  background: #FAFBFC;
  border-top: 1px solid rgba(0, 59, 128, 0.04);
  font-size: 12px;
  color: #9CA3AF;
  flex-shrink: 0;
}

.char-count {
  font-variant-numeric: tabular-nums;
  transition: color 150ms ease;
}

.char-count--limit {
  color: #C41E3A;
  font-weight: 600;
}

.image-count {
  color: #718096;
}

/* ====== 响应式适配 ====== */
@media (max-width: 640px) {
  .rich-editor-toolbar-inner { padding: 6px 8px; gap: 1px; }
  .toolbar-btn { min-width: 28px; height: 28px; padding: 0 6px; font-size: 12px; }
  .toolbar-divider { height: 18px; margin: 0 4px; }
  .rich-editor-content { padding: 12px 14px; font-size: 14px; }
  .rich-editor-footer { padding: 5px 12px; font-size: 11px; }
  .color-grid { grid-template-columns: repeat(4, 1fr); gap: 4px; }
  .color-swatch { width: 24px; height: 24px; }
}

/* ====== 打印样式 ====== */
@media print {
  .rich-editor { border: none; box-shadow: none; }
  .toolbar-wrapper,
  .rich-editor-footer { display: none; }
  .rich-editor-content { min-height: auto; max-height: none; padding: 0; }
}
</style>
