<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAnnouncementStore } from '@/stores/announcement'
import {
  Bell, Check, Delete, Filter, Search, Setting,
  ShoppingCart, Message, InfoFilled, Present, WarningFilled,
  CircleCheckFilled, ArrowRight, RefreshRight,
  MoreFilled, Check as CheckIcon, Clock
} from '@element-plus/icons-vue'

const router = useRouter()
const store = useAnnouncementStore()

// 当前选中的标签页
const activeTab = ref('all')

// 搜索关键词
const searchKeyword = ref('')

// 加载状态
const isRefreshing = ref(false)

// 通知类型配置
const notificationTypes = [
  { key: 'all', label: '全部', icon: '🔔', color: '#6366f1', bgColor: '#e0e7ff' },
  { key: 'order', label: '订单', icon: '📦', color: '#3b82f6', bgColor: '#dbeafe' },
  { key: 'system', label: '系统', icon: '⚙️', color: '#6b7280', bgColor: '#f3f4f6' },
  { key: 'promo', label: '优惠', icon: '🎉', color: '#ec4899', bgColor: '#fce7f3' },
  { key: 'community', label: '互动', icon: '💬', color: '#10b981', bgColor: '#d1fae5' },
]

// 过滤后的通知列表
const filteredNotifications = computed(() => {
  let result = store.notifications

  // 按类型过滤
  if (activeTab.value !== 'all') {
    result = result.filter(n => n.type === activeTab.value)
  }

  // 按搜索关键词过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(n =>
      n.title.toLowerCase().includes(keyword) ||
      n.content.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 未读数量统计
const unreadStats = computed(() => {
  const stats: Record<string, number> = { all: 0 }
  notificationTypes.forEach(type => {
    if (type.key !== 'all') {
      stats[type.key] = store.notifications.filter(n => n.type === type.key && !n.isRead).length
      stats.all += stats[type.key]
    }
  })
  return stats
})

// 获取类型配置
function getTypeConfig(type: string) {
  return notificationTypes.find(t => t.key === type) || notificationTypes[0]
}

// 刷新通知列表
async function refreshNotifications() {
  isRefreshing.value = true
  try {
    await store.fetchNotifications()
    ElMessage.success('已刷新')
  } catch (err) {
    ElMessage.error('刷新失败')
  } finally {
    isRefreshing.value = false
  }
}

// 标记单个已读
async function markAsRead(id: string, event?: Event) {
  event?.stopPropagation()
  try {
    await store.markAsRead(id)
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

// 标记全部已读
async function markAllRead() {
  if (unreadStats.value.all === 0) {
    ElMessage.info('没有未读消息')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确定要将 ${unreadStats.value.all} 条消息标记为已读吗？`,
      '确认操作',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'info' }
    )
    await store.markAllRead()
    ElMessage.success('已全部标记为已读')
  } catch (err) {
    // 用户取消
  }
}

// 删除通知
async function deleteNotification(id: string, event: Event) {
  event.stopPropagation()
  try {
    await ElMessageBox.confirm('确定要删除这条通知吗？', '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 从列表中移除
    store.notifications = store.notifications.filter(n => n.id !== id)
    ElMessage.success('已删除')
  } catch (err) {
    // 用户取消
  }
}

// 清空所有通知
async function clearAll() {
  if (store.notifications.length === 0) {
    ElMessage.info('没有可清空的消息')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确定要清空所有 ${store.notifications.length} 条通知吗？此操作不可恢复。`,
      '确认清空',
      { confirmButtonText: '清空', cancelButtonText: '取消', type: 'warning' }
    )
    store.notifications = []
    store.unreadCount = 0
    ElMessage.success('已清空所有通知')
  } catch (err) {
    // 用户取消
  }
}

// 处理通知点击
function handleNotificationClick(notification: any) {
  // 标记已读
  if (!notification.isRead) {
    markAsRead(notification.id)
  }

  // 根据类型跳转
  switch (notification.type) {
    case 'order':
      if (notification.orderId) {
        router.push(`/orders/${notification.orderId}`)
      } else {
        router.push('/user/orders')
      }
      break
    case 'community':
      if (notification.postId) {
        router.push(`/community/post/${notification.postId}`)
      } else {
        router.push('/community/forum')
      }
      break
    case 'promo':
      router.push('/products')
      break
    default:
      // 系统通知不跳转
      break
  }
}

// 格式化时间
function formatTime(time: string) {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于1分钟
  if (diff < 60000) return '刚刚'
  // 小于1小时
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  // 小于24小时
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  // 小于7天
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

onMounted(() => {
  store.fetchNotifications()
})
</script>

<template>
  <div class="notifications-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon-wrapper">
            <div class="header-icon">
              <el-icon :size="28" color="#fff"><Bell /></el-icon>
            </div>
            <div v-if="unreadStats.all > 0" class="unread-badge">{{ unreadStats.all }}</div>
          </div>
          <div class="header-text">
            <h1>消息中心</h1>
            <p>共 {{ store.notifications.length }} 条消息，{{ unreadStats.all }} 条未读</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn refresh-btn" :class="{ spinning: isRefreshing }" @click="refreshNotifications">
            <el-icon :size="16"><RefreshRight /></el-icon>
          </button>
          <button class="action-btn" @click="markAllRead" :disabled="unreadStats.all === 0">
            <el-icon :size="16"><Check /></el-icon>
            <span>全部已读</span>
          </button>
          <button class="action-btn danger" @click="clearAll" :disabled="store.notifications.length === 0">
            <el-icon :size="16"><Delete /></el-icon>
            <span>清空</span>
          </button>
        </div>
      </div>

      <div class="main-content">
        <!-- 左侧边栏 -->
        <aside class="sidebar">
          <!-- 类型筛选 -->
          <div class="filter-card">
            <h3 class="card-title">消息类型</h3>
            <div class="type-list">
              <button
                v-for="type in notificationTypes"
                :key="type.key"
                class="type-item"
                :class="{ active: activeTab === type.key }"
                @click="activeTab = type.key"
              >
                <span class="type-icon">{{ type.icon }}</span>
                <span class="type-label">{{ type.label }}</span>
                <span v-if="unreadStats[type.key] > 0" class="type-badge">{{ unreadStats[type.key] }}</span>
              </button>
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="quick-actions">
            <button class="quick-btn" @click="router.push('/user/settings/notifications')">
              <el-icon :size="18"><Setting /></el-icon>
              <span>通知设置</span>
            </button>
          </div>
        </aside>

        <!-- 右侧内容区 -->
        <main class="content-area">
          <!-- 搜索栏 -->
          <div class="search-bar">
            <div class="search-input-wrapper">
              <el-icon :size="18" class="search-icon"><Search /></el-icon>
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索消息内容..."
                class="search-input"
              />
              <button v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''">
                <el-icon :size="14"><CircleCheckFilled /></el-icon>
              </button>
            </div>
          </div>

          <!-- 通知列表 -->
          <div v-if="filteredNotifications.length > 0" class="notification-list">
            <TransitionGroup name="notification">
              <div
                v-for="notification in filteredNotifications"
                :key="notification.id"
                class="notification-item"
                :class="{ unread: !notification.isRead }"
                @click="handleNotificationClick(notification)"
              >
                <!-- 未读指示条 -->
                <div v-if="!notification.isRead" class="unread-indicator"></div>

                <div class="notification-content">
                  <!-- 图标 -->
                  <div
                    class="type-icon-wrapper"
                    :style="{
                      background: getTypeConfig(notification.type).bgColor,
                      color: getTypeConfig(notification.type).color
                    }"
                  >
                    <span class="icon-emoji">{{ getTypeConfig(notification.type).icon }}</span>
                  </div>

                  <!-- 内容 -->
                  <div class="message-body">
                    <div class="message-header">
                      <div class="title-wrapper">
                        <span
                          class="type-tag"
                          :style="{
                            background: getTypeConfig(notification.type).bgColor,
                            color: getTypeConfig(notification.type).color
                          }"
                        >
                          {{ getTypeConfig(notification.type).label }}
                        </span>
                        <h3 class="message-title" :class="{ unread: !notification.isRead }">
                          {{ notification.title }}
                        </h3>
                      </div>
                      <span class="message-time">
                        <el-icon :size="12"><Clock /></el-icon>
                        {{ formatTime(notification.createdAt) }}
                      </span>
                    </div>
                    <p class="message-text" :class="{ unread: !notification.isRead }">
                      {{ notification.content }}
                    </p>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="message-actions">
                    <button
                      v-if="!notification.isRead"
                      class="action-icon-btn"
                      title="标记已读"
                      @click.stop="markAsRead(notification.id, $event)"
                    >
                      <el-icon :size="16"><CheckIcon /></el-icon>
                    </button>
                    <button
                      class="action-icon-btn delete"
                      title="删除"
                      @click.stop="deleteNotification(notification.id, $event)"
                    >
                      <el-icon :size="16"><Delete /></el-icon>
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <div class="empty-icon">
              <el-icon :size="64" color="#d1d5db"><Bell /></el-icon>
            </div>
            <h3>{{ searchKeyword ? '没有找到相关消息' : '暂无消息' }}</h3>
            <p>{{ searchKeyword ? '尝试其他关键词搜索' : '当有新消息时，会显示在这里' }}</p>
            <button v-if="searchKeyword" class="clear-search-btn" @click="searchKeyword = ''">
              清除搜索
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notifications-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon-wrapper {
  position: relative;
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.header-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.header-text p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.danger {
  color: #ef4444;
  background: #fef2f2;
}

.action-btn.danger:hover:not(:disabled) {
  background: #fee2e2;
}

.refresh-btn.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 主内容区 */
.main-content {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.type-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.type-item:hover {
  background: #f8fafc;
}

.type-item.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.type-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.type-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.type-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-item.active .type-badge {
  background: rgba(255, 255, 255, 0.9);
  color: #6366f1;
}

.quick-actions {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quick-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #e2e8f0;
}

/* 内容区 */
.content-area {
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-bar {
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #1e293b;
  background: #f8fafc;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
}

.search-input::placeholder {
  color: #94a3b8;
}

.clear-btn {
  position: absolute;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e2e8f0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #cbd5e1;
}

/* 通知列表 */
.notification-list {
  max-height: 600px;
  overflow-y: auto;
}

.notification-item {
  position: relative;
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.03) 0%, transparent 100%);
}

.notification-item.unread:hover {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.06) 0%, #f8fafc 100%);
}

.unread-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 40px;
  background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 0 2px 2px 0;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.type-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-emoji {
  font-size: 24px;
}

.message-body {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.type-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.message-title {
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-title.unread {
  color: #1e293b;
}

.message-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94a3b8;
  flex-shrink: 0;
}

.message-text {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-text.unread {
  color: #64748b;
}

.message-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.notification-item:hover .message-actions {
  opacity: 1;
}

.action-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s;
}

.action-icon-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.action-icon-btn.delete:hover {
  background: #fef2f2;
  color: #ef4444;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 20px 0;
}

.clear-search-btn {
  padding: 10px 24px;
  border-radius: 10px;
  background: #6366f1;
  color: white;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-search-btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

/* 动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 响应式 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 200px 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-content {
    flex-direction: column;
  }

  .main-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    overflow-x: auto;
  }

  .filter-card {
    min-width: 200px;
  }

  .quick-actions {
    min-width: 150px;
  }

  .type-list {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .type-item {
    flex: 1;
    min-width: 100px;
  }

  .notification-content {
    flex-wrap: wrap;
  }

  .message-actions {
    flex-direction: row;
    opacity: 1;
    width: 100%;
    justify-content: flex-end;
    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .action-btn span {
    display: none;
  }

  .message-header {
    flex-wrap: wrap;
  }

  .title-wrapper {
    width: 100%;
  }
}
</style>
