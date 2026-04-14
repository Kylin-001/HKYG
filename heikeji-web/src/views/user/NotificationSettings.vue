<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Bell, Message, ShoppingCart, Present,
  ChatDotRound, Setting, InfoFilled
} from '@element-plus/icons-vue'

const router = useRouter()

// 通知设置状态
const settings = ref({
  // 系统通知
  system: {
    enabled: true,
    label: '系统通知',
    description: '系统维护、功能更新、安全提醒等重要通知',
    icon: Setting
  },
  // 订单通知
  order: {
    enabled: true,
    label: '订单通知',
    description: '订单状态变更、物流信息、退款提醒等',
    icon: ShoppingCart
  },
  // 优惠活动
  promotion: {
    enabled: true,
    label: '优惠活动',
    description: '限时秒杀、优惠券发放、促销活动等',
    icon: Present
  },
  // 互动消息
  interaction: {
    enabled: true,
    label: '互动消息',
    description: '评论回复、点赞、关注等互动提醒',
    icon: ChatDotRound
  },
  // 私信消息
  message: {
    enabled: true,
    label: '私信消息',
    description: '用户私信、客服消息等',
    icon: Message
  }
})

// 推送渠道设置
const channels = ref({
  push: true,
  sms: false,
  email: true
})

// 加载设置
onMounted(() => {
  // 从本地存储或API加载设置
  const savedSettings = localStorage.getItem('notificationSettings')
  if (savedSettings) {
    const parsed = JSON.parse(savedSettings)
    Object.keys(parsed.settings || {}).forEach(key => {
      if (settings.value[key as keyof typeof settings.value]) {
        (settings.value[key as keyof typeof settings.value] as any).enabled = parsed.settings[key].enabled
      }
    })
    channels.value = parsed.channels || channels.value
  }
})

// 保存设置
const saveSettings = () => {
  localStorage.setItem('notificationSettings', JSON.stringify({
    settings: settings.value,
    channels: channels.value
  }))
  ElMessage.success('设置已保存')
}

// 重置设置
const resetSettings = () => {
  Object.keys(settings.value).forEach(key => {
    (settings.value[key as keyof typeof settings.value] as any).enabled = true
  })
  channels.value = {
    push: true,
    sms: false,
    email: true
  }
  ElMessage.success('已恢复默认设置')
}
</script>

<template>
  <div class="notification-settings">
    <!-- 页面标题 -->
    <div class="page-header">
      <button class="back-btn" @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <h1>通知设置</h1>
    </div>

    <div class="settings-content">
      <!-- 通知类型设置 -->
      <section class="settings-section">
        <h2 class="section-title">
          <el-icon><Bell /></el-icon>
          通知类型
        </h2>
        <div class="settings-list">
          <div
            v-for="(item, key) in settings"
            :key="key"
            class="setting-item"
          >
            <div class="item-info">
              <div class="item-icon" :class="key">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="item-text">
                <h3>{{ item.label }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </div>
            <el-switch
              v-model="item.enabled"
              active-color="#3b82f6"
              inactive-color="#e5e7eb"
            />
          </div>
        </div>
      </section>

      <!-- 推送渠道设置 -->
      <section class="settings-section">
        <h2 class="section-title">
          <el-icon><InfoFilled /></el-icon>
          推送渠道
        </h2>
        <div class="settings-list">
          <div class="setting-item">
            <div class="item-info">
              <div class="item-icon push">
                <el-icon><Bell /></el-icon>
              </div>
              <div class="item-text">
                <h3>应用内推送</h3>
                <p>在应用内接收通知提醒</p>
              </div>
            </div>
            <el-switch
              v-model="channels.push"
              active-color="#3b82f6"
              inactive-color="#e5e7eb"
            />
          </div>
          <div class="setting-item">
            <div class="item-info">
              <div class="item-icon sms">
                <el-icon><Message /></el-icon>
              </div>
              <div class="item-text">
                <h3>短信通知</h3>
                <p>通过短信接收重要通知</p>
              </div>
            </div>
            <el-switch
              v-model="channels.sms"
              active-color="#3b82f6"
              inactive-color="#e5e7eb"
            />
          </div>
          <div class="setting-item">
            <div class="item-info">
              <div class="item-icon email">
                <el-icon><Message /></el-icon>
              </div>
              <div class="item-text">
                <h3>邮件通知</h3>
                <p>通过邮件接收通知汇总</p>
              </div>
            </div>
            <el-switch
              v-model="channels.email"
              active-color="#3b82f6"
              inactive-color="#e5e7eb"
            />
          </div>
        </div>
      </section>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="btn-primary" @click="saveSettings">
          保存设置
        </button>
        <button class="btn-secondary" @click="resetSettings">
          恢复默认
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-settings {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e5e7eb;
}

.page-header h1 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.settings-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-section {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.section-title .el-icon {
  color: #3b82f6;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  transition: background 0.2s;
}

.setting-item:hover {
  background: #f9fafb;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.item-icon.system { background: #eff6ff; color: #3b82f6; }
.item-icon.order { background: #fff7ed; color: #f97316; }
.item-icon.promotion { background: #fdf2f8; color: #ec4899; }
.item-icon.interaction { background: #f0fdf4; color: #22c55e; }
.item-icon.message { background: #fef3c7; color: #f59e0b; }
.item-icon.push { background: #eff6ff; color: #3b82f6; }
.item-icon.sms { background: #f0fdf4; color: #22c55e; }
.item-icon.email { background: #fff7ed; color: #f97316; }

.item-text h3 {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.item-text p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding: 20px 0;
}

.btn-primary {
  flex: 1;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  background: #3b82f6;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  flex: 1;
  padding: 12px 24px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f9fafb;
}
</style>
