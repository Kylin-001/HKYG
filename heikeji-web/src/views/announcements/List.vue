<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnnouncementStore } from '@/stores/announcement'
import { Search, View, Star, Document, EditPen, Trophy, Briefcase, Bell, Warning } from '@element-plus/icons-vue'

const router = useRouter()
const store = useAnnouncementStore()

const keyword = ref('')
const activeType = ref('')

const typeOptions = [
  { value: '', label: '全部', icon: Star },
  { value: 'teaching', label: '教学通知', icon: Document },
  { value: 'student', label: '学工通知', icon: EditPen },
  { value: 'activity', label: '校园活动', icon: Trophy },
  { value: 'recruitment', label: '招聘信息', icon: Briefcase },
]

const typeColorMap: Record<string, string> = {
  teaching: 'bg-primary-50 text-primary',
  student: 'bg-gold/10 text-gold',
  activity: 'bg-pine/10 text-pine',
  recruitment: 'bg-crimson/10 text-crimson',
  emergency: 'bg-crimson text-white',
}

function handleSearch() {
  store.fetchAnnouncements({ type: activeType.value, keyword: keyword.value })
}

function handleTypeChange(type: string) {
  activeType.value = type
  store.fetchAnnouncements({ type, keyword: keyword.value })
}

onMounted(() => {
  store.fetchAnnouncements()
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-5">
    <!-- 搜索和筛选 -->
    <section class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <el-icon :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-quaternary"><Search /></el-icon>
        <input v-model="keyword" @keyup.enter="handleSearch"
          placeholder="搜索公告标题..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary-100 focus:border-primary focus:ring-2 focus:ring-primary-50 outline-none text-sm bg-white" />
      </div>
      <button @click="handleSearch"
        class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold shadow-brand hover:shadow-lg transition-all whitespace-nowrap">
        搜索
      </button>
    </section>

    <!-- 类型筛选标签 -->
    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button v-for="opt in typeOptions" :key="opt.value"
        @click="handleTypeChange(opt.value)"
        :class="['px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5',
          activeType === opt.value ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-text-secondary hover:bg-primary-50 hover:text-primary']">
        <el-icon :size="13"><component :is="opt.icon" /></el-icon> {{ opt.label }}
      </button>
    </div>

    <!-- 公告列表 -->
    <section v-if="store.announcements.length > 0" class="space-y-3">
      <div v-for="item in store.announcements" :key="item.id"
        @click="router.push(`/announcements/${item.id}`)"
        class="group bg-white/90 backdrop-blur-md rounded-xl border p-4 cursor-pointer hover:border-primary-200 hover:shadow-md transition-all">
        <div class="flex items-start gap-3">
          <div class="shrink-0 mt-0.5">
            <span v-if="item.isTop" class="px-1.5 py-0.5 rounded bg-crimson text-white text-[9px] font-bold">置顶</span>
            <span v-else :class="['px-1.5 py-0.5 rounded text-[9px] font-bold', typeColorMap[item.type] || 'bg-gray-100 text-text-secondary']">
              {{ typeOptions.find(t => t.value === item.type)?.label || '其他' }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-1">{{ item.title }}</h3>
            <p class="text-xs text-text-tertiary mt-1 line-clamp-1">{{ item.content.replace(/<[^>]+>/g, '').slice(0, 80) }}...</p>
            <div class="flex items-center gap-3 mt-2 text-[11px] text-text-quaternary">
              <span>{{ item.department }}</span>
              <span>{{ item.publishedAt }}</span>
              <span class="flex items-center gap-0.5"><el-icon :size="12"><View /></el-icon>{{ item.viewCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-else-if="!store.loading" class="text-center py-16">
      <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-primary-50 flex items-center justify-center">
        <el-icon :size="28" class="text-primary/40"><Bell /></el-icon>
      </div>
      <p class="text-text-tertiary text-sm">暂无公告</p>
      <p class="text-text-quaternary text-xs mt-1">试试调整筛选条件或搜索关键词</p>
    </div>
  </div>
</template>
