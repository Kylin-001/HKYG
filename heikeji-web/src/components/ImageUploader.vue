<script setup lang="ts">
/**
 * ImageUploader - 图片批量上传组件
 * 黑科易购校园服务平台专用组件
 *
 * 功能特性：
 * - 支持点击/拖拽上传多张图片
 * - 前端 Canvas 压缩优化
 * - 图片预览网格 + Lightbox 全屏查看
 * - 封面设置、删除、重试等操作
 * - Mock 模式 / 真实 API 模式双支持
 */

import { ref, computed, watch } from 'vue'
import {
  Plus,
  Delete,
  ZoomIn,
  RefreshRight,
  Picture,
  Upload,
  Close,
} from '@element-plus/icons-vue'

// ==================== 类型定义 ====================

interface ImageItem {
  id: string
  url: string
  file?: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  originalSize?: number   // 原始大小 bytes
  compressedSize?: number // 压缩后大小 bytes
  isCover: boolean
}

interface Props {
  /** v-model: 已上传的 URL 数组 */
  modelValue?: string[]
  /** 最大上传数量 */
  maxCount?: number
  /** 单张大小限制 MB */
  maxSize?: number
  /** 接受的 MIME 类型 */
  accept?: string
  /** 是否启用压缩 */
  compress?: boolean
  /** 压缩质量 0-1 */
  compressQuality?: number
  /** 压缩最大宽度 px */
  maxWidth?: number
  /** 禁用状态 */
  disabled?: boolean
  /** 显示压缩信息 */
  showCompressInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  maxCount: 9,
  maxSize: 5,
  accept: 'image/*',
  compress: true,
  compressQuality: 0.85,
  maxWidth: 1200,
  disabled: false,
  showCompressInfo: true,
})

const emit = defineEmits<{
  'update:modelValue': [urls: string[]]
  'change': [files: File[], urls: string[]]
  'exceed': []
  'oversize': [file: File]
  'error': [err: Error]
}>()

// ==================== 响应式状态 ====================

const fileList = ref<ImageItem[]>([])
const isDragging = ref(false)
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

// 生成唯一 ID
let idCounter = 0
function generateId(): string {
  return `img_${Date.now()}_${++idCounter}`
}

// ==================== 计算属性 ====================

const canUpload = computed(() => {
  return !props.disabled && fileList.value.length < props.maxCount
})

const uploadText = computed(() => {
  if (isDragging.value) return '释放以上传'
  return '点击或拖拽上传'
})

// 成功上传的 URL 列表
const successUrls = computed(() =>
  fileList.value
    .filter((item) => item.status === 'success')
    .sort((a, b) => {
      if (a.isCover) return -1
      if (b.isCover) return 1
      return 0
    })
    .map((item) => item.url),
)

// Lightbox 图片列表
const lightboxImages = computed(() =>
  fileList.value
    .filter((item) => item.status === 'success')
    .map((item) => item.url),
)

// ==================== 监听器 ====================

watch(
  () => props.modelValue,
  (val) => {
    if (!val || val.length === 0) {
      fileList.value = []
      return
    }
    // 外部传入 URL 时初始化列表（不覆盖已有）
    const existingUrls = new Set(fileList.value.map((f) => f.url))
    const newItems: ImageItem[] = val
      .filter((url) => !existingUrls.has(url))
      .map((url, index) => ({
        id: generateId(),
        url,
        status: 'success' as const,
        progress: 100,
        isCover: index === 0 && fileList.value.length === 0,
      }))
    if (newItems.length > 0) {
      fileList.value = [...fileList.value, ...newItems]
    }
  },
  { immediate: true },
)

// 同步 v-model
watch(successUrls, (urls) => {
  emit('update:modelValue', urls)
})

// ==================== 文件验证 ====================

function validateFiles(files: File[]): File[] {
  const validFiles: File[] = []
  const remaining = props.maxCount - fileList.value.length

  // 检查数量限制
  if (files.length > remaining) {
    emit('exceed')
    files = files.slice(0, remaining)
  }

  for (const file of files) {
    // 检查类型
    if (!file.type.startsWith('image/')) continue

    // 检查大小
    if (file.size > props.maxSize * 1024 * 1024) {
      emit('oversize', file)
      continue
    }

    validFiles.push(file)
  }

  return validFiles
}

// ==================== 图片压缩 ====================

async function compressImage(
  file: File,
): Promise<{ blob: Blob; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        let { width, height } = img

        // 等比缩放
        if (width > props.maxWidth) {
          height = (height * props.maxWidth) / width
          width = props.maxWidth
        }

        canvas.width = width
        canvas.height = height

        // 绘制并导出 JPEG（减小体积）
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, compressedSize: blob.size })
            } else {
              reject(new Error('压缩失败'))
            }
          },
          'image/jpeg',
          props.compressQuality,
        )
      }
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

// 格式化文件大小
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// ==================== Mock 上传 ====================

async function mockUpload(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

// ==================== 上传处理 ====================

async function handleFiles(rawFiles: FileList | File[]) {
  const files = Array.from(rawFiles)
  const validFiles = validateFiles(files)

  if (validFiles.length === 0) return

  for (const file of validFiles) {
    const itemId = generateId()
    const originalSize = file.size

    // 创建待上传条目
    const imageItem: ImageItem = {
      id: itemId,
      url: '',
      file,
      status: 'uploading',
      progress: 0,
      originalSize,
      isCover: fileList.value.length === 0,
    }

    fileList.value.push(imageItem)

    try {
      // 压缩处理
      let uploadFile: File | Blob = file
      let compressedSize: number | undefined

      if (props.compress) {
        // 模拟进度：压缩阶段 0% -> 40%
        await simulateProgress(itemId, 0, 40, 300)
        const result = await compressImage(file)
        uploadFile = result.blob
        compressedSize = result.compressedSize

        // 更新压缩后大小
        const idx = fileList.value.findIndex((i) => i.id === itemId)
        if (idx !== -1) {
          fileList.value[idx].compressedSize = compressedSize
        }
      }

      // 模拟进度：上传阶段 40% -> 90%
      await simulateProgress(itemId, 40, 90, 500)

      // 执行上传
      const url = await mockUpload(uploadFile as File)

      // 完成进度
      await simulateProgress(itemId, 90, 100, 200)

      // 更新状态
      const idx = fileList.value.findIndex((i) => i.id === itemId)
      if (idx !== -1) {
        fileList.value[idx].url = url
        fileList.value[idx].status = 'success'
        fileList.value[idx].progress = 100
        if (compressedSize !== undefined) {
          fileList.value[idx].compressedSize = compressedSize
        }
      }
    } catch (err) {
      const idx = fileList.value.findIndex((i) => i.id === itemId)
      if (idx !== -1) {
        fileList.value[idx].status = 'error'
        fileList.value[idx].error =
          err instanceof Error ? err.message : '上传失败'
      }
      emit('error', err instanceof Error ? err : new Error(String(err)))
    }
  }

  emit(
    'change',
    validFiles,
    fileList.value
      .filter((f) => f.status === 'success')
      .map((f) => f.url),
  )
}

// 模拟进度更新
function simulateProgress(
  id: string,
  from: number,
  to: number,
  duration: number,
): Promise<void> {
  return new Promise((resolve) => {
    const steps = 10
    const stepDuration = duration / steps
    const stepValue = (to - from) / steps
    let current = from
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(from + stepValue * step, to)
      const idx = fileList.value.findIndex((i) => i.id === id)
      if (idx !== -1) {
        fileList.value[idx].progress = Math.round(current)
      }
      if (step >= steps) {
        clearInterval(timer)
        resolve()
      }
    }, stepDuration)
  })
}

// ==================== 事件处理 ====================

function handleClickUpload() {
  if (!canUpload.value || props.disabled) return
  inputRef.value?.click()
}

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    handleFiles(target.files)
  }
  target.value = ''
}

// 拖拽事件
function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (!canUpload.value || props.disabled) return
  isDragging.value = true
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  if (!canUpload.value || props.disabled) return
  if (e.dataTransfer?.files) {
    handleFiles(e.dataTransfer.files)
  }
}

// 删除图片
function removeImage(id: string) {
  const idx = fileList.value.findIndex((i) => i.id === id)
  if (idx === -1) return

  const removed = fileList.value.splice(idx, 1)[0]

  // 如果删除的是封面，自动将第一张设为封面
  if (removed.isCover && fileList.value.length > 0) {
    fileList.value[0].isCover = true
  }
}

// 设为封面
function setAsCover(id: string) {
  fileList.value.forEach((item) => {
    item.isCover = item.id === id
  })
}

// 重试上传
async function retryUpload(id: string) {
  const idx = fileList.value.findIndex((i) => i.id === id)
  if (idx === -1 || !fileList.value[idx].file) return

  const item = fileList.value[idx]
  item.status = 'uploading'
  item.progress = 0
  item.error = undefined

  try {
    let uploadFile: File | Blob = item.file!

    if (props.compress) {
      await simulateProgress(id, 0, 40, 300)
      const result = await compressImage(item.file!)
      uploadFile = result.blob
      item.compressedSize = result.compressedSize
    }

    await simulateProgress(id, 40, 90, 500)
    const url = await mockUpload(uploadFile as File)
    await simulateProgress(id, 90, 100, 200)

    item.url = url
    item.status = 'success'
    item.progress = 100
  } catch (err) {
    item.status = 'error'
    item.error = err instanceof Error ? err.message : '上传失败'
    emit('error', err instanceof Error ? err : new Error(String(err)))
  }
}

// 打开 Lightbox
function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxVisible.value = true
}

// 关闭 Lightbox
function closeLightbox() {
  lightboxVisible.value = false
}

// Lightbox 导航
function prevImage() {
  lightboxIndex.value =
    (lightboxIndex.value - 1 + lightboxImages.value.length) %
    lightboxImages.value.length
}

function nextImage() {
  lightboxIndex.value =
    (lightboxIndex.value + 1) % lightboxImages.value.length
}
</script>

<template>
  <div class="image-uploader" :class="{ 'is-disabled': disabled }">
    <!-- 图片预览网格 -->
    <div class="image-uploader__grid">
      <!-- 已上传图片卡片 -->
      <div
        v-for="(item, index) in fileList"
        :key="item.id"
        class="image-uploader__item"
        :class="[`image-uploader__item--${item.status}`]"
      >
        <!-- 缩略图 -->
        <div class="image-uploader__thumbnail" @click="openLightbox(index)">
          <img
            v-if="item.url"
            :src="item.url"
            alt="preview"
            class="image-uploader__img"
          />
          <!-- 占位符（上传中） -->
          <div v-else class="image-uploader__placeholder">
            <el-icon :size="28"><Picture /></el-icon>
          </div>

          <!-- 遮罩层 -->
          <div class="image-uploader__mask">
            <el-icon :size="22" class="image-uploader__zoom-icon">
              <ZoomIn />
            </el-icon>
          </div>

          <!-- 封面角标 -->
          <div v-if="item.isCover && item.status === 'success'" class="image-uploader__cover-badge">
            封面
          </div>

          <!-- 删除按钮 -->
          <button
            class="image-uploader__delete-btn"
            @click.stop="removeImage(item.id)"
            title="删除"
          >
            <el-icon :size="12"><Close /></el-icon>
          </button>

          <!-- 进度条（上传中） -->
          <div v-if="item.status === 'uploading'" class="image-uploader__progress-wrap">
            <div class="image-uploader__progress-bar">
              <div
                class="image-uploader__progress-inner"
                :style="{ width: `${item.progress}%` }"
              />
            </div>
            <span class="image-uploader__progress-text">{{ item.progress }}%</span>
          </div>

          <!-- 失败状态 -->
          <div v-if="item.status === 'error'" class="image-uploader__error-overlay">
            <span class="image-uploader__error-text">上传失败</span>
            <button
              class="image-uploader__retry-btn"
              @click.stop="retryUpload(item.id)"
            >
              <el-icon :size="14"><RefreshRight /></el-icon>
              重试
            </button>
          </div>
        </div>

        <!-- 操作栏 -->
        <div v-if="item.status === 'success'" class="image-uploader__actions">
          <!-- 压缩信息 -->
          <span
            v-if="
              showCompressInfo &&
              compress &&
              item.originalSize &&
              item.compressedSize
            "
            class="image-uploader__compress-info"
          >
            {{ formatSize(item.originalSize) }} &rarr;
            {{ formatSize(item.compressedSize!) }}
          </span>

          <!-- 设为封面按钮 -->
          <button
            v-if="!item.isCover && fileList.length > 1"
            class="image-uploader__cover-btn"
            @click="setAsCover(item.id)"
          >
            设为封面
          </button>
        </div>
      </div>

      <!-- 上传按钮（未达到上限时显示） -->
      <div
        v-if="canUpload"
        class="image-uploader__upload-area"
        :class="{ 'is-dragging': isDragging }"
        @click="handleClickUpload"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
      >
        <input
          ref="inputRef"
          type="file"
          :accept="accept"
          multiple
          hidden
          @change="handleChange"
        />
        <div class="image-uploader__upload-content">
          <el-icon :size="36" class="image-uploader__upload-icon">
            <Plus />
          </el-icon>
          <p class="image-uploader__upload-text">{{ uploadText }}</p>
          <p class="image-uploader__upload-hint">
            支持 JPG/PNG/GIF/WebP，单张不超过 {{ maxSize }}MB
          </p>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div v-if="fileList.length > 0" class="image-uploader__footer">
      <span class="image-uploader__count">
        已选 {{ fileList.filter(f => f.status === 'success').length }}/{{ maxCount }} 张
      </span>
    </div>

    <!-- Lightbox 全屏预览 -->
    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div
          v-if="lightboxVisible && lightboxImages.length > 0"
          class="image-uploader__lightbox"
          @click.self="closeLightbox"
        >
          <!-- 关闭按钮 -->
          <button
            class="image-uploader__lightbox-close"
            @click="closeLightbox"
          >
            <el-icon :size="24"><Close /></el-icon>
          </button>

          <!-- 上一张 -->
          <button
            v-if="lightboxImages.length > 1"
            class="image-uploader__lightbox-prev"
            @click.stop="prevImage"
          >
            &#8249;
          </button>

          <!-- 图片 -->
          <img
            :src="lightboxImages[lightboxIndex]"
            alt="preview"
            class="image-uploader__lightbox-img"
            @click.stop
          />

          <!-- 下一张 -->
          <button
            v-if="lightboxImages.length > 1"
            class="image-uploader__lightbox-next"
            @click.stop="nextImage"
          >
            &#8250;
          </button>

          <!-- 计数器 -->
          <div class="image-uploader__lightbox-counter">
            {{ lightboxIndex + 1 }} / {{ lightboxImages.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================================
   ImageUploader - 图片批量上传组件
   黑科易购校园服务平台品牌风格
   ============================================ */

.image-uploader {
  width: 100%;
  user-select: none;

  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

/* ====== 网格布局 ====== */
.image-uploader__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

/* ====== 图片卡片 ====== */
.image-uploader__item {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--duration-normal) $ease-out,
    box-shadow var(--duration-normal) $ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);

    .image-uploader__delete-btn {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }

    .image-uploader__mask {
      opacity: 1;
    }
  }
}

/* ====== 缩略图容器 ====== */
.image-uploader__thumbnail {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
}

.image-uploader__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) $ease-out;
}

.image-uploader__thumbnail:hover .image-uploader__img {
  transform: scale(1.08);
}

/* 占位符 */
.image-uploader__placeholder {
  @include flex-center(column);
  width: 100%;
  height: 100%;
  color: var(--color-text-quaternary);
  gap: 8px;
}

/* 遮罩层（hover 显示放大图标）*/
.image-uploader__mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 59, 128, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--duration-fast) $ease-out;
  pointer-events: none;
}

.image-uploader__zoom-icon {
  color: white;
}

/* ====== 封面角标 ====== */
.image-uploader__cover-badge {
  position: absolute;
  top: 0;
  left: 0;
  padding: 4px 10px;
  background: $color-primary;
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: 0 0 var(--radius-sm) 0;
  z-index: 2;
  line-height: 1.4;
}

/* ====== 删除按钮 ====== */
.image-uploader__delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.55);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.7);
  transition: all var(--duration-fast) $ease-out;
  z-index: 3;

  &:hover {
    background: $color-crimson-light;
    transform: scale(1.1) !important;
  }

  &:active {
    transform: scale(0.95) !important;
  }
}

/* ====== 进度条 ====== */
.image-uploader__progress-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 2;
}

.image-uploader__progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  overflow: hidden;
}

.image-uploader__progress-inner {
  height: 100%;
  background: linear-gradient(90deg, $color-primary-light, $color-primary-400);
  border-radius: 2px;
  transition: width 0.15s ease-out;
}

.image-uploader__progress-text {
  display: block;
  text-align: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4px;
  font-weight: 500;
}

/* ====== 错误状态 ====== */
.image-uploader__error-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 2;
}

.image-uploader__error-text {
  color: $color-crimson-light;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.image-uploader__retry-btn {
  @include flex-center(row);
  gap: 4px;
  padding: 6px 14px;
  background: white;
  color: $color-primary;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast) $ease-out;

  &:hover {
    background: $color-primary;
    color: white;
  }
}

/* ====== 操作栏 ====== */
.image-uploader__actions {
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  min-height: 32px;
}

.image-uploader__compress-info {
  font-size: 11px;
  color: $color-pine;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-uploader__cover-btn {
  flex-shrink: 0;
  padding: 3px 10px;
  background: transparent;
  color: $color-primary;
  border: 1px solid $color-primary-200;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast) $ease-out;
  white-space: nowrap;

  &:hover {
    background: $color-primary;
    color: white;
    border-color: $color-primary;
  }
}

/* ====== 上传区域 ====== */
.image-uploader__upload-area {
  aspect-ratio: 1;
  border: 2px dashed var(--color-divider-opaque);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-normal) $ease-out;
  background: var(--color-surface-secondary);

  &:hover:not(.is-dragging) {
    border-color: $color-primary-300;
    background: $color-primary-50;
  }

  &.is-dragging {
    border-style: solid;
    border-color: $color-primary;
    background: $color-primary-50;
    transform: scale(1.02);
  }
}

.image-uploader__upload-content {
  @include flex-center(column);
  height: 100%;
  gap: 8px;
  padding: 16px;
}

.image-uploader__upload-icon {
  color: var(--color-text-quaternary);
  transition: color var(--duration-normal) $ease-out;
}

.image-uploader__upload-area:hover .image-uploader__upload-icon,
.image-uploader__upload-area.is-dragging .image-uploader__upload-icon {
  color: $color-primary;
}

.image-uploader__upload-text {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.4;
}

.image-uploader__upload-hint {
  margin: 0;
  font-size: 11px;
  color: var(--color-text-quaternary);
  text-align: center;
  line-height: 1.3;
}

/* ====== 底部信息 ====== */
.image-uploader__footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.image-uploader__count {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* ====== Lightbox 全屏预览 ====== */
.image-uploader__lightbox {
  position: fixed;
  inset: 0;
  z-index: $z-index-modal;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 80px;
}

.image-uploader__lightbox-close {
  position: absolute;
  top: 20px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) $ease-out;
  z-index: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: rotate(90deg);
  }
}

.image-uploader__lightbox-img {
  max-width: 100%;
  max-height: calc(100vh - 120px);
  object-fit: contain;
  border-radius: var(--radius-sm);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.image-uploader__lightbox-prev,
.image-uploader__lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border: none;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) $ease-out;
  line-height: 1;
  padding-bottom: 2px;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}

.image-uploader__lightbox-prev {
  left: 20px;
}

.image-uploader__lightbox-next {
  right: 20px;
}

.image-uploader__lightbox-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 18px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 500;
  border-radius: var(--radius-full);
  backdrop-filter: blur(8px);
}

/* ====== Lightbox 过渡动画 ====== */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity var(--duration-slow) $ease-out;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
