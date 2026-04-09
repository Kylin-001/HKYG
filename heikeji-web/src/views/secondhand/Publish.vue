<template>
  <div class="publish-page">
    <div class="page-header">
      <div class="header-content max-w-screen-xl mx-auto px-4 lg:px-8">
        <router-link to="/secondhand" class="back-link">
          <el-icon><ArrowLeft /></el-icon>
          返回二手市场
        </router-link>
        <h1 class="page-title">发布闲置</h1>
      </div>
    </div>

    <div class="main-content max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <div class="form-layout">
        <form @submit.prevent="handleSubmit" class="publish-form" novalidate>
          <section class="form-section glass-effect rounded-2xl p-6 mb-6">
            <h2 class="section-title">
              <el-icon><PictureFilled /></el-icon>
              商品图片
              <span class="required-mark">*</span>
            </h2>
            <p class="section-hint">最多上传9张，第一张为封面图</p>

            <div
              class="upload-area"
              :class="{ 'is-dragover': isDragOver, 'has-images': images.length > 0 }"
              @dragenter.prevent="isDragOver = true"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="handleDrop"
              @click="$refs.fileInput?.click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                multiple
                hidden
                @change="handleFileSelect"
              />
              <div v-if="images.length === 0" class="upload-placeholder">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <p class="upload-text">点击或拖拽上传图片</p>
                <p class="upload-hint">支持 JPG、PNG 格式，单张不超过 5MB</p>
              </div>
              <div v-else class="image-grid">
                <div
                  v-for="(img, idx) in images"
                  :key="idx"
                  class="image-item"
                  :class="{ 'is-cover': idx === 0 }"
                >
                  <img :src="img.url" :alt="`图片${idx + 1}`" />
                  <span v-if="idx === 0" class="cover-badge">封面</span>
                  <button type="button" class="remove-btn" @click.stop="removeImage(idx)">
                    <el-icon><Close /></el-icon>
                  </button>
                </div>
                <button
                  v-if="images.length < 9"
                  type="button"
                  class="add-more-btn"
                  @click.stop="$refs.fileInput?.click()"
                >
                  <el-icon><Plus /></el-icon>
                </button>
              </div>
            </div>
          </section>

          <section class="form-section glass-effect rounded-2xl p-6 mb-6">
            <h2 class="section-title">
              <el-icon><EditPen /></el-icon>
              基本信息
            </h2>

            <div class="form-group">
              <label class="form-label">
                商品标题
                <span class="required-mark">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="请输入商品标题（5-50字）"
                class="form-input"
                :class="{ error: errors.title }"
                maxlength="50"
              />
              <span class="char-count">{{ form.title.length }}/50</span>
              <p v-if="errors.title" class="error-msg">{{ errors.title }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">商品分类 <span class="required-mark">*</span></label>
              <div class="category-select-grid">
                <button
                  v-for="cat in categories"
                  :key="cat.value"
                  type="button"
                  class="category-option"
                  :class="{ active: form.category === cat.value }"
                  @click="form.category = cat.value"
                >
                  <span class="cat-emoji">{{ cat.icon }}</span>
                  <span class="cat-name">{{ cat.label }}</span>
                </button>
              </div>
              <p v-if="errors.category" class="error-msg">{{ errors.category }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">成色描述 <span class="required-mark">*</span></label>
              <div class="condition-options">
                <button
                  v-for="cond in conditions"
                  :key="cond.value"
                  type="button"
                  class="condition-option"
                  :class="{ active: form.condition === cond.value }"
                  @click="form.condition = cond.value"
                >
                  <span class="cond-color" :style="{ background: cond.color }"></span>
                  {{ cond.label }}
                </button>
              </div>
              <p v-if="errors.condition" class="error-msg">{{ errors.condition }}</p>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">价格（元）<span class="required-mark">*</span></label>
                <div class="price-input-wrapper">
                  <span class="price-prefix">¥</span>
                  <input
                    v-model.number="form.price"
                    type="number"
                    placeholder="0.00"
                    class="form-input price-input"
                    :class="{ error: errors.price }"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p v-if="errors.price" class="error-msg">{{ errors.price }}</p>
              </div>
              <div class="form-group negotiable-group">
                <label class="toggle-label">
                  <input v-model="form.isNegotiable" type="checkbox" class="toggle-checkbox" />
                  <span class="toggle-switch"></span>
                  可议价
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">原价（元）</label>
              <div class="price-input-wrapper">
                <span class="price-prefix">¥</span>
                <input
                  v-model.number="form.originalPrice"
                  type="number"
                  placeholder="选填，显示折扣效果"
                  class="form-input price-input"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </section>

          <section class="form-section glass-effect rounded-2xl p-6 mb-6">
            <h2 class="section-title">
              <el-icon><Document /></el-icon>
              详细描述
            </h2>
            <textarea
              v-model="form.description"
              placeholder="详细描述你的物品信息，如：购买时间、使用情况、配件清单、出售原因等..."
              class="form-textarea"
              :class="{ error: errors.description }"
              rows="6"
              maxlength="2000"
            ></textarea>
            <div class="textarea-footer">
              <span class="char-count">{{ form.description.length }}/2000</span>
              <button type="button" class="ai-assist-btn" @click="handleAIAssist">
                <el-icon><MagicStick /></el-icon>
                AI 帮我写
              </button>
            </div>
            <p v-if="errors.description" class="error-msg">{{ errors.description }}</p>
          </section>

          <section class="form-section glass-effect rounded-2xl p-6 mb-6">
            <h2 class="section-title">
              <el-icon><Location /></el-icon>
              交易地点
            </h2>
            <div class="location-selector">
              <select v-model="form.area" class="form-select">
                <option value="">选择区域</option>
                <option value="A区">A区宿舍楼</option>
                <option value="B区">B区宿舍楼</option>
                <option value="C区">C区宿舍楼</option>
                <option value="D区">D区宿舍楼</option>
                <option value="图书馆">图书馆</option>
                <option value="体育馆">体育馆</option>
                <option value="食堂">食堂</option>
                <option value="其他">其他位置</option>
              </select>
              <input
                v-model="form.locationDetail"
                type="text"
                placeholder="具体位置（如：3栋512）"
                class="form-input"
              />
            </div>
          </section>

          <section class="form-section glass-effect rounded-2xl p-6 mb-6">
            <h2 class="section-title">
              <el-icon><Bell /></el-icon>
              交易设置
            </h2>
            <div class="settings-list">
              <label class="setting-item">
                <div class="setting-info">
                  <span class="setting-name">允许留言咨询</span>
                  <span class="setting-desc">其他用户可以给你留言</span>
                </div>
                <input v-model="form.allowComments" type="checkbox" checked class="switch-input" />
              </label>
              <label class="setting-item">
                <div class="setting-info">
                  <span class="setting-name">隐藏手机号</span>
                  <span class="setting-desc">保护个人隐私安全</span>
                </div>
                <input v-model="form.hidePhone" type="checkbox" checked class="switch-input" />
              </label>
              <label class="setting-item">
                <div class="setting-info">
                  <span class="setting-name">仅校内可见</span>
                  <span class="setting-desc">只有本校学生能看到</span>
                </div>
                <input v-model="form.campusOnly" type="checkbox" class="switch-input" />
              </label>
            </div>
          </section>

          <div class="form-actions">
            <button type="button" class="preview-btn" @click="showPreview = true">
              <el-icon><View /></el-icon>
              预览
            </button>
            <button type="submit" class="submit-btn" :disabled="submitting" :class="{ loading: submitting }">
              <template v-if="!submitting">
                <el-icon><Promotion /></el-icon>
                立即发布
              </template>
              <template v-else>
                <el-icon class="is-loading"><Loading /></el-icon>
                发布中...
              </template>
            </button>
          </div>
        </form>

        <aside class="tips-sidebar">
          <div class="tip-card glass-effect rounded-2xl p-5 sticky top-24">
            <h3 class="tip-title">
              <el-icon><InfoFilled /></el-icon>
              发布小贴士
            </h3>
            <ul class="tip-list">
              <li>📸 清晰的实物图能提高成交率 40%</li>
              <li>✍️ 标题简洁明了，突出核心卖点</li>
              <li>💰 合理定价，参考同类商品行情</li>
              <li>📝 描述越详细，买家信任度越高</li>
              <li>📍 准确填写方便面交的位置</li>
            </ul>
          </div>

          <div class="tip-card glass-effect rounded-2xl p-5 mt-4">
            <h3 class="tip-title">
              <el-icon><Warning /></el-icon>
              禁止发布
            </h3>
            <ul class="tip-list forbidden-list">
              <li>违禁品和非法物品</li>
              <li>假冒伪劣商品</li>
              <li>盗版书籍/软件</li>
              <li>虚假信息和诈骗内容</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showPreview" class="preview-modal-overlay" @click.self="showPreview = false">
          <div class="preview-modal glass-effect rounded-2xl overflow-hidden">
            <div class="preview-header">
              <h3>发布预览</h3>
              <button class="close-btn" @click="showPreview = false">
                <el-icon><Close /></el-icon>
              </button>
            </div>
            <div class="preview-body">
              <div class="preview-image">
                <img :src="images[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'" alt="预览图" />
              </div>
              <div class="preview-info">
                <h4>{{ form.title || '未填写标题' }}</h4>
                <div class="preview-price">
                  <span class="price-value">¥{{ form.price || 0 }}</span>
                  <span v-if="form.originalPrice" class="original-price">¥{{ form.originalPrice }}</span>
                  <span v-if="form.isNegotiable" class="negotiable-tag">可议价</span>
                </div>
                <div class="preview-tags">
                  <span v-if="form.condition" class="tag">{{ getConditionLabel(form.condition) }}</span>
                  <span v-if="form.category" class="tag">{{ getCategoryLabel(form.category) }}</span>
                </div>
                <p class="preview-desc">{{ form.description || '暂无描述' }}</p>
                <div class="preview-meta">
                  <span><el-icon><Location /></el-icon> {{ form.area }}{{ form.locationDetail }}</span>
                  <span><el-icon><Clock /></el-icon> 刚刚</span>
                </div>
              </div>
            </div>
            <div class="preview-footer">
              <button class="edit-btn" @click="showPreview = false">返回编辑</button>
              <button class="confirm-publish-btn" @click="handleConfirmPublish">确认发布</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, PictureFilled, Plus, Close, EditPen, Document,
  Location, Bell, MagicStick, View, Promotion, Loading,
  InfoFilled, Warning, Clock
} from '@element-plus/icons-vue'
import { useSecondhandStore } from '@/stores/secondhand'
import type { PublishSecondhandRequest, UploadedImage, ItemCondition } from '@/types/secondhand'

const router = useRouter()
const secondhandStore = useSecondhandStore()
const isDragOver = ref(false)
const showPreview = ref(false)
const submitting = ref(false)

const images = ref<UploadedImage[]>([])

const form = reactive({
  title: '',
  category: '',
  condition: '' as ItemCondition | '',
  price: null as number | null,
  originalPrice: null as number | null,
  isNegotiable: false,
  description: '',
  area: '',
  locationDetail: '',
  allowComments: true,
  hidePhone: true,
  campusOnly: false
})

const errors = reactive<Record<string, string>>({})

const categories = [
  { value: 'electronics', label: '数码产品', icon: '📱' },
  { value: 'books', label: '图书教材', icon: '📚' },
  { value: 'sports', label: '运动户外', icon: '⚽' },
  { value: 'daily', label: '生活用品', icon: '🏠' },
  { value: 'clothing', label: '服饰鞋包', icon: '👕' },
  { value: 'food', label: '食品零食', icon: '🍎' },
  { value: 'other', label: '其他', icon: '🎁' }
]

const conditions: { value: ItemCondition; label: string; color: string }[] = [
  { value: 'brand_new', label: '全新', color: '#10b981' },
  { value: 'like_new', label: '几乎全新', color: '#3b82f6' },
  { value: 'good', label: '良好', color: '#f59e0b' },
  { value: 'fair', label: '一般', color: '#9ca3af' }
]

function getConditionLabel(value: string): string {
  return conditions.find(c => c.value === value)?.label || value
}

function getCategoryLabel(value: string): string {
  return categories.find(c => c.value === value)?.label || value
}

function handleDrop(e: DragEvent) {
  isDragOver.value = false
  const files = e.dataTransfer?.files
  if (files) handleFiles(files)
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) handleFiles(input.files)
}

function handleFiles(fileList: FileList) {
  const remaining = 9 - images.value.length
  const files = Array.from(fileList).slice(0, remaining)

  files.forEach(file => {
    if (!file.type.startsWith('image/')) {
      ElMessage.warning(`${file.name} 不是图片文件`)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      ElMessage.warning(`${file.name} 超过5MB限制`)
      return
    }

    const url = URL.createObjectURL(file)
    images.value.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url,
      name: file.name,
      size: file.size,
      file
    })
  })
}

function removeImage(index: number) {
  URL.revokeObjectURL(images.value[index].url)
  images.value.splice(index, 1)
}

function validateForm(): boolean {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.title.trim()) {
    errors.title = '请输入商品标题'
  } else if (form.title.trim().length < 5) {
    errors.title = '标题至少需要5个字'
  }

  if (!form.category) {
    errors.category = '请选择商品分类'
  }

  if (!form.condition) {
    errors.condition = '请选择成色'
  }

  if (form.price === null || form.price <= 0) {
    errors.price = '请输入有效价格'
  }

  if (images.value.length === 0) {
    ElMessage.warning('请至少上传一张商品图片')
  }

  return Object.keys(errors).length === 0 && images.value.length > 0
}

async function handleSubmit() {
  if (!validateForm()) return

  submitting.value = true
  try {
    await secondhandStore.publishItem({
      title: form.title,
      description: form.description,
      price: form.price || 0,
      originalPrice: form.originalPrice || undefined,
      category: form.category,
      condition: form.condition as ItemCondition,
      isNegotiable: form.isNegotiable,
      images: images.value.map(img => img.url),
      location: `${form.area}${form.locationDetail}`,
    } as PublishSecondhandRequest)
    ElMessage.success('发布成功！')
    router.push('/secondhand')
  } catch {
    ElMessage.error('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

function handleConfirmPublish() {
  showPreview.value = false
  handleSubmit()
}

function handleAIAssist() {
  if (!form.title) {
    ElMessage.warning('请先填写商品标题')
    return
  }
  form.description = `【商品名称】${form.title}\n\n【购买信息】\n购入时间：\n购买渠道：\n\n【成色说明】\n\n【包含配件】\n\n【出售原因】\n\n【注意事项】`
  ElMessage.success('已生成描述模板，请补充完善')
}
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.25rem 0;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: white;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.form-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
}

.form-section {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.required-mark {
  color: #ef4444;
  margin-left: 0.125rem;
}

.section-hint {
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f0efff;
}

.upload-area.is-dragover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.08);
  transform: scale(1.01);
}

.upload-placeholder {
  padding: 2rem 0;
}

.upload-icon {
  font-size: 3rem;
  color: #c4b5fd;
  margin-bottom: 0.75rem;
}

.upload-text {
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.375rem;
}

.upload-hint {
  font-size: 0.8125rem;
  color: #9ca3af;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: default;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.125rem 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  opacity: 0;
  transition: all 0.2s;
}

.image-item:hover .remove-btn {
  opacity: 1;
}

.add-more-btn {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #9ca3af;
  transition: all 0.2s;
}

.add-more-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f0efff;
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.8125rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  outline: none;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.08);
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

.char-count {
  position: absolute;
  right: 0.75rem;
  bottom: -1.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.error-msg {
  font-size: 0.8125rem;
  color: #ef4444;
  margin-top: 0.375rem;
}

.category-select-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.625rem;
}

.category-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.875rem 0.5rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8125rem;
  color: #4b5563;
}

.category-option:hover {
  border-color: #c4b5fd;
  background: #faf5ff;
}

.category-option.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(118, 75, 162, 0.06) 100%);
  color: #667eea;
  font-weight: 600;
}

.cat-emoji {
  font-size: 1.5rem;
}

.condition-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.condition-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 9999px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: #4b5563;
}

.condition-option:hover {
  border-color: #c4b5fd;
}

.condition-option.active {
  border-width: 2px;
  font-weight: 600;
}

.cond-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.form-row {
  display: flex;
  gap: 1.25rem;
  align-items: flex-end;
}

.flex-1 {
  flex: 1;
}

.negotiable-group {
  flex-shrink: 0;
  padding-bottom: 0.25rem;
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.price-prefix {
  position: absolute;
  left: 1rem;
  font-weight: 700;
  color: #9ca3af;
  font-size: 1rem;
}

.price-input {
  padding-left: 2.25rem !important;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #4b5563;
  user-select: none;
}

.toggle-checkbox {
  display: none;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border-radius: 9999px;
  position: relative;
  transition: background 0.3s;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle-checkbox:checked + .toggle-switch {
  background: #667eea;
}

.toggle-checkbox:checked + .toggle-switch::after {
  transform: translateX(20px);
}

.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  outline: none;
  resize: vertical;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
  line-height: 1.6;
  box-sizing: border-box;
}

.form-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.08);
}

.form-textarea.error {
  border-color: #ef4444;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.ai-assist-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, #f0efff 0%, #ede9fe 100%);
  color: #667eea;
  border: 1px solid #c4b5fd;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-assist-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.form-select {
  width: 100%;
  padding: 0.8125rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  outline: none;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
  margin-bottom: 0.75rem;
  appearance: auto;
}

.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.08);
}

.location-selector {
  display: flex;
  flex-direction: column;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.setting-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1f2937;
}

.setting-desc {
  font-size: 0.75rem;
  color: #9ca3af;
}

.switch-input {
  width: 44px;
  height: 24px;
  appearance: none;
  background: #d1d5db;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
  flex-shrink: 0;
}

.switch-input::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.switch-input:checked {
  background: #667eea;
}

.switch-input:checked::before {
  transform: translateX(20px);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.preview-btn,
.submit-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9375rem 2rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.preview-btn {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.preview-btn:hover {
  background: #f0efff;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-btn:hover:not(:disabled):not(.loading) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.45);
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.tips-sidebar {
  display: flex;
  flex-direction: column;
}

.tip-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.tip-title {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.tip-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-list li {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.8;
  padding-left: 0.25rem;
}

.forbidden-list li::before {
  content: '⛔ ';
}

.preview-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.preview-modal {
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.preview-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
}

.preview-body {
  padding: 1.5rem;
}

.preview-image {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.25rem;
  aspect-ratio: 4/3;
  background: #f3f4f6;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-info h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.preview-price {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
}

.preview-price .price-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ef4444;
}

.preview-price .original-price {
  font-size: 0.9375rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.negotiable-tag {
  padding: 0.125rem 0.5rem;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.preview-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tag {
  padding: 0.25rem 0.625rem;
  background: #f0efff;
  color: #667eea;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.preview-desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.preview-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.preview-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.edit-btn,
.confirm-publish-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.edit-btn {
  background: #f3f4f6;
  color: #4b5563;
}

.edit-btn:hover {
  background: #e5e7eb;
}

.confirm-publish-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.confirm-publish-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-fade-enter-active {
  transition: opacity 0.3s ease;
}

.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .form-layout {
    grid-template-columns: 1fr;
  }

  .tips-sidebar {
    display: none;
  }
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .negotiable-group {
    margin-top: 0.5rem;
    padding-bottom: 0;
  }

  .category-select-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .image-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .condition-options {
    flex-wrap: wrap;
  }

  .condition-option {
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .preview-modal {
    max-height: 95vh;
    border-radius: 16px;
  }
}
</style>
