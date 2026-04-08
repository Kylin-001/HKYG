<template>
  <div class="secondhand-detail-page">
    <div class="detail-container max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <nav class="breadcrumb mb-6">
        <router-link to="/secondhand" class="breadcrumb-link">二手市场</router-link>
        <span class="separator">/</span>
        <span class="current">商品详情</span>
      </nav>

      <div v-if="loading" class="loading-skeleton">
        <Skeleton type="card" />
      </div>

      <div v-else-if="item" class="detail-layout">
        <div class="main-section">
          <div class="image-gallery glass-effect rounded-2xl overflow-hidden">
            <div class="gallery-main">
              <img :src="item.images[currentImageIndex]" :alt="item.title" class="main-image" />
              <button
                v-if="item.images.length > 1"
                class="nav-btn prev"
                @click="prevImage"
              >
                <el-icon><ArrowLeft /></el-icon>
              </button>
              <button
                v-if="item.images.length > 1"
                class="nav-btn next"
                @click="nextImage"
              >
                <el-icon><ArrowRight /></el-icon>
              </button>
              <span class="image-counter">{{ currentImageIndex + 1 }} / {{ item.images.length }}</span>
            </div>
            <div v-if="item.images.length > 1" class="thumbnail-list">
              <button
                v-for="(img, idx) in item.images"
                :key="idx"
                class="thumbnail-item"
                :class="{ active: idx === currentImageIndex }"
                @click="currentImageIndex = idx"
              >
                <img :src="img" :alt="`${item.title} - 图${idx + 1}`" />
              </button>
            </div>
          </div>

          <div class="info-card glass-effect rounded-2xl p-6 mt-6">
            <div class="title-row">
              <h1 class="item-title">{{ item.title }}</h1>
              <button class="share-btn" @click="handleShare">
                <el-icon><Share /></el-icon>
              </button>
            </div>

            <div class="price-row">
              <div class="price-main">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ item.price }}</span>
                <span v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</span>
                <span v-if="item.originalPrice" class="discount-tag">
                  省¥{{ item.originalPrice - item.price }}
                </span>
              </div>
              <span v-if="item.isNegotiable" class="negotiable-tag">可议价</span>
            </div>

            <div class="tags-row">
              <span class="condition-tag" :class="item.condition">{{ getConditionLabel(item.condition) }}</span>
              <span class="category-tag">{{ getCategoryLabel(item.category) }}</span>
            </div>

            <div class="meta-info-grid">
              <div class="meta-item">
                <el-icon><View /></el-icon>
                <span>{{ item.views }} 次浏览</span>
              </div>
              <div class="meta-item">
                <el-icon><Clock /></el-icon>
                <span>{{ formatTime(item.publishTime) }}发布</span>
              </div>
              <div class="meta-item">
                <el-icon><Location /></el-icon>
                <span>{{ item.location }}</span>
              </div>
              <div class="meta-item">
                <el-icon><ChatDotRound /></el-icon>
                <span>{{ item.commentCount || 0 }} 条留言</span>
              </div>
            </div>
          </div>

          <div class="description-card glass-effect rounded-2xl p-6 mt-6">
            <h3 class="section-title">商品描述</h3>
            <div class="description-content" :class="{ expanded: descExpanded }">
              <p>{{ item.description }}</p>
            </div>
            <button v-if="item.description.length > 100" class="expand-btn" @click="descExpanded = !descExpanded">
              {{ descExpanded ? '收起' : '展开全部' }}
              <el-icon><ArrowDown :class="{ rotated: descExpanded }" /></el-icon>
            </button>
          </div>

          <div class="seller-card glass-effect rounded-2xl p-6 mt-6">
            <div class="seller-header">
              <div class="seller-avatar-wrapper">
                <img :src="item.sellerAvatar || defaultAvatar" :alt="item.sellerName" class="seller-avatar" />
                <span class="online-status online"></span>
              </div>
              <div class="seller-info">
                <h4 class="seller-name">{{ item.sellerName }}</h4>
                <div class="seller-stats">
                  <span>信用: 良好</span>
                  <span class="divider">|</span>
                  <span>已售 {{ item.sellerSoldCount || 23 }} 件</span>
                  <span class="divider">|</span>
                  <span>入驻 {{ item.sellerDays || 180 }} 天</span>
                </div>
              </div>
              <router-link to="/user/profile" class="view-seller-btn">查看主页</router-link>
            </div>
          </div>

          <div class="comments-card glass-effect rounded-2xl p-6 mt-6">
            <h3 class="section-title">
              留言咨询 ({{ comments.length }})
            </h3>
            <div class="comment-input-area">
              <textarea
                v-model="newComment"
                placeholder="想了解什么？问问卖家吧..."
                class="comment-textarea"
                rows="3"
                maxlength="200"
              ></textarea>
              <div class="comment-actions">
                <span class="char-count">{{ newComment.length }}/200</span>
                <button class="send-comment-btn" :disabled="!newComment.trim()" @click="sendComment">
                  发送
                </button>
              </div>
            </div>
            <div class="comments-list">
              <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <img :src="comment.avatar || defaultAvatar" :alt="comment.author" class="comment-avatar" />
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.author }}</span>
                    <span class="comment-time">{{ formatTime(comment.time) }}</span>
                  </div>
                  <p class="comment-content">{{ comment.content }}</p>
                  <div v-if="comment.reply" class="comment-reply">
                    <span class="reply-label">卖家回复：</span>
                    {{ comment.reply }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside class="sidebar-section">
          <div class="action-card glass-effect rounded-2xl p-6 sticky top-24">
            <div class="action-buttons">
              <button class="primary-action-btn" @click="handleContact">
                <el-icon><ChatDotRound /></el-icon>
                我想要
              </button>
              <button class="secondary-action-btn" @click="toggleFavorite">
                <el-icon>
                  <StarFilled v-if="isFavorited" /><Star v-else />
                </el-icon>
                {{ isFavorited ? '已收藏' : '收藏' }}
              </button>
            </div>

            <div class="safety-tips mt-6">
              <h4 class="tips-title">
                <el-icon><Warning /></el-icon>
                安全提示
              </h4>
              <ul class="tips-list">
                <li>建议当面交易，验货后再付款</li>
                <li>不要提前转账或扫码支付</li>
                <li>保留交易凭证，有问题及时反馈</li>
                <li>优先选择校内面交地点</li>
              </ul>
            </div>

            <div class="report-section mt-4">
              <button class="report-btn" @click="handleReport">
                <el-icon><Warning /></el-icon>
                举报该商品
              </button>
            </div>
          </div>

          <div class="similar-items-card glass-effect rounded-2xl p-6 mt-4">
            <h3 class="sidebar-section-title">相似推荐</h3>
            <div class="similar-list">
              <router-link
                v-for="sim in similarItems"
                :key="sim.id"
                :to="`/secondhand/${sim.id}`"
                class="similar-item"
              >
                <img :src="sim.images[0]" :alt="sim.title" class="similar-img" />
                <div class="similar-info">
                  <p class="similar-title">{{ sim.title }}</p>
                  <span class="similar-price">¥{{ sim.price }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <div v-if="item && !loading" class="mobile-bottom-bar md:hidden">
      <div class="mobile-actions">
        <button class="mobile-fav-btn" @click="toggleFavorite">
          <el-icon>
            <StarFilled v-if="isFavorited" /><Star v-else />
          </el-icon>
          收藏
        </button>
        <button class="mobile-contact-btn" @click="openChat">
          <el-icon><ChatDotRound /></el-icon>
          联系卖家
        </button>
        <button class="mobile-buy-btn" @click="openChat">
          我想要
        </button>
      </div>
    </div>

    <!-- 即时聊天浮层 -->
    <div class="chat-float-container">
      <!-- 收起状态的悬浮按钮 -->
      <transition name="chat-fab">
        <button v-if="!chatOpen" class="chat-fab-button" @click="openChat">
          <span class="fab-icon">💬</span>
          <span class="fab-text">咨询卖家</span>
          <span v-if="unreadCount > 0" class="fab-badge">{{ unreadCount }}</span>
        </button>
      </transition>

      <!-- 展开的聊天面板 -->
      <transition name="chat-panel">
        <div v-if="chatOpen" class="chat-panel">
          <div class="chat-header">
            <div class="chat-seller-info">
              <img :src="item?.sellerAvatar || defaultAvatar" alt="卖家头像" class="chat-seller-avatar" />
              <div class="chat-seller-detail">
                <h4 class="chat-seller-name">{{ item?.sellerName || '卖家' }}</h4>
                <span class="chat-status online">
                  <span class="status-dot"></span>
                  在线
                </span>
              </div>
            </div>
            <button class="chat-close-btn" @click="closeChat">
              <el-icon><Close /></el-icon>
            </button>
          </div>

          <div ref="chatMessagesContainer" class="chat-messages">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-item"
              :class="{ 'message-me': msg.from === 'me', 'message-seller': msg.from === 'seller' }"
            >
              <img :src="msg.avatar" alt="" class="msg-avatar" />
              <div class="message-content-wrapper">
                <div class="message-bubble">{{ msg.text }}</div>
                <span class="message-time">{{ msg.time }}</span>
              </div>
            </div>

            <!-- 正在输入提示 -->
            <div v-if="isTyping" class="message-item message-seller">
              <img :src="item?.sellerAvatar || defaultAvatar" alt="" class="msg-avatar" />
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <!-- 快捷回复 -->
          <div class="quick-replies">
            <button
              v-for="(reply, idx) in quickReplies"
              :key="idx"
              class="quick-reply-btn"
              @click="sendQuickReply(reply)"
            >
              {{ reply }}
            </button>
          </div>

          <!-- 输入区域 -->
          <div class="chat-input-area">
            <input
              v-model="chatInput"
              type="text"
              placeholder="输入消息..."
              class="chat-input"
              @keyup.enter="sendMessage"
            />
            <button class="send-btn" :disabled="!chatInput.trim()" @click="sendMessage">
              发送
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, ArrowDown, Share, View, Clock, Location, ChatDotRound, Star, StarFilled, Warning, Close } from '@element-plus/icons-vue'
import Skeleton from '@/components/Skeleton.vue'
import { useSecondhandStore } from '@/stores/secondhand'

const route = useRoute()
const router = useRouter()
const secondhandStore = useSecondhandStore()

interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  time: string
  reply?: string
}

interface ChatMessage {
  id: number
  from: 'me' | 'seller'
  avatar: string
  text: string
  time: string
}

const loading = ref(true)
const currentImageIndex = ref(0)
const descExpanded = ref(false)
const newComment = ref('')

// 聊天相关状态
const chatOpen = ref(false)
const chatInput = ref('')
const isTyping = ref(false)
const unreadCount = ref(0)
const chatMessagesContainer = ref<HTMLElement | null>(null)

const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'
const myAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80'

const comments = ref<Comment[]>([])

// Mock 聊天数据
const messages = ref<ChatMessage[]>([
  { id: 1, from: 'seller', avatar: '', text: '你好！这个还在吗？', time: '14:20' },
  { id: 2, from: 'me', avatar: myAvatar, text: '在的，多少钱能出？', time: '14:21' },
  { id: 3, from: 'seller', avatar: '', text: '原价500买的，用了不到一个月，400怎么样？可以小刀', time: '14:22' },
])

// 卖家自动回复池
const sellerReplies = [
  '可以的，这个成色很好的',
  '价格可以再商量一下',
  '没问题，什么时候方便面交？',
  '这个还在的，诚心要的话可以优惠',
  '好的呢，你可以先看看实物',
  '包邮的话需要再加一点',
  '可以小刀一点点，但不能太多哦',
  '我在学校，随时可以看货',
]

// 快捷回复选项
const quickReplies = ['还在吗？', '能便宜点吗？', '可以面交吗？']

const similarItems = computed(() => {
  return secondhandStore.list
    .filter(i => i.id !== secondhandStore.currentItem?.id && i.category === secondhandStore.currentItem?.category)
    .slice(0, 3)
    .map(i => ({
      id: i.id,
      title: i.title,
      price: i.price,
      images: [i.images[0]]
    }))
})

const item = computed(() => secondhandStore.currentItem)

const isFavorited = computed(() => secondhandStore.currentItem?.isFavorite || false)

function getConditionLabel(condition: string): string {
  const map: Record<string, string> = {
    brandNew: '全新',
    likeNew: '几乎全新',
    good: '良好',
    fair: '一般'
  }
  return map[condition] || condition
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    electronics: '数码产品',
    books: '图书教材',
    sports: '运动户外',
    daily: '生活用品',
    clothing: '服饰鞋包',
    food: '食品零食',
    other: '其他'
  }
  return map[category] || category
}

function formatTime(timeStr: string): string {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + item.value!.images.length) % item.value!.images.length
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % item.value!.images.length
}

async function toggleFavorite() {
  if (!secondhandStore.currentItem) return
  try {
    if (isFavorited.value) {
      await secondhandStore.unlikeItem(String(secondhandStore.currentItem.id))
    } else {
      await secondhandStore.likeItem(String(secondhandStore.currentItem.id))
    }
    ElMessage.success(isFavorited.value ? '已取消收藏' : '已收藏')
  } catch {
    ElMessage.error('操作失败')
  }
}

function handleContact() {
  openChat()
}

function openChat() {
  chatOpen.value = true
  unreadCount.value = 0
  nextTick(() => {
    scrollToBottom()
  })
}

function closeChat() {
  chatOpen.value = false
}

function getCurrentTime(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

function scrollToBottom() {
  if (chatMessagesContainer.value) {
    nextTick(() => {
      chatMessagesContainer.value!.scrollTop = chatMessagesContainer.value!.scrollHeight
    })
  }
}

async function sendMessage() {
  if (!chatInput.value.trim()) return

  // 添加我的消息
  messages.value.push({
    id: Date.now(),
    from: 'me',
    avatar: myAvatar,
    text: chatInput.value.trim(),
    time: getCurrentTime()
  })

  chatInput.value = ''
  scrollToBottom()

  // 模拟卖家正在输入
  isTyping.value = true
  scrollToBottom()

  // 随机延迟后自动回复
  const delay = Math.floor(Math.random() * 2000) + 1000 // 1-3秒
  setTimeout(() => {
    isTyping.value = false

    // 从回复池随机选择一条回复
    const randomReply = sellerReplies[Math.floor(Math.random() * sellerReplies.length)]

    messages.value.push({
      id: Date.now(),
      from: 'seller',
      avatar: item.value?.sellerAvatar || defaultAvatar,
      text: randomReply,
      time: getCurrentTime()
    })

    if (!chatOpen.value) {
      unreadCount.value++
    }

    scrollToBottom()
  }, delay)
}

function sendQuickReply(reply: string) {
  chatInput.value = reply
  sendMessage()
}

function handleShare() {
  if (navigator.share) {
    navigator.share({
      title: item.value?.title,
      text: `看看这个好物：${item.value?.title}，只要 ¥${item.value?.price}`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    ElMessage.success('链接已复制到剪贴板')
  }
}

function handleReport() {
  ElMessage.warning('举报功能开发中')
}

function sendComment() {
  if (!newComment.value.trim()) return
  comments.value.unshift({
    id: Date.now(),
    author: '我',
    avatar: '',
    content: newComment.value.trim(),
    time: new Date().toISOString()
  })
  newComment.value = ''
  ElMessage.success('留言发送成功')
}

onMounted(async () => {
  const itemId = route.params.id as string
  try {
    await secondhandStore.fetchDetail(itemId)
  } catch {
    ElMessage.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.secondhand-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  padding-bottom: 80px;
}

.breadcrumb {
  font-size: 0.875rem;
  color: #9ca3af;
}

.breadcrumb-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #764ba2;
}

.separator {
  margin: 0 0.5rem;
}

.current {
  color: #374151;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
}

.image-gallery {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.gallery-main {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #1a1a1a;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: #374151;
  transition: all 0.3s ease;
  z-index: 2;
}

.nav-btn:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-btn.prev {
  left: 1rem;
}

.nav-btn.next {
  right: 1rem;
}

.image-counter {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.thumbnail-list {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  overflow-x: auto;
  background: white;
}

.thumbnail-item {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  background: none;
}

.thumbnail-item.active {
  border-color: #667eea;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.item-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
}

.share-btn {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: #6b7280;
  transition: all 0.2s;
}

.share-btn:hover {
  background: #e5e7eb;
  color: #667eea;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.price-symbol {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ef4444;
}

.price-value {
  font-size: 2.25rem;
  font-weight: 800;
  color: #ef4444;
  letter-spacing: -0.02em;
}

.original-price {
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.discount-tag {
  padding: 0.125rem 0.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #b45309;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.negotiable-tag {
  padding: 0.25rem 0.75rem;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid #fecaca;
}

.tags-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.condition-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: white;
}

.condition-tag.brandNew { background: #10b981; }
.condition-tag.likeNew { background: #3b82f6; }
.condition-tag.good { background: #f59e0b; }
.condition-tag.fair { background: #9ca3af; }

.category-tag {
  padding: 0.25rem 0.75rem;
  background: #f0efff;
  color: #667eea;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.meta-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f3f4f6;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #6b7280;
}

.meta-item .el-icon {
  color: #9ca3af;
  font-size: 1rem;
}

.description-card,
.comments-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.description-content {
  position: relative;
  max-height: 120px;
  overflow: hidden;
  transition: max-height 0.3s ease;
  mask-image: linear-gradient(to bottom, black 70%, transparent);
}

.description-content.expanded {
  max-height: none;
  mask-image: none;
}

.description-content p {
  white-space: pre-line;
  line-height: 1.8;
  color: #4b5563;
  font-size: 0.9375rem;
}

.expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.expand-btn .rotated {
  transform: rotate(180deg);
}

.seller-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.seller-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.seller-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.seller-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0efff;
}

.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.online-status.online {
  background: #10b981;
}

.seller-info {
  flex: 1;
  min-width: 0;
}

.seller-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.seller-stats {
  font-size: 0.8125rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.divider {
  color: #e5e7eb;
}

.view-seller-btn {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  background: #f0efff;
  color: #667eea;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.view-seller-btn:hover {
  background: #667eea;
  color: white;
}

.comment-input-area {
  margin-bottom: 1.5rem;
}

.comment-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  resize: vertical;
  outline: none;
  font-family: inherit;
  transition: all 0.2s;
  background: #fafafa;
}

.comment-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.08);
  background: white;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.char-count {
  font-size: 0.75rem;
  color: #9ca3af;
}

.send-comment-btn {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-comment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-comment-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.comment-item {
  display: flex;
  gap: 0.75rem;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.comment-author {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.comment-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.comment-content {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.6;
}

.comment-reply {
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f0fdf4;
  border-left: 3px solid #10b981;
  border-radius: 0 8px 8px 0;
  font-size: 0.8125rem;
  color: #166534;
}

.reply-label {
  font-weight: 600;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
}

.action-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.primary-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.secondary-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-action-btn:hover {
  background: #f0efff;
}

.safety-tips {
  padding-top: 1.25rem;
  border-top: 1px solid #f3f4f6;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #f59e0b;
  margin-bottom: 0.75rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  position: relative;
  padding-left: 1.25rem;
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.8;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 0.375rem;
  color: #f59e0b;
  font-weight: bold;
}

.report-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
}

.report-btn:hover {
  color: #ef4444;
  border-color: #fecaca;
  background: #fef2f2;
}

.similar-items-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar-section-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.similar-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.similar-item {
  display: flex;
  gap: 0.75rem;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 10px;
  transition: background 0.2s;
}

.similar-item:hover {
  background: #f9fafb;
}

.similar-img {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.similar-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.similar-title {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.similar-price {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #ef4444;
}

.mobile-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
  z-index: 100;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
}

.mobile-actions {
  display: flex;
  gap: 0.5rem;
}

.mobile-fav-btn {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.6875rem;
  color: #6b7280;
  cursor: pointer;
  gap: 0.125rem;
  transition: all 0.2s;
}

.mobile-contact-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  background: #f0efff;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-buy-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

@media (max-width: 1024px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .sidebar-section {
    order: -1;
  }

  .action-card {
    position: static;
  }

  .action-buttons {
    flex-direction: row;
  }

  .similar-items-card {
    display: none;
  }
}

@media (max-width: 640px) {
  .item-title {
    font-size: 1.25rem;
  }

  .price-value {
    font-size: 1.75rem;
  }

  .meta-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .seller-header {
    flex-wrap: wrap;
  }

  .view-seller-btn {
    width: 100%;
    text-align: center;
    margin-top: 0.5rem;
  }

  .thumbnail-item {
    width: 56px;
    height: 56px;
  }
}

/* 聊天浮层样式 */
.chat-float-container {
  position: fixed;
  z-index: 9999;
}

/* 悬浮按钮 */
.chat-fab-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #003B80 0%, #0052cc 100%);
  color: white;
  border: none;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 59, 128, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9375rem;
  font-weight: 600;
}

.chat-fab-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(0, 59, 128, 0.5);
}

.fab-icon {
  font-size: 1.25rem;
}

.fab-text {
  letter-spacing: 0.02em;
}

.fab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #ef4444;
  color: white;
  border-radius: 10px;
  font-size: 0.6875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* 聊天面板 */
.chat-panel {
  position: fixed;
  bottom: 0;
  right: 2rem;
  width: 380px;
  height: 560px;
  background: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #003B80 0%, #0052cc 100%);
  color: white;
}

.chat-seller-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chat-seller-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.chat-seller-detail {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.chat-seller-name {
  font-size: 0.9375rem;
  font-weight: 600;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  opacity: 0.95;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.chat-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s;
}

.chat-close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg);
}

/* 消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;
}

.message-item {
  display: flex;
  gap: 0.5rem;
  max-width: 85%;
}

.message-me {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-seller {
  align-self: flex-start;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.message-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-bubble {
  padding: 0.625rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.5;
  word-break: break-word;
}

.message-me .message-bubble {
  background: linear-gradient(135deg, #003B80 0%, #0052cc 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-seller .message-bubble {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 0.6875rem;
  color: #9ca3af;
  padding: 0 0.25rem;
}

.message-me .message-time {
  text-align: right;
}

/* 正在输入动画 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 0.875rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 快捷回复 */
.quick-replies {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  overflow-x: auto;
}

.quick-reply-btn {
  flex-shrink: 0;
  padding: 0.375rem 0.875rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 0.8125rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.quick-reply-btn:hover {
  background: #003B80;
  color: white;
  border-color: #003B80;
  transform: translateY(-1px);
}

/* 输入区域 */
.chat-input-area {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.chat-input {
  flex: 1;
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
}

.chat-input:focus {
  border-color: #003B80;
  box-shadow: 0 0 0 3px rgba(0, 59, 128, 0.08);
}

.send-btn {
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #003B80 0%, #0052cc 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 59, 128, 0.3);
}

/* 过渡动画 */
.chat-fab-enter-active,
.chat-fab-leave-active {
  transition: all 0.3s ease;
}

.chat-fab-enter-from,
.chat-fab-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.chat-panel-enter-active,
.chat-panel-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

@media (max-width: 480px) {
  .chat-panel {
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: calc(100vh - 60px);
    border-radius: 16px 16px 0 0;
  }

  .chat-fab-button {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>
