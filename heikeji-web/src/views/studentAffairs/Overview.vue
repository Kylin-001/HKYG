<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentAffairsStore } from '@/stores/studentAffairs'
import { Icon } from '@iconify/vue'
import { 
  ArrowRight, Clock, Warning, Document, Bell, 
  CircleCheck, Calendar
} from '@element-plus/icons-vue'

const router = useRouter()
const store = useStudentAffairsStore()

onMounted(async () => {
  await store.fetchPendingTasks()
})

const urgentTasks = computed(() => store.pendingTasks.filter(t => t.status === 'urgent'))
const normalTasks = computed(() => store.pendingTasks.filter(t => t.status === 'pending'))

// 快捷服务配置 - 现代化卡片设计
const quickServices = [
  { 
    title: '请假申请', 
    desc: '病假、事假、家庭事务', 
    icon: 'mdi:file-document-edit', 
    path: '/student-affairs/leave', 
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    shadowColor: 'shadow-blue-500/25',
    stats: '本月 3 次'
  },
  { 
    title: '助学金申请', 
    desc: '国家助学金、校内资助', 
    icon: 'mdi:cash-multiple', 
    path: '/student-affairs/aid', 
    color: 'amber',
    bgGradient: 'from-amber-500 to-amber-600',
    lightBg: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    shadowColor: 'shadow-amber-500/25',
    stats: '申请中 1 项'
  },
  { 
    title: '军训服装', 
    desc: '尺码选择、订单查询', 
    icon: 'mdi:tshirt-crew', 
    path: '/student-affairs/military', 
    color: 'red',
    bgGradient: 'from-red-500 to-red-600',
    lightBg: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    shadowColor: 'shadow-red-500/25',
    stats: '已预定'
  },
  { 
    title: '校园卡服务', 
    desc: '充值、挂失、余额查询', 
    icon: 'mdi:credit-card-chip', 
    path: '/student-affairs/campus-card', 
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-emerald-600',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    shadowColor: 'shadow-emerald-500/25',
    stats: '余额 ¥128'
  },
]

// 最近活动
const recentActivities = [
  { title: '请假申请已通过', time: '2小时前', type: 'success', icon: CircleCheck },
  { title: '助学金材料待补充', time: '1天前', type: 'warning', icon: Document },
  { title: '校园卡充值成功', time: '3天前', type: 'info', icon: 'mdi:lightning-bolt' },
  { title: '军训服装尺码确认', time: '5天前', type: 'success', icon: CircleCheck },
]

// 公告数据
const announcements = [
  { 
    title: '2026年春季学期国家助学金评定工作启动通知', 
    date: '2026-04-01', 
    tag: '重要',
    tagColor: 'from-red-500 to-rose-500',
    summary: '本次评定面向全体在校生，请符合条件的同学及时提交申请材料。'
  },
  { 
    title: '关于开展2026级新生军训服装预定的通知', 
    date: '2026-03-28', 
    tag: '新生',
    tagColor: 'from-blue-500 to-cyan-500',
    summary: '新生军训服装预定系统已开放，请在4月15日前完成预定。'
  },
  { 
    title: '校园卡系统升级维护公告（4月10日）', 
    date: '2026-03-25', 
    tag: '维护',
    tagColor: 'from-gray-500 to-slate-500',
    summary: '系统将于4月10日凌晨2:00-6:00进行升级维护，期间暂停服务。'
  },
]

// 快捷链接
const quickLinks = [
  { title: '如何申请助学金？', icon: 'mdi:help-circle' },
  { title: '请假流程说明', icon: 'mdi:clipboard-text' },
  { title: '校园卡使用指南', icon: 'mdi:credit-card-outline' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- 骨架屏加载 -->
      <div v-if="store.loading" class="space-y-6">
        <div class="h-48 rounded-3xl bg-gradient-to-r from-blue-100 to-purple-100 animate-pulse" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="h-40 rounded-2xl bg-white animate-pulse shadow-sm" />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 h-72 rounded-3xl bg-white animate-pulse shadow-sm" />
          <div class="h-72 rounded-3xl bg-white animate-pulse shadow-sm" />
        </div>
      </div>

      <template v-else>
        <!-- 欢迎区域 - 现代化渐变设计 -->
        <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-2xl shadow-blue-500/20">
          <!-- 动态装饰背景 -->
          <div class="absolute inset-0 overflow-hidden">
            <div class="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div class="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl" />
            <div class="absolute top-1/3 right-1/4 w-40 h-40 bg-blue-400/20 rounded-full blur-xl" />
            <div class="absolute bottom-1/3 left-1/3 w-32 h-32 bg-indigo-400/15 rounded-full blur-lg" />
          </div>
          
          <div class="relative z-10 px-6 sm:px-8 py-8 sm:py-10">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-3 mb-4">
                  <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/10">
                    <Icon icon="mdi:sparkles" class="w-4 h-4 text-yellow-300" />
                    <span class="text-sm font-medium text-white/90">学工服务中心</span>
                  </div>
                  <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span class="text-xs font-medium text-emerald-100">系统正常</span>
                  </div>
                </div>
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                  一站式学生事务办理
                </h1>
                <p class="text-blue-100 text-base sm:text-lg max-w-xl leading-relaxed">
                  请假申请、助学金、军训服装、校园卡服务，让办事更简单、更高效
                </p>
              </div>
              
              <!-- 快捷统计卡片组 -->
              <div class="flex gap-3 sm:gap-4 flex-wrap">
                <div class="group px-4 sm:px-6 py-4 sm:py-5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/25 hover:scale-105 cursor-pointer">
                  <div class="flex items-center gap-2 text-blue-100 text-sm mb-2">
                    <Clock class="w-4 h-4" />
                    待办事项
                  </div>
                  <div class="text-3xl sm:text-4xl font-bold text-white">{{ store.pendingTasks.length }}</div>
                  <div class="text-xs text-blue-200 mt-1">需要处理</div>
                </div>
                <div class="group px-4 sm:px-6 py-4 sm:py-5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/25 hover:scale-105 cursor-pointer">
                  <div class="flex items-center gap-2 text-blue-100 text-sm mb-2">
                    <CircleCheck class="w-4 h-4" />
                    本月完成
                  </div>
                  <div class="text-3xl sm:text-4xl font-bold text-white">12</div>
                  <div class="text-xs text-blue-200 mt-1">已办结</div>
                </div>
                <div class="group px-4 sm:px-6 py-4 sm:py-5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/25 hover:scale-105 cursor-pointer">
                  <div class="flex items-center gap-2 text-blue-100 text-sm mb-2">
                    <Icon icon="mdi:trending-up" class="w-4 h-4" />
                    办理效率
                  </div>
                  <div class="text-3xl sm:text-4xl font-bold text-white">98%</div>
                  <div class="text-xs text-blue-200 mt-1">好评率</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧主要内容 -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- 快捷服务 - 玻璃拟态卡片 -->
            <section class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Icon icon="mdi:lightning-bolt" class="w-5 h-5 text-white" />
                  </div>
                  快捷服务
                </h2>
                <button 
                  @click="router.push('/student-affairs/policy')"
                  class="group text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full hover:bg-blue-50"
                >
                  查看全部 
                  <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="(service, index) in quickServices"
                  :key="service.path"
                  @click="router.push(service.path)"
                  class="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                  :class="service.borderColor"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  <!-- 渐变背景 -->
                  <div :class="`absolute inset-0 bg-gradient-to-br from-${service.color}-500/10 via-${service.color}-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`" />
                  
                  <!-- 悬浮光效 -->
                  <div class="absolute -inset-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000" />
                  
                  <div class="relative z-10 p-5">
                    <div class="flex items-start justify-between mb-4">
                      <div :class="`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${service.bgGradient} flex items-center justify-center text-white text-2xl shadow-lg ${service.shadowColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`">
                        <Icon :icon="service.icon" class="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    
                    <h3 :class="`text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:${service.textColor} transition-colors`">{{ service.title }}</h3>
                    <p class="text-sm text-gray-500 mb-3">{{ service.desc }}</p>
                    
                    <div class="flex items-center gap-2">
                      <span :class="`px-3 py-1.5 rounded-full ${service.lightBg} text-xs font-medium ${service.textColor}`">
                        {{ service.stats }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 待办事项 - 现代化设计 -->
            <section class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Bell class="w-5 h-5 text-white" />
                  </div>
                  我的待办
                </h2>
                <span v-if="store.pendingTasks.length > 0" class="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                  {{ store.pendingTasks.length }} 项待处理
                </span>
              </div>

              <div v-if="store.pendingTasks.length > 0" class="space-y-3">
                <!-- 紧急任务 -->
                <div
                  v-for="task in urgentTasks"
                  :key="task.id"
                  @click="router.push(task.actionUrl)"
                  class="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 hover:border-red-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div class="relative shrink-0">
                    <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                      <Warning class="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 class="font-semibold text-gray-900 text-sm sm:text-base">{{ task.title }}</h4>
                      <span class="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold">紧急</span>
                    </div>
                    <p class="text-sm text-gray-500 truncate">{{ task.description }}</p>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors shrink-0">
                    <Icon icon="mdi:chevron-right" class="w-5 h-5 text-red-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                <!-- 普通任务 -->
                <div
                  v-for="task in normalTasks"
                  :key="task.id"
                  @click="router.push(task.actionUrl)"
                  class="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-amber-200 hover:shadow-lg hover:bg-white transition-all cursor-pointer"
                >
                  <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Clock class="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 class="font-semibold text-gray-900 text-sm sm:text-base">{{ task.title }}</h4>
                      <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">待处理</span>
                    </div>
                    <p class="text-sm text-gray-500 truncate">{{ task.description }}</p>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-amber-100 transition-colors shrink-0">
                    <Icon icon="mdi:chevron-right" class="w-5 h-5 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>

              <!-- 空状态 -->
              <div
                v-else
                class="flex flex-col items-center justify-center py-12 sm:py-16 rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100"
              >
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl" />
                  <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CircleCheck class="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                </div>
                <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">暂无待办事项</h3>
                <p class="text-gray-500 text-sm sm:text-base">所有业务均已处理完毕，真棒！</p>
              </div>
            </section>

            <!-- 学工公告 - 现代化设计 -->
            <section class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Icon icon="mdi:bullhorn" class="w-5 h-5 text-white" />
                  </div>
                  学工通知
                </h2>
                <button 
                  @click="router.push('/student-affairs/policy')"
                  class="group text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full hover:bg-blue-50"
                >
                  查看全部 
                  <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(notice, i) in announcements"
                  :key="i"
                  @click="router.push('/student-affairs/policy')"
                  class="group p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:bg-white transition-all cursor-pointer"
                >
                  <div class="flex items-start gap-3 sm:gap-4">
                    <div :class="`shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r ${notice.tagColor} text-white text-xs font-bold shadow-md`">
                      {{ notice.tag }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 text-sm sm:text-base">
                        {{ notice.title }}
                      </h4>
                      <p class="text-sm text-gray-500 line-clamp-2 mb-2">{{ notice.summary }}</p>
                      <div class="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar class="w-3.5 h-3.5" />
                        {{ notice.date }}
                      </div>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                      <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- 右侧侧边栏 -->
          <div class="space-y-6">
            <!-- 最近活动 - 玻璃拟态设计 -->
            <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                  <Icon icon="mdi:timeline-text" class="w-4 h-4 text-white" />
                </div>
                最近活动
              </h3>
              <div class="space-y-4">
                <div
                  v-for="(activity, i) in recentActivities"
                  :key="i"
                  class="flex items-start gap-3 sm:gap-4 group"
                >
                  <div :class="`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 ${
                    activity.type === 'success' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                    activity.type === 'warning' ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30' :
                    'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                  }`">
                    <component :is="activity.icon" class="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{{ activity.title }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 快捷链接 - 渐变卡片 -->
            <div class="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <!-- 装饰背景 -->
              <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div class="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl" />
              
              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-5">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon icon="mdi:shield-check" class="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 class="font-bold text-base sm:text-lg">帮助中心</h3>
                    <p class="text-xs sm:text-sm text-blue-100">常见问题解答</p>
                  </div>
                </div>
                <div class="space-y-2">
                  <button 
                    v-for="(link, i) in quickLinks" 
                    :key="i"
                    class="w-full group text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-sm flex items-center gap-3"
                  >
                    <Icon :icon="link.icon" class="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" />
                    <span class="group-hover:translate-x-1 transition-transform">{{ link.title }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 联系方式 - 现代化设计 -->
            <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon="mdi:map-marker" class="w-5 h-5 text-blue-500" />
                联系学工处
              </h3>
              <div class="space-y-3 text-sm">
                <div class="flex items-center gap-3 text-gray-600">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Icon icon="mdi:office-building" class="w-4 h-4 text-blue-500" />
                  </div>
                  <span>行政楼 302 室</span>
                </div>
                <div class="flex items-center gap-3 text-gray-600">
                  <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <Icon icon="mdi:phone" class="w-4 h-4 text-green-500" />
                  </div>
                  <span>0451-8803xxxx</span>
                </div>
                <div class="flex items-center gap-3 text-gray-600">
                  <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Icon icon="mdi:email" class="w-4 h-4 text-amber-500" />
                  </div>
                  <span>xuegong@usth.edu.cn</span>
                </div>
                <div class="flex items-center gap-3 text-gray-600">
                  <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <Icon icon="mdi:clock-outline" class="w-4 h-4 text-purple-500" />
                  </div>
                  <span>工作日 8:30-17:00</span>
                </div>
              </div>
            </div>

            <!-- 服务承诺 -->
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 sm:p-6 border border-emerald-100">
              <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon="mdi:check-decagram" class="w-5 h-5 text-emerald-500" />
                服务承诺
              </h3>
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <Icon icon="mdi:check-circle" class="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>限时办结，高效服务</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <Icon icon="mdi:check-circle" class="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>全程跟踪，及时反馈</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <Icon icon="mdi:check-circle" class="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>信息保密，安全可靠</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* 文本截断支持 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自定义动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
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
