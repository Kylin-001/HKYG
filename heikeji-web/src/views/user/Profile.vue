<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  Setting, ArrowRight, Document, Clock, Van, CircleCheck, RefreshRight,
  Location, Star, Timer, Ticket, Present, UserFilled, Lock, Bell,
  QuestionFilled, InfoFilled, Camera, Upload, Close, Check,
  CirclePlusFilled, CircleCloseFilled, Box, Money, ShoppingCart, EditPen
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// ====== 用户信息 ======
const userInfo = computed(() => ({
  id: userStore.user?.id || '1',
  username: userStore.user?.username || 'student_2024001',
  nickname: userStore.user?.nickname || '科小易',
  avatar: userStore.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=33&size=200',
  email: userStore.user?.email || 'zhangsan@usth.edu.cn',
  phone: userStore.user?.phone || '138****8888',
  department: (userStore.user as any)?.department || '计算机学院',
  major: (userStore.user as any)?.major || '软件工程',
  grade: (userStore.user as any)?.grade || '2024级',
  studentId: (userStore.user as any)?.studentId || '2023010****',
}))

// ====== 个人数据统计面板 ======
const userStats = computed(() => ({
  posts: userStore.user?.postCount ?? 128,
  likes: userStore.user?.likeCount ?? 56,
  orders: (userStore.user as any)?.statistics?.orderCount ?? 23,
  credit: userStore.user?.creditScore ?? 4.9
}))

// ====== 头像上传相关状态 ======
const showAvatarDialog = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const isUploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

// 裁剪相关
const cropCanvasRef = ref<HTMLCanvasElement | null>(null)
const cropSize = ref(200) // 裁剪输出尺寸

// 点击头像触发文件选择
function handleAvatarClick() {
  fileInputRef.value?.click()
}

// 文件选择处理
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }

  // 验证文件大小（最大5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过5MB')
    return
  }

  selectedFile.value = file
  
  // 创建预览URL
  previewUrl.value = URL.createObjectURL(file)
  showAvatarDialog.value = true
  
  // 重置input以便可以重复选择同一文件
  target.value = ''
}

// Canvas裁剪 - 中心裁剪为正方形
function cropAvatar(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      const size = cropSize.value
      canvas.width = size
      canvas.height = size

      // 计算裁剪区域（中心裁剪）
      const minDim = Math.min(img.width, img.height)
      const sx = (img.width - minDim) / 2
      const sy = (img.height - minDim) / 2

      // 绘制裁剪后的图像
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size)

      // 转换为Blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob'))
        }
      }, 'image/jpeg', 0.9)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = previewUrl.value
  })
}

// 确认上传头像
async function confirmUpload() {
  if (!selectedFile.value) return

  try {
    isUploading.value = true
    
    // 执行裁剪
    const croppedBlob = await cropAvatar()
    
    // 创建新的File对象
    const croppedFile = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })
    
    // 调用store上传方法
    await userStore.uploadAvatar(croppedFile)
    
    ElMessage.success('头像更新成功')
    closeAvatarDialog()
  } catch (error) {
    console.error('上传头像失败:', error)
    ElMessage.error('上传头像失败，请重试')
  } finally {
    isUploading.value = false
  }
}

// 关闭弹窗并清理资源
function closeAvatarDialog() {
  showAvatarDialog.value = false
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  selectedFile.value = null
}

// 重新选择图片
function reselectImage() {
  closeAvatarDialog()
  nextTick(() => {
    fileInputRef.value?.click()
  })
}

// ====== Tab 相关 ======
const activeTab = ref('profile')

const tabs = [
  { name: 'profile', label: '个人资料', icon: UserFilled },
  { name: 'points', label: '我的积分', icon: Present },
  { name: 'orders', label: '我的订单', icon: Document },
  { name: 'favorites', label: '我的收藏', icon: Star },
  { name: 'addresses', label: '地址管理', icon: Location },
]

// ====== 积分系统数据 ======
const pointsData = ref({
  balance: 2580,
  totalEarned: 5680,
  totalSpent: 3100,
  level: '黄金会员',
  nextLevelPoints: 5000, // 距离下一等级还需积分
})

const pointsRules = [
  { icon: ShoppingCart, title: '下单得积分', desc: '实付金额 × 1%（每单最低1积分，最高100积分）' },
  { icon: CircleCheck, title: '每日签到', desc: '每日签到 +5 积分，连续7天额外 +50 积分' },
  { icon: Star, title: '评价订单', desc: '评价订单可获得 +10 积分' },
  { icon: EditPen, title: '发布帖子', desc: '在社区发布帖子 +5 积分' },
  { icon: Present, title: '发布活动', desc: '发布校园活动 +10 积分' },
  { icon: Money, title: '积分使用', desc: '100 积分 = 1 元（下单时可抵扣，最多抵扣30%）' },
]

const pointsHistory = ref([
  { id: 1, type: 'earn', amount: +25, desc: '下单获得积分', time: '2026-04-01 14:30', orderNo: 'HK20260401001' },
  { id: 2, type: 'earn', amount: +5, desc: '每日签到', time: '2026-04-01 08:00' },
  { id: 3, type: 'spend', amount: -100, desc: '下单抵扣1元', time: '2026-03-28 16:20', orderNo: 'HK20260328005' },
  { id: 4, type: 'earn', amount: +50, desc: '连续签到7天奖励', time: '2026-03-25 08:00' },
  { id: 5, type: 'earn', amount: +10, desc: '评价订单', time: '2026-03-22 11:15', orderNo: 'HK20260322004' },
  { id: 6, type: 'earn', amount: +5, desc: '发布帖子《学习APP推荐》', time: '2026-04-01 10:00' },
  { id: 7, type: 'spend', amount: -200, desc: '下单抵扣2元', time: '2026-03-18 20:30', orderNo: 'HK20260318005' },
  { id: 8, type: 'earn', amount: +88, desc: '下单获得积分', time: '2026-03-18 10:05', orderNo: 'HK20260318005' },
  { id: 9, type: 'earn', amount: +10, desc: '发布活动《编程马拉松》', time: '2026-03-15 14:20' },
  { id: 10, type: 'earn', amount: +5, desc: '每日签到', time: '2026-03-15 08:00' },
])

// ====== 原有数据 ======
const stats = ref([
  { label: '订单', value: 28, icon: Box, path: '/user/orders' },
  { label: '收藏', value: 15, icon: Star, path: '/user/favorites' },
  { label: '优惠券', value: 8, icon: Ticket, path: '/user/coupons' },
  { label: '积分', value: 2680, icon: Money, path: '#' },
])

const menuItems = ref([
  {
    title: '我的订单',
    items: [
      { label: '全部订单', icon: Document, path: '/user/orders', badge: null },
      { label: '待付款', icon: Clock, path: '/user/orders?status=pending_payment', badge: 1 },
      { label: '待收货', icon: Van, path: '/user/orders?status=shipped', badge: 1 },
      { label: '已完成', icon: CircleCheck, path: '/user/orders?status=completed', badge: null },
      { label: '售后/退款', icon: RefreshRight, path: '#', badge: null },
    ],
  },
  {
    title: '校园服务',
    items: [
      { label: '学工办理', icon: Setting, path: '/student-affairs', badge: null },
      { label: '缴费中心', icon: Present, path: '/payment', badge: null },
      { label: '校园卡服务', icon: Ticket, path: '/student-affairs/campus-card', badge: null },
      { label: '信息公告', icon: Bell, path: '/announcements', badge: 2 },
      { label: '通知中心', icon: Bell, path: '/announcements/notifications', badge: 5 },
    ],
  },
  {
    title: '工具与服务',
    items: [
      { label: '地址管理', icon: Location, path: '/user/addresses', badge: null },
      { label: '收藏夹', icon: Star, path: '/user/favorites', badge: null },
      { label: '浏览历史', icon: Timer, path: '#', badge: null },
      { label: '优惠券包', icon: Ticket, path: '/user/coupons', badge: 3 },
      { label: '积分商城', icon: Present, path: '#', badge: null },
    ],
  },
  {
    title: '账户设置',
    items: [
      { label: '个人资料', icon: UserFilled, path: '/user/settings', badge: null },
      { label: '账号安全', icon: Lock, path: '/user/settings', badge: null },
      { label: '消息通知', icon: Bell, path: '#', badge: 5 },
      { label: '帮助中心', icon: QuestionFilled, path: '/help', badge: null },
      { label: '关于我们', icon: InfoFilled, path: '#', badge: null },
    ],
  },
])

function navigateTo(path: string) { 
  router.push(path) 
}

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '退出登录', { confirmButtonText: '确认退出', cancelButtonText: '取消', type: 'warning' })
    .then(() => { userStore.logout(); ElMessage.success('已退出登录'); router.push('/') })
    .catch(() => {})
}

// 积分相关
const pointsHistoryRef = ref<HTMLElement | null>(null)

function scrollToHistory() {
  if (pointsHistoryRef.value) {
    pointsHistoryRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(async () => {
  if (userStore.token) {
    try {
      await userStore.fetchUserInfo()
    } catch (err: any) {
      console.error('获取用户信息失败:', err)
    }
  }
})
</script>

<template>
  <div class="profile-page min-h-screen bg-surface-secondary">
    <div class="max-w-screen-lg mx-auto px-4 lg:px-8 py-6 pb-24 md:pb-8">
      
      <!-- 未登录提示 -->
      <div v-if="!userStore.isAuthenticated" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <el-icon :size="48" class="text-primary/40"><UserFilled /></el-icon>
        </div>
        <h3 class="text-xl font-bold text-text-primary mb-2">您还未登录</h3>
        <p class="text-text-tertiary mb-6">登录后查看个人信息、订单、收藏等内容</p>
        <button @click="navigateTo('/login')"
          class="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">
          立即登录
        </button>
      </div>

      <template v-else>
        <!-- 用户信息卡片 - 科大蓝品牌风格 -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light shadow-brand mb-6">
          <!-- 背景装饰 -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/8 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div class="absolute bottom-0 left-16 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
          <div class="absolute top-1/2 right-1/4 w-20 h-20 bg-gold/8 rounded-full"></div>

          <div class="relative z-10 p-6 sm:p-8">
            <!-- 设置按钮 -->
            <button @click="navigateTo('/user/settings')"
              class="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors">
              <el-icon :size="18"><Setting /></el-icon>
            </button>

            <div class="flex items-center gap-5">
              <!-- 头像区域（可点击上传） -->
              <div class="relative group cursor-pointer" @click="handleAvatarClick">
                <img :src="userInfo.avatar" alt="用户头像"
                  class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/30 shadow-lg ring-2 ring-white/15" />
                <span class="absolute bottom-1 right-1 w-4 h-4 bg-pine rounded-full border-2 border-white"></span>
                
                <!-- Hover遮罩层 -->
                <div class="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <el-icon :size="24" class="text-white"><Camera /></el-icon>
                </div>
                
                <!-- 隐藏的文件输入框 -->
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
              </div>

              <div class="text-white flex-1 min-w-0">
                <h2 class="text-xl sm:text-2xl font-bold mb-1">{{ userInfo.nickname }}</h2>
                <p class="text-white/65 text-sm mb-3">{{ userInfo.department }} · {{ userInfo.major }} · {{ userInfo.grade }}</p>

                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/90 backdrop-blur-sm text-xs font-medium text-white">
                  <span>🎓</span>
                  <span>黑科大在校生</span>
                  <span class="opacity-70">·</span>
                  <span>成长值 {{ stats[3].value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ========== 新增：个人数据统计面板 ========== -->
          <div class="grid grid-cols-4 gap-3 px-6 pb-6 mt-2">
            <!-- 发布帖子 -->
            <div class="stat-card stat-card-blue rounded-2xl p-4 text-center cursor-pointer hover:scale-105 transition-transform"
              @click="navigateTo('#')">
              <div class="stat-value text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                {{ userStats.posts }}
              </div>
              <div class="stat-label text-xs text-white/80">发布帖子</div>
            </div>
            
            <!-- 收到点赞 -->
            <div class="stat-card stat-card-pink rounded-2xl p-4 text-center cursor-pointer hover:scale-105 transition-transform"
              @click="navigateTo('#')">
              <div class="stat-value text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r from-pink-300 to-rose-200 bg-clip-text text-transparent">
                {{ userStats.likes }}
              </div>
              <div class="stat-label text-xs text-white/80">收到点赞</div>
            </div>
            
            <!-- 完成订单 -->
            <div class="stat-card stat-card-green rounded-2xl p-4 text-center cursor-pointer hover:scale-105 transition-transform"
              @click="navigateTo('/user/orders')">
              <div class="stat-value text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
                {{ userStats.orders }}
              </div>
              <div class="stat-label text-xs text-white/80">完成订单</div>
            </div>
            
            <!-- 信用评分 -->
            <div class="stat-card stat-card-purple rounded-2xl p-4 text-center cursor-pointer hover:scale-105 transition-transform"
              @click="navigateTo('#')">
              <div class="stat-value text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r from-violet-300 to-purple-200 bg-clip-text text-transparent">
                {{ userStats.credit }}
              </div>
              <div class="stat-label text-xs text-white/80">信用评分</div>
            </div>
          </div>
        </div>

        <!-- ========== 新增：Tab 导航 ========== -->
        <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-primary-50/50 p-2 mb-5">
          <div class="flex gap-1">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="activeTab = tab.name"
              :class="[
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.name
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-md'
                  : 'text-text-secondary hover:bg-primary-50/60 hover:text-primary'
              ]"
            >
              <el-icon :size="16"><component :is="tab.icon" /></el-icon>
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <!-- Tab 内容区域 -->
        <div v-show="activeTab === 'profile'" class="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-primary-50/50 p-6 mb-5">
          <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
            <el-icon :size="18" class="text-primary"><UserFilled /></el-icon>
            个人资料
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="info-item">
              <label class="text-text-tertiary text-sm">用户名</label>
              <p class="font-medium text-text-primary mt-1">{{ userInfo.username }}</p>
            </div>
            <div class="info-item">
              <label class="text-text-tertiary text-sm">昵称</label>
              <p class="font-medium text-text-primary mt-1">{{ userInfo.nickname }}</p>
            </div>
            <div class="info-item">
              <label class="text-text-tertiary text-sm">邮箱</label>
              <p class="font-medium text-text-primary mt-1">{{ userInfo.email }}</p>
            </div>
            <div class="info-item">
              <label class="text-text-tertiary text-sm">手机号</label>
              <p class="font-medium text-text-primary mt-1">{{ userInfo.phone }}</p>
            </div>
            <div class="info-item">
              <label class="text-text-tertiary text-sm">学院</label>
              <p class="font-medium text-text-primary mt-1">{{ userInfo.department }}</p>
            </div>
            <div class="info-item">
              <label class="text-text-tertiary text-sm">专业</label>
              <p class="font-medium text-text-primary mt-1">{{ userInfo.major }}</p>
            </div>
            <div class="info-item">
              <label class="text-text-tertiary text-sm">年级</label>
              <p class="font-medium text-text-primary mt-1">{{ userInfo.grade }}</p>
            </div>
            <div class="info-item">
              <label class="text-text-tertiary text-sm">学号</label>
              <p class="font-medium text-text-primary mt-1">{{ userInfo.studentId }}</p>
            </div>
          </div>

          <button @click="navigateTo('/user/settings')"
            class="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">
            编辑资料
          </button>
        </div>

        <!-- ========== 积分面板 ========== -->
        <div v-show="activeTab === 'points'" class="space-y-5">
          <!-- 积分余额卡片 -->
          <div class="bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200/50 relative overflow-hidden">
            <!-- 背景装饰 -->
            <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <p class="text-sm opacity-90 mb-1">当前积分</p>
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-bold points-value-animate">{{ pointsData.balance.toLocaleString() }}</span>
                    <span class="text-lg opacity-80">分</span>
                  </div>
                </div>
                <div class="text-right">
                  <el-tag effect="dark" :color="'rgba(255,255,255,0.25)'" round class="!border-white/30 !text-white mb-2">
                    {{ pointsData.level }}
                  </el-tag>
                  <p class="text-xs opacity-80">距下一等级还需 {{ pointsData.nextLevelPoints }} 积分</p>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div class="text-center">
                  <p class="text-2xl font-bold">{{ pointsData.totalEarned.toLocaleString() }}</p>
                  <p class="text-xs opacity-80 mt-1">累计获得</p>
                </div>
                <div class="text-center border-x border-white/20">
                  <p class="text-2xl font-bold">{{ pointsData.totalSpent.toLocaleString() }}</p>
                  <p class="text-xs opacity-80 mt-1">已使用</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold">{{ ((pointsData.totalSpent / pointsData.totalEarned) * 100).toFixed(1) }}%</p>
                  <p class="text-xs opacity-80 mt-1">使用率</p>
                </div>
              </div>

              <div class="mt-4 flex gap-3">
                <button @click="navigateTo('#')"
                  class="flex-1 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-all text-sm flex items-center justify-center gap-2">
                  <el-icon><Present /></el-icon>
                  积分商城
                </button>
                <button @click="scrollToHistory"
                  class="flex-1 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-all text-sm flex items-center justify-center gap-2">
                  <el-icon><Document /></el-icon>
                  积分明细
                </button>
              </div>
            </div>
          </div>

          <!-- 积分规则说明 -->
          <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-primary-50/50 p-6">
            <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
              <el-icon :size="18" class="text-orange-500"><InfoFilled /></el-icon>
              积分获取与使用规则
            </h3>
            <div class="space-y-3">
              <div v-for="(rule, index) in pointsRules" :key="index"
                class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50/50 transition-colors">
                <span class="text-2xl">{{ rule.icon }}</span>
                <div class="flex-1">
                  <h4 class="font-semibold text-text-primary text-sm">{{ rule.title }}</h4>
                  <p class="text-xs text-text-tertiary mt-0.5">{{ rule.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 积分明细列表 -->
          <div ref="pointsHistoryRef" class="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-primary-50/50 p-6">
            <h3 class="font-bold text-text-primary mb-4 flex items-center justify-between">
              <span class="flex items-center gap-2">
                <el-icon :size="18" class="text-orange-500"><Clock /></el-icon>
                积分明细
              </span>
              <span class="text-xs font-normal text-text-tertiary">最近 10 条记录</span>
            </h3>

            <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="record in pointsHistory" :key="record.id"
                class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition-colors group">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  record.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                ]">
                  <el-icon :class="record.type === 'earn' ? 'text-green-500' : 'text-red-500'" :size="18">
                    <component :is="record.type === 'earn' ? 'CirclePlusFilled' : 'CircleCloseFilled'" />
                  </el-icon>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-medium text-text-primary text-sm truncate pr-2">{{ record.desc }}</h4>
                    <span :class="[
                      'font-bold text-base shrink-0',
                      record.type === 'earn' ? 'text-green-500' : 'text-red-500'
                    ]">
                      {{ record.amount > 0 ? '+' : '' }}{{ record.amount }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-[11px] text-text-quaternary">
                    <span>{{ record.time }}</span>
                    <span v-if="record.orderNo" class="px-1.5 py-0.5 rounded bg-gray-200 text-text-tertiary">
                      {{ record.orderNo }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 text-center">
              <button class="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
                查看全部明细 →
              </button>
            </div>
          </div>
        </div>

        <!-- 订单快捷入口 -->
        <div v-show="activeTab === 'orders' || activeTab === 'profile'"
          class="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-primary-50/50 p-5 mb-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-text-primary">我的订单</h3>
            <button @click="navigateTo('/user/orders')" class="text-sm text-text-tertiary hover:text-primary transition-colors flex items-center gap-1">
              全部订单<el-icon><ArrowRight /></el-icon>
            </button>
          </div>
          <div class="grid grid-cols-5 gap-2">
            <button v-for="item in menuItems[0].items" :key="item.label" @click="navigateTo(item.path)"
              class="flex flex-col items-center gap-2 py-3 rounded-xl hover:bg-primary-50/60 transition-all group cursor-pointer">
              <div class="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 flex items-center justify-center group-hover:from-primary-100 group-hover:to-primary-200/50 transition-all">
                <el-icon :size="20" class="text-primary"><component :is="item.icon" /></el-icon>
                <span v-if="item.badge" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-crimson text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">{{ item.badge }}</span>
              </div>
              <span class="text-xs text-text-secondary group-hover:text-primary transition-colors">{{ item.label }}</span>
            </button>
          </div>
        </div>

        <!-- 功能菜单 -->
        <div v-for="(section, sIndex) in menuItems.slice(1)" :key="sIndex"
          class="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-primary-50/50 overflow-hidden mb-4">
          <div class="px-5 py-3.5 border-b border-primary-50/50">
            <h3 class="font-semibold text-sm text-text-tertiary">{{ section.title }}</h3>
          </div>
          <div>
            <button v-for="(item, iIndex) in section.items" :key="iIndex" @click="navigateTo(item.path)"
              class="w-full flex items-center gap-3.5 px-5 py-4 hover:bg-primary-50/30 transition-colors border-b border-primary-50/30 last:border-b-0">
              <div class="w-9 h-9 rounded-xl bg-primary-50/50 flex items-center justify-center shrink-0 group-hover:bg-primary-100/60">
                <el-icon :size="17" class="text-text-tertiary"><component :is="item.icon" /></el-icon>
              </div>
              <span class="flex-1 text-left text-sm font-medium text-text-primary">{{ item.label }}</span>
              <div class="flex items-center gap-2">
                <span v-if="item.badge" class="min-w-[18px] h-[18px] px-1.5 bg-crimson text-white text-[10px] font-bold rounded-full flex items-center justify-center">{{ item.badge }}</span>
                <el-icon class="text-text-quaternary"><ArrowRight /></el-icon>
              </div>
            </button>
          </div>
        </div>

        <!-- 退出登录 -->
        <button @click="handleLogout"
          class="w-full py-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-sm border border-crimson/15 text-crimson font-semibold hover:bg-crimson/5 transition-colors">
          退出登录
        </button>
      </template>

      <!-- 底部品牌信息 -->
      <div class="text-center mt-6 pb-2 space-y-1">
        <p class="text-text-quaternary text-xs">黑科易购 v2.0 · Made with <Star :size="11" class="inline text-crimson" /> for HLJUST Students</p>
        <p class="text-[10px] text-text-quaternary/50 tracking-widest">黑龙江科技大学 · 厚德博学 强吾兴邦 · Since 1947</p>
      </div>
    </div>

    <!-- ========== 头像上传预览弹窗 ========== -->
    <Teleport to="body">
      <Transition name="dialog-fade">
        <div v-if="showAvatarDialog" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="closeAvatarDialog">
          <div class="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            <!-- 弹窗头部 -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 class="text-lg font-bold text-text-primary">更换头像</h3>
              <button @click="closeAvatarDialog" class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <el-icon :size="18" class="text-text-tertiary"><Close /></el-icon>
              </button>
            </div>

            <!-- 预览区域 -->
            <div class="p-6">
              <div class="relative mx-auto w-64 h-64 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                <!-- 图片预览（object-fit: cover模拟裁剪效果） -->
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  alt="头像预览"
                  class="w-full h-full object-cover"
                  style="object-position: center;"
                />
              </div>
              
              <p class="text-center text-sm text-text-tertiary mt-4">
                预览效果：将自动居中裁剪为正方形头像
              </p>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3 px-6 pb-6">
              <button
                @click="reselectImage"
                :disabled="isUploading"
                class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-text-secondary font-semibold hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <el-icon :size="18"><RefreshRight /></el-icon>
                重新选择
              </button>
              
              <button
                @click="confirmUpload"
                :disabled="isUploading"
                class="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <el-icon v-if="isUploading" class="animate-spin" :size="18"><RefreshRight /></el-icon>
                <el-icon v-else :size="18"><Check /></el-icon>
                {{ isUploading ? '上传中...' : '确认上传' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ========== 数据统计卡片样式 ========== */
.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 59, 128, 0.2);
}

/* 不同颜色倾向 */
.stat-card-blue {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.15));
  border-color: rgba(56, 189, 248, 0.3);
}

.stat-card-pink {
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.2), rgba(236, 72, 153, 0.15));
  border-color: rgba(244, 114, 182, 0.3);
}

.stat-card-green {
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.15));
  border-color: rgba(52, 211, 153, 0.3);
}

.stat-card-purple {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(139, 92, 246, 0.15));
  border-color: rgba(167, 139, 250, 0.3);
}

/* 统计数字渐变文字 */
.stat-value {
  letter-spacing: -0.02em;
  line-height: 1.2;
}

/* ========== 信息项样式 ========== */
.info-item {
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

/* ========== 弹窗动画 ========== */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

/* ========== 加载旋转动画 ========== */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ========== 积分数字动画 ========== */
.points-value-animate {
  display: inline-block;
  transition: all 0.3s ease;
}

/* ========== 自定义滚动条 ========== */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
