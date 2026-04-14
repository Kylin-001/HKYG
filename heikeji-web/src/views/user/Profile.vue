<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import * as userApi from '@/api/user'
import type { PersonalStatistics } from '@/types/user'
import {
  Setting, ArrowRight, Document, Clock, Van, CircleCheck, RefreshRight,
  Location, Star, Ticket, Present, UserFilled, Lock, Bell,
  QuestionFilled, InfoFilled, Camera, RefreshRight as RefreshIcon, Check,
  CirclePlusFilled, CircleCloseFilled, Box, Money, ShoppingCart, EditPen,
  Wallet, Timer, View, Grid, School, CreditCard, Notification, Close,
  ChatDotRound, StarFilled, Coin
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// ====== 个人统计数据 ======
const personalStats = ref<PersonalStatistics | null>(null)
const isLoadingStats = ref(false)

// 获取个人统计数据
async function fetchPersonalStats() {
  if (!userStore.isAuthenticated) return
  try {
    isLoadingStats.value = true
    const stats = await userApi.getPersonalStatistics()
    personalStats.value = stats
  } catch (err) {
    console.error('获取个人统计数据失败:', err)
  } finally {
    isLoadingStats.value = false
  }
}

// ====== 用户信息 ======
const userInfo = computed(() => ({
  id: userStore.user?.id || '1',
  username: userStore.user?.username || 'student_2024001',
  nickname: userStore.user?.nickname || '张同学',
  avatar: userStore.userAvatar,
  email: userStore.user?.email || 'zhangsan@usth.edu.cn',
  phone: userStore.user?.phone || '138****8888',
  department: (userStore.user as any)?.department || '计算机学院',
  major: (userStore.user as any)?.major || '软件工程',
  grade: (userStore.user as any)?.grade || '2022级',
  studentId: (userStore.user as any)?.studentId || '2022010001',
}))

// ====== 个人数据统计面板 ======
const userStats = computed(() => [
  {
    label: '发布帖子',
    value: personalStats.value?.postCount ?? (userStore.user as any)?.postCount ?? 0,
    color: 'blue',
    icon: ChatDotRound,
    path: '/community/forum'
  },
  {
    label: '收到点赞',
    value: personalStats.value?.likeCount ?? (userStore.user as any)?.likeCount ?? 0,
    color: 'pink',
    icon: StarFilled,
    path: '/community/forum'
  },
  {
    label: '完成订单',
    value: personalStats.value?.orderCount ?? (userStore.user as any)?.statistics?.orderCount ?? 0,
    color: 'green',
    icon: Box,
    path: '/user/orders'
  },
  {
    label: '信用评分',
    value: personalStats.value?.creditScore ?? (userStore.user as any)?.creditScore ?? 5.0,
    color: 'purple',
    icon: CircleCheck,
    path: null
  },
])

// ====== 头像查看相关状态 ======
const showAvatarModal = ref(false)

function handleAvatarClick() {
  showAvatarModal.value = true
}

// ====== 信用评分详情弹窗 ======
const showCreditModal = ref(false)

function handleCreditClick() {
  showCreditModal.value = true
}

// ====== 快捷服务配置 ======
const quickServices = [
  { label: '待付款', icon: Wallet, path: '/user/orders?status=pending_payment', badge: 1, bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
  { label: '待收货', icon: Van, path: '/user/orders?status=shipped', badge: 1, bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
  { label: '收藏夹', icon: Star, path: '/user/favorites', badge: 15, bgColor: 'bg-pink-100', textColor: 'text-pink-600' },
  { label: '浏览历史', icon: Clock, path: '/user/browse-history', badge: null, bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' },
  { label: '积分商城', icon: Coin, path: '/user/points-mall', badge: null, bgColor: 'bg-amber-100', textColor: 'text-amber-600' },
  { label: '优惠券', icon: Ticket, path: '/user/coupons', badge: 3, bgColor: 'bg-red-100', textColor: 'text-red-600' },
]

// ====== 校园服务配置（现代化卡片设计） ======
const campusServices = [
  {
    label: '学工办理',
    desc: '请假、奖助学金',
    icon: Document,
    path: '/student-affairs',
    badge: null,
    gradient: 'from-blue-500 to-cyan-400',
    shadowColor: 'rgba(59, 130, 246, 0.3)'
  },
  {
    label: '缴费中心',
    desc: '学费、住宿费',
    icon: CreditCard,
    path: '/payment',
    badge: null,
    gradient: 'from-emerald-500 to-teal-400',
    shadowColor: 'rgba(16, 185, 129, 0.3)'
  },
  {
    label: '校园卡服务',
    desc: '充值、挂失、查询',
    icon: Ticket,
    path: '/student-affairs/campus-card',
    badge: null,
    gradient: 'from-violet-500 to-purple-400',
    shadowColor: 'rgba(139, 92, 246, 0.3)'
  },
  {
    label: '信息公告',
    desc: '学校重要通知',
    icon: Bell,
    path: '/announcements',
    badge: 2,
    gradient: 'from-amber-500 to-orange-400',
    shadowColor: 'rgba(245, 158, 11, 0.3)'
  },
  {
    label: '通知中心',
    desc: '个人消息提醒',
    icon: Notification,
    path: '/announcements/notifications',
    badge: 5,
    gradient: 'from-rose-500 to-pink-400',
    shadowColor: 'rgba(244, 63, 94, 0.3)'
  },
]

// ====== 菜单分组配置 ======
const menuGroups = [
  {
    title: '工具与服务',
    icon: Grid,
    items: [
      { label: '帮助中心', icon: QuestionFilled, path: '/help', badge: null },
    ],
  },
  {
    title: '账户设置',
    icon: Setting,
    items: [
      { label: '个人资料', icon: UserFilled, path: '/user/settings', badge: null },
      { label: '账号安全', icon: Lock, path: '/user/settings/security', badge: null },
      { label: '消息通知', icon: Bell, path: '/user/notifications', badge: 5 },
    ],
  },
]

function navigateTo(path: string) {
  if (path === '#') {
    ElMessage.info('功能开发中，敬请期待')
    return
  }
  router.push(path)
}

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '退出登录', {
    confirmButtonText: '确认退出',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/')
    })
    .catch(() => {})
}

onMounted(async () => {
  if (userStore.token) {
    try {
      await userStore.fetchUserInfo()
      await fetchPersonalStats()
    } catch (err: any) {
      console.error('获取用户信息失败:', err)
    }
  }
})
</script>

<template>
  <div class="profile-page" style="min-height: 100vh; background-color: #f5f7fa;">
    <div class="profile-container">
      
      <!-- 未登录提示 -->
      <div v-if="!userStore.isAuthenticated" style="text-align: center; padding: 80px 0;">
        <div style="width: 96px; height: 96px; margin: 0 auto 24px; border-radius: 50%; background: linear-gradient(135deg, rgba(0,86,179,0.1), rgba(0,86,179,0.05)); display: flex; align-items: center; justify-content: center;">
          <el-icon :size="48" style="color: rgba(0,86,179,0.4);"><UserFilled /></el-icon>
        </div>
        <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">您还未登录</h3>
        <p style="color: #9ca3af; margin-bottom: 24px;">登录后查看个人信息、订单、收藏等内容</p>
        <button @click="navigateTo('/login')"
          style="padding: 12px 32px; border-radius: 9999px; background: linear-gradient(135deg, #0056b3, #0078d4); color: white; font-weight: 600; border: none; cursor: pointer;">
          立即登录
        </button>
      </div>

      <template v-else>
        <!-- ====== 用户信息卡片 - 全新设计 ====== -->
        <div style="position: relative; overflow: hidden; border-radius: 24px; background: linear-gradient(135deg, #003b80, #0056b3, #0078d4); box-shadow: 0 8px 32px rgba(0,86,179,0.25); margin-bottom: 20px;">
          <!-- 装饰性背景元素 -->
          <div style="position: absolute; top: 0; right: 0; width: 192px; height: 192px; background: rgba(255,255,255,0.05); border-radius: 50%; transform: translate(25%, -33%);"></div>
          <div style="position: absolute; bottom: 0; left: 0; width: 128px; height: 128px; background: rgba(255,255,255,0.03); border-radius: 50%; transform: translate(-25%, 50%);"></div>

          <div style="position: relative; z-index: 10; padding: 24px;">
            <!-- 设置按钮 -->
            <button @click="navigateTo('/user/settings')"
              style="position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; color: white; border: none; cursor: pointer; transition: all 0.2s;">
              <el-icon :size="18"><Setting /></el-icon>
            </button>

            <!-- 用户信息 -->
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
              <!-- 头像区域（可点击查看大图） -->
              <div style="position: relative; cursor: pointer; flex-shrink: 0;" @click="handleAvatarClick" class="avatar-wrapper">
                <img :src="userInfo.avatar" alt=""
                  style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(255,255,255,0.3); box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
                  @error="$event.target.src='https://api.dicebear.com/7.x/avataaars/svg?seed=fallback&size=200'"
                />
                <div style="position: absolute; bottom: 2px; right: 2px; width: 16px; height: 16px; background: #10b981; border-radius: 50%; border: 2px solid white;"></div>
              </div>

              <div style="color: white; flex: 1; min-width: 0;">
                <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 4px;">{{ userInfo.nickname }}</h2>
                <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin-bottom: 8px;">{{ userInfo.department }} · {{ userInfo.major }} · {{ userInfo.grade }}</p>

                <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; background: rgba(255,193,7,0.9); font-size: 12px; font-weight: 500; color: #92400e;">
                  <span>🎓</span>
                  <span>黑科大在校生</span>
                  <span style="opacity: 0.6;">·</span>
                  <span>成长值 2680</span>
                </div>
              </div>
            </div>

            <!-- 统计面板 - 四宫格 -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
              <div v-for="(stat, index) in userStats" :key="index"
                style="background: rgba(255,255,255,0.12); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 12px 8px; text-align: center; cursor: pointer; transition: all 0.3s;"
                class="stat-card"
                @click="stat.path ? navigateTo(stat.path) : stat.label === '信用评分' ? handleCreditClick() : null">
                <div :style="{ fontSize: '24px', fontWeight: 700, marginBottom: '4px', color: stat.color === 'blue' ? '#7dd3fc' : stat.color === 'pink' ? '#f9a8d4' : stat.color === 'green' ? '#6ee7b7' : '#c4b5fd' }">
                  {{ stat.value }}
                </div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.7);">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ====== 快捷服务网格 ====== -->
        <div style="background: white; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f3f4f6; padding: 20px; margin-bottom: 16px;">
          <h3 style="font-weight: 600; color: #1f2937; margin-bottom: 16px; font-size: 14px;">快捷服务</h3>
          <div class="quick-services-grid">
            <button v-for="item in quickServices" :key="item.label" @click="navigateTo(item.path)"
              style="display: flex; flex-direction: column; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; padding: 4px;"
              class="quick-service-btn">
              <div :class="[item.bgColor, item.textColor]" style="position: relative; width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                <el-icon :size="22">
                  <component :is="item.icon" />
                </el-icon>
                <span v-if="item.badge" style="position: absolute; top: -4px; right: -4px; min-width: 18px; height: 18px; padding: 0 5px; background: #ef4444; color: white; font-size: 10px; font-weight: 600; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 2px solid white;">
                  {{ item.badge }}
                </span>
              </div>
              <span style="font-size: 11px; color: #4b5563;">{{ item.label }}</span>
            </button>
          </div>
        </div>

        <!-- ====== 校园服务 - 现代化卡片网格 ====== -->
        <div style="background: white; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f3f4f6; padding: 20px; margin-bottom: 16px;">
          <!-- 标题栏 -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg, #0056b3, #0078d4); display: flex; align-items: center; justify-content: center;">
                <el-icon :size="16" style="color: white;"><School /></el-icon>
              </div>
              <span style="font-weight: 600; font-size: 15px; color: #1f2937;">校园服务</span>
            </div>
            <button @click="navigateTo('/student-affairs')" style="display: flex; align-items: center; gap: 4px; background: none; border: none; color: #6b7280; font-size: 13px; cursor: pointer; transition: color 0.2s;" class="view-all-btn">
              <span>全部</span>
              <el-icon :size="14"><ArrowRight /></el-icon>
            </button>
          </div>

          <!-- 服务卡片网格 -->
          <div class="campus-services-grid">
            <button
              v-for="(service, index) in campusServices"
              :key="index"
              @click="navigateTo(service.path)"
              class="campus-service-card"
              :style="{ '--shadow-color': service.shadowColor }"
            >
              <!-- 图标区域 -->
              <div :class="['service-icon-wrapper', service.gradient]" style="position: relative;">
                <el-icon :size="22" style="color: white;">
                  <component :is="service.icon" />
                </el-icon>
                <!-- 徽章 -->
                <span
                  v-if="service.badge"
                  style="position: absolute; top: -6px; right: -6px; min-width: 20px; height: 20px; padding: 0 6px; background: linear-gradient(135deg, #ef4444, #f87171); color: white; font-size: 11px; font-weight: 700; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);"
                >
                  {{ service.badge }}
                </span>
              </div>
              <!-- 文字区域 -->
              <div style="text-align: center;">
                <div style="font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 2px;">{{ service.label }}</div>
                <div style="font-size: 11px; color: #9ca3af;">{{ service.desc }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- ====== 功能菜单分组 ====== -->
        <div class="menu-groups-wrapper">
          <div v-for="(group, gIndex) in menuGroups" :key="gIndex" class="menu-group-card" style="background: white; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f3f4f6; overflow: hidden; margin-bottom: 16px;">
          <!-- 分组标题 -->
          <div style="padding: 14px 20px; background: #f9fafb; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <el-icon :size="16" style="color: #6b7280;">
                <component :is="group.icon" />
              </el-icon>
              <span style="font-weight: 600; font-size: 14px; color: #1f2937;">{{ group.title }}</span>
            </div>
            <el-icon :size="14" style="color: #9ca3af;"><ArrowRight /></el-icon>
          </div>

          <!-- 菜单项 -->
          <div>
            <button v-for="(item, iIndex) in group.items" :key="iIndex" @click="navigateTo(item.path)"
              style="width: 100%; display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: none; border: none; border-bottom: 1px solid #f9fafb; cursor: pointer; text-align: left; transition: all 0.15s; position: relative; overflow: hidden;"
              class="menu-item">
              <!-- 左侧蓝色指示条 -->
              <div class="menu-indicator" style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 0; background: #0056b3; border-radius: 0 2px 2px 0; transition: height 0.2s;"></div>

              <div style="width: 36px; height: 36px; border-radius: 10px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <el-icon :size="17" style="color: #6b7280;">
                  <component :is="item.icon" />
                </el-icon>
              </div>
              <span style="flex: 1; font-size: 14px; font-weight: 500; color: #374151;">{{ item.label }}</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span v-if="item.badge" style="min-width: 20px; height: 20px; padding: 0 6px; background: #ef4444; color: white; font-size: 11px; font-weight: 700; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                  {{ item.badge }}
                </span>
                <el-icon :size="16" style="color: #d1d5db;"><ArrowRight /></el-icon>
              </div>
            </button>
          </div>
          </div>
        </div>

        <!-- 底部版权 -->
        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #9ca3af; font-size: 12px;">黑科易购 v2.0 · Made with <span style="color: #f87171;">❤</span> for HLJUST</p>
          <p style="font-size: 10px; color: #d1d5db; margin-top: 4px;">黑龙江科技大学 · 厚德博学 强吾兴邦</p>
        </div>
      </template>

      <!-- 头像查看弹窗 -->
      <Teleport to="body">
        <Transition name="dialog-fade">
          <div v-if="showAvatarModal" style="position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); padding: 16px;" @click.self="showAvatarModal = false">
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; gap: 16px;">
              <img :src="userInfo.avatar" alt="用户头像" style="width: 200px; height: 200px; border-radius: 50%; object-fit: cover; border: 4px solid white; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);" />
              <p style="color: white; font-size: 16px; font-weight: 500;">{{ userInfo.nickname }}</p>
              <button @click="showAvatarModal = false" style="position: absolute; top: -40px; right: -40px; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.2); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; transition: background 0.2s;">
                <el-icon :size="24"><Close /></el-icon>
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- 信用评分详情弹窗 -->
      <Teleport to="body">
        <Transition name="dialog-fade">
          <div v-if="showCreditModal" style="position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); padding: 16px;" @click.self="showCreditModal = false">
            <div style="background: white; border-radius: 20px; padding: 32px; max-width: 400px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
              <!-- 标题 -->
              <div style="text-align: center; margin-bottom: 24px;">
                <h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">信用评分</h3>
                <p style="font-size: 14px; color: #6b7280;">您的信用等级详情</p>
              </div>

              <!-- 评分显示 -->
              <div style="text-align: center; margin-bottom: 24px; padding: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px;">
                <div style="font-size: 48px; font-weight: 700; color: white; margin-bottom: 8px;">
                  {{ userStats.find(s => s.label === '信用评分')?.value || 5.0 }}
                </div>
                <div style="font-size: 14px; color: rgba(255,255,255,0.9);">
                  {{ (userStats.find(s => s.label === '信用评分')?.value || 5.0) >= 4.5 ? '信用优秀' : (userStats.find(s => s.label === '信用评分')?.value || 5.0) >= 3.5 ? '信用良好' : '信用一般' }}
                </div>
              </div>

              <!-- 评分说明 -->
              <div style="margin-bottom: 24px;">
                <h4 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">评分说明</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4b5563;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></div>
                    <span>4.5-5.0分：信用优秀</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4b5563;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: #3b82f6;"></div>
                    <span>3.5-4.4分：信用良好</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4b5563;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b;"></div>
                    <span>2.5-3.4分：信用一般</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4b5563;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444;"></div>
                    <span>低于2.5分：信用较差</span>
                  </div>
                </div>
              </div>

              <!-- 提升信用建议 -->
              <div style="margin-bottom: 24px;">
                <h4 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">如何提升信用</h4>
                <ul style="font-size: 13px; color: #4b5563; padding-left: 16px; line-height: 1.8;">
                  <li>按时完成订单交易</li>
                  <li>积极参与社区互动</li>
                  <li>遵守平台规则，不发布违规内容</li>
                  <li>及时回复消息和评价</li>
                </ul>
              </div>

              <!-- 关闭按钮 -->
              <button @click="showCreditModal = false" style="width: 100%; padding: 12px; background: #f3f4f6; border: none; border-radius: 10px; font-size: 14px; font-weight: 500; color: #374151; cursor: pointer; transition: background 0.2s;">
                我知道了
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<style scoped>
/* CSS Reset - 确保跨浏览器一致性 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 响应式容器 */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  padding-bottom: 96px;
}

/* 桌面端布局优化 */
@media (min-width: 1024px) {
  .profile-container {
    padding: 32px;
  }
}

/* 平板端 */
@media (max-width: 1023px) and (min-width: 768px) {
  .profile-container {
    max-width: 100%;
    padding: 20px;
  }
}

/* 移动端 */
@media (max-width: 767px) {
  .profile-container {
    max-width: 768px;
    padding: 16px;
  }
}

/* 头像悬停效果 */
.avatar-wrapper:hover .avatar-overlay {
  opacity: 1 !important;
}

/* 防止图片溢出 */
img {
  max-width: 100%;
  height: auto;
}

/* 统计卡片悬停效果 */
.stat-card:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: scale(1.05);
}

/* 快捷服务网格响应式 */
.quick-services-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

@media (min-width: 1024px) {
  .quick-services-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }
}

@media (max-width: 767px) {
  .quick-services-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .quick-services-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
}

/* 菜单分组响应式布局 */
.menu-groups-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

@media (min-width: 1024px) {
  .menu-groups-wrapper {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  .menu-group-card {
    margin-bottom: 0 !important;
  }
}

/* 快捷服务按钮悬停效果 */
.quick-service-btn:hover > div:first-child {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.quick-service-btn:hover span {
  color: #0056b3;
}

/* ====== 校园服务卡片网格样式 ====== */
.campus-services-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

@media (max-width: 1023px) {
  .campus-services-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }
}

@media (max-width: 767px) {
  .campus-services-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .campus-services-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
}

/* 校园服务卡片 */
.campus-service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 8px;
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.campus-service-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
  opacity: 0;
  transition: opacity 0.3s;
}

.campus-service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px var(--shadow-color, rgba(0,0,0,0.15));
  border-color: transparent;
}

.campus-service-card:hover::before {
  opacity: 1;
}

/* 服务图标包装器 */
.service-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.campus-service-card:hover .service-icon-wrapper {
  transform: scale(1.1) rotate(-5deg);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

/* 渐变背景类 */
.from-blue-500 { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
.from-emerald-500 { background: linear-gradient(135deg, #10b981, #14b8a6); }
.from-violet-500 { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
.from-amber-500 { background: linear-gradient(135deg, #f59e0b, #fb923c); }
.from-rose-500 { background: linear-gradient(135deg, #f43f5e, #fb7185); }

/* 查看全部按钮悬停 */
.view-all-btn:hover {
  color: #0056b3 !important;
}

/* 菜单项悬停效果 */
.menu-item:hover {
  background: #f9fafb !important;
}

.menu-item:hover .menu-indicator {
  height: 24px !important;
}

.menu-item:hover > div:nth-child(2) {
  background: rgba(0,86,179,0.1);
}

.menu-item:hover > div:nth-child(2) > .el-icon {
  color: #0056b3;
}



/* 弹窗动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

/* 加载旋转动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
