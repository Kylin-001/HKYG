<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentAffairsStore } from '@/stores/studentAffairs'
import { ArrowRight, Clock, Warning, Document, Bell } from '@element-plus/icons-vue'

const router = useRouter()
const store = useStudentAffairsStore()

onMounted(async () => {
  await store.fetchPendingTasks()
})

const urgentTasks = computed(() => store.pendingTasks.filter(t => t.status === 'urgent'))
const normalTasks = computed(() => store.pendingTasks.filter(t => t.status === 'pending'))

const quickServices = [
  { title: '请假申请', desc: '病假、事假、家庭事务在线提交', icon: '📝', path: '/student-affairs/leave', color: 'from-primary to-primary-light' },
  { title: '助学金申请', desc: '国家助学金、校内资助一键申请', icon: '💰', path: '/student-affairs/aid', color: 'from-gold to-gold-light' },
  { title: '军训服装预定', desc: '尺码选择、订单查询、核销码展示', icon: '🎖️', path: '/student-affairs/military', color: 'from-crimson to-crimson-light' },
  { title: '校园卡服务', desc: '充值、挂失、余额查询一站式服务', icon: '💳', path: '/student-affairs/campus-card', color: 'from-pine to-pine-light' },
]
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
    <!-- 骨架屏加载 -->
    <div
      v-if="store.loading"
      class="space-y-6"
    >
      <div class="h-32 rounded-2xl bg-primary-50 animate-pulse" />
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          v-for="i in 4"
          :key="i"
          class="p-4 rounded-2xl bg-primary-50 animate-pulse"
        >
          <div class="w-11 h-11 rounded-xl bg-white/60 mb-3" />
          <div class="h-4 w-20 bg-white/40 rounded mb-1" />
          <div class="h-3 w-full bg-white/30 rounded" />
        </div>
      </div>
      <div class="h-48 rounded-2xl bg-primary-50 animate-pulse" />
    </div>

    <template v-else>
      <!-- 待办事项 -->
      <section
        v-if="store.pendingTasks.length > 0 || !store.loading"
        class="mb-6"
      >
        <h2 class="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
          <el-icon
            :size="20"
            class="text-warning"
          >
            <Bell />
          </el-icon>我的待办
        </h2>
        <div
          v-if="urgentTasks.length > 0"
          class="space-y-2 mb-3"
        >
          <div
            v-for="task in urgentTasks"
            :key="task.id"
            class="flex items-center gap-3 p-3.5 rounded-xl bg-crimson/5 border border-crimson/15 cursor-pointer hover:bg-crimson/10 transition-colors"
            @click="router.push(task.actionUrl)"
          >
            <el-icon
              :size="18"
              class="text-crimson shrink-0"
            >
              <Warning />
            </el-icon>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary">
                {{ task.title }}
              </p>
              <p class="text-xs text-text-tertiary mt-0.5">
                {{ task.description }}
              </p>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-crimson text-white text-[10px] font-bold shrink-0">紧急</span>
          </div>
        </div>
        <div
          v-if="normalTasks.length > 0"
          class="space-y-2"
        >
          <div
            v-for="task in normalTasks"
            :key="task.id"
            class="flex items-center gap-3 p-3.5 rounded-xl bg-warning/5 border border-warning/15 cursor-pointer hover:bg-warning/10 transition-colors"
            @click="router.push(task.actionUrl)"
          >
            <el-icon
              :size="18"
              class="text-warning shrink-0"
            >
              <Clock />
            </el-icon>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary">
                {{ task.title }}
              </p>
              <p class="text-xs text-text-tertiary mt-0.5">
                {{ task.description }}
              </p>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-warning/80 text-white text-[10px] font-bold shrink-0">待处理</span>
          </div>
        </div>
        <div
          v-if="store.pendingTasks.length === 0 && !store.loading"
          class="p-6 rounded-xl bg-pine/5 border border-pine/10 text-center"
        >
          <p class="text-3xl mb-2">
            ✅
          </p>
          <p class="text-sm font-medium text-pine">
            暂无待办事项
          </p>
          <p class="text-xs text-text-tertiary mt-1">
            所有业务均已处理完毕
          </p>
        </div>
      </section>

      <!-- 快捷入口 -->
      <section class="mb-6">
        <h2 class="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
          <el-icon
            :size="20"
            class="text-primary"
          >
            <Document />
          </el-icon>快捷服务
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="service in quickServices"
            :key="service.path"
            :class="['group p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-300',
                     `bg-gradient-to-br ${service.color} border border-primary-30 hover:border-primary-200`]"
            @click="router.push(service.path)"
          >
            <div class="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform shadow-sm">
              {{ service.icon }}
            </div>
            <h4 class="font-semibold text-sm text-text-primary mb-1">
              {{ service.title }}
            </h4>
            <p class="text-[11px] text-text-tertiary line-clamp-2 leading-relaxed">
              {{ service.desc }}
            </p>
          </div>
        </div>
      </section>

      <!-- 学工公告 -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
            📢 学工通知
          </h2>
          <button
            class="text-xs text-text-tertiary hover:text-primary transition-colors flex items-center gap-1"
            @click="router.push('/student-affairs/policy')"
          >
            查看全部<el-icon><ArrowRight /></el-icon>
          </button>
        </div>
        <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 divide-y divide-primary-50/50">
          <div
            v-for="(notice, i) in [
              { title: '2026年春季学期国家助学金评定工作启动通知', date: '2026-04-01', tag: '重要' },
              { title: '关于开展2026级新生军训服装预定的通知', date: '2026-03-28', tag: '新生' },
              { title: '校园卡系统升级维护公告（4月10日）', date: '2026-03-25', tag: '维护' },
            ]"
            :key="i"
            class="flex items-center gap-3 p-4 hover:bg-primary-50/30 cursor-pointer transition-colors"
          >
            <span
              :class="['px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0',
                       notice.tag === '重要' ? 'bg-crimson/10 text-crimson' : notice.tag === '新生' ? 'bg-gold/10 text-gold' : 'bg-info/10 text-info']"
            >{{ notice.tag }}</span>
            <p class="text-sm text-text-primary flex-1 line-clamp-1">
              {{ notice.title }}
            </p>
            <span class="text-[11px] text-text-quaternary shrink-0">{{ notice.date }}</span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
