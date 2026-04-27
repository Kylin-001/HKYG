<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const aiCourses = ref([
  { id: 1, title: '高等数学AI辅助学习', category: '理工科', students: 3200, rating: 4.8, cover: '' },
  { id: 2, title: '大学英语智能写作训练', category: '文科', students: 2800, rating: 4.7, cover: '' },
  { id: 3, title: '程序设计基础（Python）', category: '计算机', students: 4500, rating: 4.9, cover: '' },
  { id: 4, title: '大学物理虚拟实验', category: '理工科', students: 2100, rating: 4.6, cover: '' },
  { id: 5, title: '马克思主义基本原理概论', category: '公共课', students: 5200, rating: 4.5, cover: '' },
  { id: 6, title: '工程制图与CAD基础', category: '工科', students: 1800, rating: 4.7, cover: '' },
  { id: 7, title: '线性代数可视化教学', category: '理科', students: 2600, rating: 4.8, cover: '' },
  { id: 8, title: '大学化学实验仿真', category: '理工科', students: 1500, rating: 4.6, cover: '' },
  { id: 9, title: '概率论与数理统计', category: '理科', students: 3000, rating: 4.7, cover: '' },
  { id: 10, title: '电路原理与电子技术', category: '工科', students: 1900, rating: 4.5, cover: '' },
  { id: 11, title: '机械设计基础', category: '工科', students: 1200, rating: 4.6, cover: '' },
  { id: 12, title: '数据结构与算法分析', category: '计算机', students: 3500, rating: 4.9, cover: '' },
  { id: 13, title: '大学体育健康课程', category: '公共课', students: 4800, rating: 4.4, cover: '' },
  { id: 14, title: '思想道德修养与法律基础', category: '公共课', students: 5500, rating: 4.5, cover: '' },
  { id: 15, title: '采矿学概论', category: '矿业特色', students: 800, rating: 4.7, cover: '' },
  { id: 16, title: '安全工程导论', category: '矿业特色', students: 650, rating: 4.6, cover: '' },
])

const categories = ['全部', '理工科', '计算机', '文科', '公共课', '工科', '矿业特色']
const activeCategory = ref('全部')
const filteredCourses = () => activeCategory.value === '全部'
  ? aiCourses.value
  : aiCourses.value.filter(c => c.category === activeCategory.value)

function enterCourse(courseId: number) {
  ElMessage.info(t('message.featureComingSoon', { name: t('campus.aiCourses') }))
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <!-- 标题区 -->
    <section class="bg-gradient-to-r from-primary via-primary-light to-blue-400 rounded-2xl p-6 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">🤖</span>
          <h1 class="text-xl font-bold">
            AI智慧慕课
          </h1>
        </div>
        <p class="text-white/75 text-sm mb-3">
          黑龙江科技大学16门精品智慧慕课，融合AI技术，个性化学习路径推荐
        </p>
        <div class="flex items-center gap-4 text-xs text-white/60">
          <span>📚 共 16 门课程</span>
          <span>👥 累计 50000+ 人次学习</span>
          <span>⭐ 平均评分 4.7</span>
        </div>
      </div>
    </section>

    <!-- 分类筛选 -->
    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                 activeCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-text-secondary hover:bg-primary-50 hover:text-primary']"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 课程卡片网格 -->
    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="course in filteredCourses()"
          :key="course.id"
          class="group bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 overflow-hidden cursor-pointer hover:border-primary-200 hover:shadow-brand hover:-translate-y-1 transition-all duration-300"
          @click="enterCourse(course.id)"
        >
          <div class="aspect-[16/9] bg-gradient-to-br from-primary/5 via-primary-light/5 to-blue-50 flex items-center justify-center relative overflow-hidden">
            <span class="text-4xl group-hover:scale-110 transition-transform duration-300">📖</span>
            <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-bold text-primary">
              {{ course.category }}
            </div>
          </div>
          <div class="p-3.5">
            <h3 class="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
              {{ course.title }}
            </h3>
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center gap-1 text-[11px] text-text-quaternary">
                <span>{{ course.students.toLocaleString() }}人学习</span>
                <span class="text-gold">★ {{ course.rating }}</span>
              </div>
              <span class="text-[10px] text-primary font-medium">开始学习 →</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色功能入口 -->
    <section class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="p-4 rounded-2xl bg-gradient-to-br from-primary/8 to-primary-light/8 border border-primary/15 text-center cursor-pointer hover:shadow-md transition-all">
        <span class="text-2xl">🕸️</span>
        <p class="text-sm font-semibold text-text-primary mt-2">
          知识图谱
        </p>
        <p class="text-[11px] text-text-tertiary mt-0.5">
          可视化知识体系
        </p>
      </div>
      <div class="p-4 rounded-2xl bg-gradient-to-br from-gold/8 to-gold-light/8 border border-gold/15 text-center cursor-pointer hover:shadow-md transition-all">
        <span class="text-2xl">🛤️</span>
        <p class="text-sm font-semibold text-text-primary mt-2">
          学习路径
        </p>
        <p class="text-[11px] text-text-tertiary mt-0.5">
          个性化推荐
        </p>
      </div>
      <div class="p-4 rounded-2xl bg-gradient-to-br from-pine/8 to-pine-light/8 border border-pine/15 text-center cursor-pointer hover:shadow-md transition-all">
        <span class="text-2xl">📊</span>
        <p class="text-sm font-semibold text-text-primary mt-2">
          学习报告
        </p>
        <p class="text-[11px] text-text-tertiary mt-0.5">
          数据分析
        </p>
      </div>
      <div class="p-4 rounded-2xl bg-gradient-to-br from-crimson/8 to-crimson-light/8 border border-crimson/15 text-center cursor-pointer hover:shadow-md transition-all">
        <span class="text-2xl">🎮</span>
        <p class="text-sm font-semibold text-text-primary mt-2">
          互动练习
        </p>
        <p class="text-[11px] text-text-tertiary mt-0.5">
          AI出题评测
        </p>
      </div>
    </section>
  </div>
</template>
