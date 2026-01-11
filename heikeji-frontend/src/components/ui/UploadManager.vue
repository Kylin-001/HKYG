<!--
@fileoverview 文件上传管理组件
@description 支持拖拽上传、进度显示、文件预览、批量处理等功能
@example
  <UploadManager
    :upload-url="uploadUrl"
    :max-file-size="50 * 1024 * 1024"
    :accept="['image/*', '.pdf', '.doc', '.docx']"
    :max-files="10"
    @success="handleUploadSuccess"
    @error="handleUploadError"
    @progress="handleUploadProgress"
    @remove="handleRemoveFile"
  />
-->
<template>
  <div class="upload-manager">
    <!-- 上传区域 -->
    <div
      class="upload-area"
      :class="{
        dragging: isDragging,
        disabled: disabled,
        'has-files': fileList.length > 0,
      }"
      @dragover.prevent="handleDragOver"
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="handleClickUpload"
    >
      <!-- 拖拽提示 -->
      <div class="drag-tip" v-if="isDragging">
        <el-icon class="drag-icon"><UploadFilled /></el-icon>
        <p>松开鼠标，开始上传</p>
      </div>

      <!-- 默认上传提示 -->
      <div class="upload-tip" v-else>
        <el-icon class="upload-icon"><UploadFilled /></el-icon>
        <p class="tip-text">{{ uploadText }}</p>
        <p class="tip-hint">{{ uploadHint }}</p>
      </div>

      <!-- 上传按钮 -->
      <input
        ref="fileInput"
        type="file"
        :multiple="maxFiles > 1"
        :accept="accept.join(',')"
        :disabled="disabled"
        style="display: none"
        @change="handleFileChange"
      />
      <el-button type="primary" :disabled="disabled" :icon="h(Upload)" class="upload-button">
        选择文件
      </el-button>
    </div>

    <!-- 文件列表 -->
    <div class="file-list" v-if="fileList.length > 0">
      <div
        v-for="(file, index) in fileList"
        :key="file.uid || index"
        class="file-item"
        :class="{
          success: file.status === 'success',
          error: file.status === 'error',
          uploading: file.status === 'uploading',
        }"
      >
        <!-- 文件信息 -->
        <div class="file-info">
          <div class="file-icon">
            <el-icon v-if="isImageFile(file)" class="image-icon"><Picture /></el-icon>
            <el-icon v-else-if="isPdfFile(file)" class="pdf-icon"><Document /></el-icon>
            <el-icon v-else-if="isDocFile(file)" class="doc-icon"><Document /></el-icon>
            <el-icon v-else-if="isVideoFile(file)" class="video-icon"><VideoCamera /></el-icon>
            <el-icon v-else class="file-type-icon"><Document /></el-icon>
          </div>

          <div class="file-details">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-meta">
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <span class="file-status" v-if="file.status === 'uploading'">上传中</span>
              <span class="file-status success" v-else-if="file.status === 'success'"
                >上传成功</span
              >
              <span class="file-status error" v-else-if="file.status === 'error'">上传失败</span>
              <span class="file-status" v-else-if="file.status === 'pending'">等待上传</span>
            </div>
          </div>
        </div>

        <!-- 上传进度 -->
        <div class="file-progress" v-if="file.status === 'uploading'">
          <el-progress
            type="line"
            :percentage="file.progress || 0"
            :stroke-width="4"
            :show-text="false"
            class="progress-bar"
          />
          <span class="progress-text">{{ file.progress || 0 }}%</span>
        </div>

        <!-- 操作按钮 -->
        <div class="file-actions">
          <!-- 预览按钮 -->
          <el-button
            v-if="showPreview && canPreview(file)"
            type="text"
            size="small"
            :icon="h(View)"
            @click.stop="handlePreview(file)"
          >
            预览
          </el-button>

          <!-- 重试按钮 -->
          <el-button
            v-if="file.status === 'error' && !disabled"
            type="text"
            size="small"
            :icon="h(Reload)"
            class="retry-btn"
            @click.stop="handleRetry(file, index)"
          >
            重试
          </el-button>

          <!-- 取消按钮 -->
          <el-button
            v-if="file.status === 'uploading' && !disabled"
            type="text"
            size="small"
            :icon="h(Close)"
            class="cancel-btn"
            @click.stop="handleCancel(file, index)"
          >
            取消
          </el-button>

          <!-- 删除按钮 -->
          <el-button
            v-if="!disabled"
            type="text"
            size="small"
            :icon="h(Delete)"
            class="delete-btn"
            @click.stop="handleRemove(file, index)"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- 批量操作工具栏 -->
    <div class="batch-actions" v-if="showBatchActions && fileList.length > 0 && !disabled">
      <div class="action-left">
        <span class="selected-count"
          >已选择 {{ selectedFiles.length }} / {{ fileList.length }}</span
        >
      </div>
      <div class="action-right">
        <el-button
          type="primary"
          :disabled="selectedFiles.length === 0"
          @click="handleBatchUpload"
          :icon="h(Upload)"
          size="small"
        >
          批量上传
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedFiles.length === 0"
          @click="handleBatchRemove"
          :icon="h(Delete)"
          size="small"
        >
          批量删除
        </el-button>
        <el-button
          @click="handleClearAll"
          :disabled="fileList.length === 0"
          :icon="h(Delete)"
          size="small"
        >
          清空列表
        </el-button>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      :title="previewTitle"
      :width="previewWidth"
      :destroy-on-close="true"
      @closed="handlePreviewClose"
    >
      <!-- 图片预览 -->
      <div class="preview-content image-preview" v-if="previewType === 'image'">
        <img :src="previewUrl" alt="预览图片" class="preview-image" />
      </div>

      <!-- PDF预览 -->
      <div class="preview-content pdf-preview" v-else-if="previewType === 'pdf'">
        <iframe :src="previewUrl" frameborder="0" class="preview-pdf"></iframe>
      </div>

      <!-- 视频预览 -->
      <div class="preview-content video-preview" v-else-if="previewType === 'video'">
        <video :src="previewUrl" controls class="preview-video"></video>
      </div>

      <!-- 文本预览 -->
      <div class="preview-content text-preview" v-else-if="previewType === 'text'">
        <pre class="preview-text">{{ previewTextContent }}</pre>
      </div>

      <!-- 其他文件类型预览 -->
      <div class="preview-content other-preview" v-else>
        <div class="other-preview-tip">
          <el-icon class="other-icon"><Document /></el-icon>
          <p>无法预览该文件类型</p>
          <p class="other-hint">{{ previewTitle }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, h, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Upload,
  UploadFilled,
  Picture,
  Document,
  VideoCamera,
  View,
  Reload,
  Close,
  Delete,
} from '@element-plus/icons-vue'

// 定义接口
interface UploadFile {
  uid?: string
  name: string
  size: number
  type: string
  status?: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  response?: any
  url?: string
  raw?: File
  [key: string]: any
}

interface UploadManagerProps {
  // 上传配置
  uploadUrl?: string
  method?: 'post' | 'put'
  headers?: Record<string, string>
  data?: Record<string, any>
  withCredentials?: boolean
  // 文件限制
  maxFileSize?: number
  maxFiles?: number
  accept?: string[]
  // UI配置
  uploadText?: string
  uploadHint?: string
  disabled?: boolean
  showPreview?: boolean
  showBatchActions?: boolean
  previewWidth?: string
  // 文件列表
  modelValue?: UploadFile[]
  // 自动上传
  autoUpload?: boolean
}

// 定义组件属性
const props = withDefaults(defineProps<UploadManagerProps>(), {
  uploadUrl: '',
  method: 'post',
  headers: () => ({}),
  data: () => ({}),
  withCredentials: false,
  maxFileSize: 10 * 1024 * 1024, // 默认10MB
  maxFiles: 5,
  accept: () => ['*'],
  uploadText: '点击或拖拽文件到此处上传',
  uploadHint: '支持单个或批量上传，单次最多上传5个文件',
  disabled: false,
  showPreview: true,
  showBatchActions: true,
  previewWidth: '80%',
  modelValue: () => [],
  autoUpload: true,
})

// 定义事件
const emit = defineEmits<{
  // 上传事件
  (e: 'update:modelValue', fileList: UploadFile[]): void
  (e: 'success', file: UploadFile, response: any): void
  (e: 'error', file: UploadFile, error: any): void
  (e: 'progress', file: UploadFile, progress: number): void
  (e: 'remove', file: UploadFile, index: number): void
  (e: 'preview', file: UploadFile): void
  // 批量操作事件
  (e: 'batch-success', files: UploadFile[]): void
  (e: 'batch-error', files: UploadFile[]): void
  // 其他事件
  (e: 'change', fileList: UploadFile[]): void
  (e: 'before-upload', file: File): boolean | Promise<boolean>
}>()

// 响应式数据
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const fileList = ref<UploadFile[]>([...props.modelValue])
const selectedFiles = ref<UploadFile[]>([])

// 预览相关
const previewVisible = ref(false)
const previewUrl = ref('')
const previewTitle = ref('')
const previewType = ref('other')
const previewWidth = ref(props.previewWidth)
const previewTextContent = ref('')

// 上传中的文件
const uploadingFiles = ref<Set<string>>(new Set())

// 计算属性
const uploadHint = computed(() => {
  return `支持单个或批量上传，单次最多上传${props.maxFiles}个文件，单个文件不超过${formatFileSize(props.maxFileSize)}`
})

// 监听modelValue变化
watch(
  () => props.modelValue,
  newValue => {
    fileList.value = [...newValue]
  },
  { deep: true, immediate: true }
)

// 监听fileList变化
watch(
  () => fileList.value,
  newValue => {
    emit('update:modelValue', [...newValue])
    emit('change', [...newValue])
  },
  { deep: true }
)

// 文件类型判断
const isImageFile = (file: UploadFile): boolean => {
  return (
    file.type.startsWith('image/') ||
    ['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(getFileExtension(file.name))
  )
}

const isPdfFile = (file: UploadFile): boolean => {
  return file.type === 'application/pdf' || file.name.endsWith('.pdf')
}

const isDocFile = (file: UploadFile): boolean => {
  const extensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.md']
  return extensions.includes(getFileExtension(file.name))
}

const isVideoFile = (file: UploadFile): boolean => {
  return (
    file.type.startsWith('video/') ||
    ['.mp4', '.avi', '.mov', '.wmv', '.flv'].includes(getFileExtension(file.name))
  )
}

const isTextFile = (file: UploadFile): boolean => {
  const extensions = ['.txt', '.md', '.json', '.xml', '.html', '.css', '.js', '.ts', '.vue']
  return file.type.startsWith('text/') || extensions.includes(getFileExtension(file.name))
}

// 获取文件扩展名
const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.')
  return lastDotIndex > 0 ? filename.slice(lastDotIndex).toLowerCase() : ''
}

// 格式化文件大小
const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} B`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  } else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }
}

// 判断文件是否可以预览
const canPreview = (file: UploadFile): boolean => {
  return isImageFile(file) || isPdfFile(file) || isVideoFile(file) || isTextFile(file)
}

// 处理拖拽事件
const handleDragOver = () => {
  isDragging.value = true
}

const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

// 处理点击上传
const handleClickUpload = () => {
  if (disabled.value) return
  fileInput.value?.click()
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const { files } = target
  if (files) {
    handleFiles(Array.from(files))
  }
  // 清空input值，允许重新选择相同文件
  target.value = ''
}

// 处理文件
const handleFiles = async (files: File[]) => {
  // 检查文件数量
  if (fileList.value.length + files.length > props.maxFiles) {
    ElMessage.warning(`最多只能上传${props.maxFiles}个文件`)
    return
  }

  const newFiles: UploadFile[] = []

  // 逐个处理文件
  for (const file of files) {
    // 检查文件大小
    if (file.size > props.maxFileSize) {
      ElMessage.warning(`文件${file.name}超过最大限制${formatFileSize(props.maxFileSize)}`)
      continue
    }

    // 检查文件类型
    if (!isFileAcceptable(file)) {
      ElMessage.warning(`文件${file.name}类型不被允许`)
      continue
    }

    // 触发before-upload事件
    const beforeUploadResult = emit('before-upload', file)
    let canUpload = true

    if (beforeUploadResult instanceof Promise) {
      canUpload = await beforeUploadResult
    } else if (typeof beforeUploadResult === 'boolean') {
      canUpload = beforeUploadResult
    }

    if (!canUpload) {
      continue
    }

    // 创建文件对象
    const uploadFile: UploadFile = {
      uid: Date.now() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
      raw: file,
    }

    newFiles.push(uploadFile)
  }

  // 添加到文件列表
  fileList.value = [...fileList.value, ...newFiles]

  // 自动上传
  if (props.autoUpload && newFiles.length > 0) {
    await nextTick()
    uploadFiles(newFiles)
  }
}

// 检查文件类型是否允许
const isFileAcceptable = (file: File): boolean => {
  if (props.accept.includes('*')) return true

  const fileType = file.type
  const fileExtension = getFileExtension(file.name)

  return props.accept.some(acceptType => {
    if (acceptType.startsWith('.')) {
      return fileExtension === acceptType
    } else if (acceptType.endsWith('/*')) {
      return fileType.startsWith(acceptType.slice(0, -2))
    } else {
      return fileType === acceptType
    }
  })
}

// 上传文件
const uploadFiles = async (files: UploadFile[]) => {
  for (const file of files) {
    await uploadFile(file)
  }
}

// 上传单个文件
const uploadFile = async (file: UploadFile) => {
  if (!file.raw || !props.uploadUrl) {
    return
  }

  // 设置文件状态为上传中
  file.status = 'uploading'
  file.progress = 0
  uploadingFiles.value.add(file.uid || '')

  try {
    const formData = new FormData()
    formData.append('file', file.raw)

    // 添加额外数据
    for (const [key, value] of Object.entries(props.data)) {
      formData.append(key, value)
    }

    // 创建XHR请求
    const xhr = new XMLHttpRequest()

    // 监听进度
    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100)
        file.progress = progress
        emit('progress', file, progress)
      }
    })

    // 监听完成
    const response = await new Promise<any>((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText))
          } catch (e) {
            resolve(xhr.responseText)
          }
        } else {
          reject(new Error(`上传失败: ${xhr.statusText}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('网络错误'))
      }

      // 发送请求
      xhr.open(props.method, props.uploadUrl!, true)
      xhr.withCredentials = props.withCredentials

      // 设置请求头
      for (const [key, value] of Object.entries(props.headers)) {
        xhr.setRequestHeader(key, value)
      }

      xhr.send(formData)
    })

    // 上传成功
    file.status = 'success'
    file.progress = 100
    file.response = response
    uploadingFiles.value.delete(file.uid || '')
    emit('success', file, response)
  } catch (error) {
    // 上传失败
    file.status = 'error'
    uploadingFiles.value.delete(file.uid || '')
    emit('error', file, error)
    ElMessage.error(`文件${file.name}上传失败`)
  }
}

// 删除文件
const handleRemove = (file: UploadFile, index: number) => {
  fileList.value.splice(index, 1)
  emit('remove', file, index)
}

// 重试上传
const handleRetry = async (file: UploadFile, index: number) => {
  await uploadFile(file)
}

// 取消上传
const handleCancel = (file: UploadFile, index: number) => {
  file.status = 'pending'
  file.progress = 0
  uploadingFiles.value.delete(file.uid || '')
}

// 预览文件
const handlePreview = async (file: UploadFile) => {
  previewTitle.value = file.name
  previewVisible.value = true

  if (isImageFile(file)) {
    previewType.value = 'image'
    previewUrl.value = file.url || URL.createObjectURL(file.raw!)
  } else if (isPdfFile(file)) {
    previewType.value = 'pdf'
    previewUrl.value = file.url || URL.createObjectURL(file.raw!)
  } else if (isVideoFile(file)) {
    previewType.value = 'video'
    previewUrl.value = file.url || URL.createObjectURL(file.raw!)
  } else if (isTextFile(file)) {
    previewType.value = 'text'
    await loadTextFile(file)
  } else {
    previewType.value = 'other'
  }

  emit('preview', file)
}

// 加载文本文件内容
const loadTextFile = (file: UploadFile) => {
  return new Promise<void>((resolve, reject) => {
    if (!file.raw) {
      resolve()
      return
    }

    const reader = new FileReader()
    reader.onload = e => {
      previewTextContent.value = e.target?.result as string
      resolve()
    }
    reader.onerror = reject
    reader.readAsText(file.raw)
  })
}

// 关闭预览
const handlePreviewClose = () => {
  previewUrl.value = ''
  previewTextContent.value = ''
  previewType.value = 'other'
}

// 批量上传
const handleBatchUpload = () => {
  const pendingFiles = fileList.value.filter(
    file => file.status === 'pending' || file.status === 'error'
  )
  if (pendingFiles.length === 0) {
    ElMessage.info('没有待上传的文件')
    return
  }
  uploadFiles(pendingFiles)
}

// 批量删除
const handleBatchRemove = () => {
  if (selectedFiles.value.length === 0) {
    ElMessage.warning('请选择要删除的文件')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的${selectedFiles.value.length}个文件吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      for (const file of selectedFiles.value) {
        const index = fileList.value.findIndex(f => f.uid === file.uid)
        if (index !== -1) {
          handleRemove(file, index)
        }
      }
      selectedFiles.value = []
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 取消删除
    })
}

// 清空列表
const handleClearAll = () => {
  if (fileList.value.length === 0) {
    ElMessage.info('文件列表已空')
    return
  }

  ElMessageBox.confirm('确定要清空所有文件吗？', '清空确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      fileList.value = []
      selectedFiles.value = []
      ElMessage.success('清空成功')
    })
    .catch(() => {
      // 取消清空
    })
}

// 组件挂载
onMounted(() => {
  // 初始化文件列表
  fileList.value = [...props.modelValue]
})
</script>

<style lang="scss" scoped>
.upload-manager {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  // 上传区域
  .upload-area {
    position: relative;
    padding: 32px;
    border: 2px dashed #dcdfe6;
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    background-color: #fafafa;

    &:hover {
      border-color: #409eff;
      background-color: #ecf5ff;
    }

    &.dragging {
      border-color: #409eff;
      background-color: #ecf5ff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;

      &:hover {
        border-color: #dcdfe6;
        background-color: #fafafa;
      }
    }

    &.has-files {
      border-style: solid;
      border-color: #e4e7ed;
      background-color: #f5f7fa;
    }

    // 拖拽提示
    .drag-tip {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      .drag-icon {
        font-size: 48px;
        color: #409eff;
      }

      p {
        font-size: 16px;
        color: #303133;
      }
    }

    // 上传提示
    .upload-tip {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;

      .upload-icon {
        font-size: 48px;
        color: #c0c4cc;
      }

      .tip-text {
        font-size: 16px;
        color: #303133;
      }

      .tip-hint {
        font-size: 12px;
        color: #909399;
      }
    }

    // 上传按钮
    .upload-button {
      margin-top: 16px;
    }
  }

  // 文件列表
  .file-list {
    margin-top: 16px;
    border-top: 1px solid #e4e7ed;
    padding-top: 16px;

    .file-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      border-radius: 6px;
      transition: all 0.3s ease;
      background-color: #fafafa;
      margin-bottom: 12px;

      &:hover {
        background-color: #ecf5ff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      &.success {
        border-left: 4px solid #67c23a;
      }

      &.error {
        border-left: 4px solid #f56c6c;
      }

      &.uploading {
        border-left: 4px solid #409eff;
      }

      // 文件信息
      .file-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;

        .file-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: #f0f2f5;
          border-radius: 4px;
          font-size: 20px;
          color: #409eff;

          .image-icon {
            color: #67c23a;
          }

          .pdf-icon {
            color: #f56c6c;
          }

          .doc-icon {
            color: #409eff;
          }

          .video-icon {
            color: #e6a23c;
          }

          .file-type-icon {
            color: #909399;
          }
        }

        .file-details {
          flex: 1;
          min-width: 0;

          .file-name {
            font-size: 14px;
            color: #303133;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .file-meta {
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: #909399;

            .file-size {
              color: #606266;
            }

            .file-status {
              &.success {
                color: #67c23a;
              }

              &.error {
                color: #f56c6c;
              }
            }
          }
        }
      }

      // 上传进度
      .file-progress {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 200px;

        .progress-bar {
          flex: 1;
        }

        .progress-text {
          font-size: 12px;
          color: #606266;
          min-width: 40px;
        }
      }

      // 操作按钮
      .file-actions {
        display: flex;
        gap: 8px;

        .el-button {
          padding: 4px 8px;
          font-size: 12px;

          &.retry-btn {
            color: #409eff;
          }

          &.cancel-btn {
            color: #909399;
          }

          &.delete-btn {
            color: #f56c6c;
          }
        }
      }
    }
  }

  // 批量操作工具栏
  .batch-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-top: 1px solid #e4e7ed;

    .action-left {
      .selected-count {
        font-size: 14px;
        color: #606266;
      }
    }

    .action-right {
      display: flex;
      gap: 8px;

      .el-button {
        padding: 4px 12px;
        font-size: 12px;
      }
    }
  }

  // 预览对话框
  .preview-content {
    padding: 16px;

    // 图片预览
    &.image-preview {
      text-align: center;

      .preview-image {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
      }
    }

    // PDF预览
    &.pdf-preview {
      .preview-pdf {
        width: 100%;
        height: 80vh;
      }
    }

    // 视频预览
    &.video-preview {
      text-align: center;

      .preview-video {
        width: 100%;
        max-height: 80vh;
      }
    }

    // 文本预览
    &.text-preview {
      .preview-text {
        width: 100%;
        max-height: 80vh;
        overflow: auto;
        padding: 16px;
        background-color: #f5f7fa;
        border-radius: 6px;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.5;
      }
    }

    // 其他文件预览
    &.other-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      gap: 16px;

      .other-preview-tip {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .other-icon {
          font-size: 48px;
          color: #c0c4cc;
        }

        p {
          font-size: 16px;
          color: #606266;
        }

        .other-hint {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .upload-manager {
    .upload-area {
      padding: 24px;

      .upload-tip {
        .tip-text {
          font-size: 14px;
        }

        .tip-hint {
          font-size: 12px;
        }
      }
    }

    .file-item {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;

      .file-progress {
        width: 100%;
      }

      .file-actions {
        justify-content: flex-end;
      }
    }

    .batch-actions {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;

      .action-left,
      .action-right {
        justify-content: center;
      }

      .action-right {
        flex-wrap: wrap;
      }
    }
  }
}
</style>
