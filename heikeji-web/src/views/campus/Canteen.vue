<script setup lang="ts">
import { ref } from 'vue'

const canteens = ref([
  {
    id: 1,
    name: '饮食中心一部',
    location: '主楼北侧',
    hours: '06:30 - 21:00',
    floors: [
      { name: '一楼', tags: ['基本餐', '面食', '粥品'], priceRange: '¥8-15', rating: 4.5 },
      { name: '二楼', tags: ['风味小吃', '麻辣烫', '盖浇饭'], priceRange: '¥12-20', rating: 4.3 },
      { name: '三楼', tags: ['清真餐厅', '特色菜系', '自助餐'], priceRange: '¥15-25', rating: 4.6 },
    ],
    features: ['支持校园卡支付', '提供打包服务', '空调开放'],
  },
  {
    id: 2,
    name: '饮食中心二部',
    location: '学生公寓区',
    hours: '06:30 - 20:30',
    floors: [
      { name: '一楼', tags: ['早餐套餐', '快餐', '炸鸡汉堡'], priceRange: '¥8-18', rating: 4.4 },
      { name: '二楼', tags: ['火锅米线', '烤肉拌饭', '奶茶饮品'], priceRange: '¥10-22', rating: 4.2 },
    ],
    features: ['支持校园卡+微信支付', '夜宵至22:00', '有包间'],
  },
  {
    id: 3,
    name: '学生特色餐厅',
    location: '图书馆东侧',
    hours: '10:00 - 22:00',
    floors: [
      { name: '一层', tags: ['西式简餐', '咖啡甜点', '轻食沙拉'], priceRange: '¥15-35', rating: 4.7 },
      { name: '二层', tags: ['主题聚餐', '生日派对', '社团活动场地'], priceRange: '¥30-60/人', rating: 4.8 },
    ],
    features: ['环境优雅', '适合聚餐', '需提前预约'],
  },
])

const activeCanteen = ref(0)
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <section class="bg-gradient-to-r from-orange-500 via-gold to-crimson rounded-2xl p-6 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div class="relative z-10 flex items-center gap-3 mb-2">
        <span class="text-3xl">🍽️</span>
        <h1 class="text-xl font-bold">校园食堂</h1>
      </div>
      <p class="text-white/75 text-sm">黑龙江科技大学三大食堂，满足你的每一餐</p>
      <div class="flex gap-4 mt-4 text-xs text-white/60">
        <span>📍 3个食堂 · {{ canteens.reduce((sum, c) => sum + c.floors.length, 0) }}层餐厅</span>
        <span>⏰ 营业时间 06:30 - 22:00</span>
      </div>
    </section>

    <section class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button v-for="(canteen, i) in canteens" :key="canteen.id"
        @click="activeCanteen = i"
        :class="['px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0',
          activeCanteen === i ? 'bg-primary text-white shadow-md' : 'bg-white border border-primary-100 text-text-secondary hover:border-primary']">
        {{ canteen.name }}
      </button>
    </section>

    <section v-if="canteens[activeCanteen]" class="space-y-4">
      <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 overflow-hidden">
        <div class="p-5 border-b border-primary-50/50">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h2 class="text-lg font-bold text-text-primary">{{ canteens[activeCanteen].name }}</h2>
              <div class="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                <span>📍 {{ canteens[activeCanteen].location }}</span>
                <span>🕐 {{ canteens[activeCanteen].hours }}</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-gold">{{ (canteens[activeCanteen].floors.reduce((s, f) => s + f.rating, 0) / canteens[activeCanteen].floors.length).toFixed(1) }}</p>
              <p class="text-[10px] text-text-quaternary">综合评分</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="feat in canteens[activeCanteen].features" :key="feat"
              class="px-2 py-0.5 rounded-full bg-pine/10 text-pine text-[11px]">{{ feat }}</span>
          </div>
        </div>

        <div class="divide-y divide-primary-50/50">
          <div v-for="floor in canteens[activeCanteen].floors" :key="floor.name" class="p-4 hover:bg-primary-50/20 transition-colors">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-sm text-text-primary">{{ floor.name }}</h3>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-crimson">{{ floor.priceRange }}</span>
                <span class="text-gold text-xs">★ {{ floor.rating }}</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span v-for="tag in floor.tags" :key="tag"
                class="px-2 py-0.5 rounded-lg bg-gray-100 text-text-secondary text-[11px]">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-info/5 rounded-2xl border border-info/10 p-5">
      <h3 class="text-sm font-bold text-info mb-2">💡 用餐小贴士</h3>
      <ul class="space-y-1.5 text-xs text-text-secondary">
        <li>• 高峰时段（11:30-12:30, 17:30-18:30）建议错峰就餐</li>
        <li>• 所有食堂均支持校园卡刷卡消费，部分窗口支持微信/支付宝</li>
        <li>• 如遇食品安全问题，可拨打后勤服务热线：0451-88036001</li>
        <li>• 特色餐厅包间需提前1天预约，可通过本平台在线预订</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
