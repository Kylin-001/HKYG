<template>
  <div class="lost-found-page">
    <div class="page-header">
      <div class="header-content max-w-screen-xl mx-auto px-4 lg:px-8">
        <h1 class="page-title"><el-icon><Search /></el-icon> 失物招领</h1>
        <button class="publish-btn" @click="showPublishModal = true">
          <el-icon><Plus /></el-icon>
          发布信息
        </button>
      </div>
    </div>

    <div class="main-content max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <div class="type-tabs glass-effect rounded-2xl p-2 mb-6 inline-flex">
        <button
          v-for="t in typeTabs"
          :key="t.value"
          class="type-tab"
          :class="{ active: activeType === t.value }"
          @click="activeType = t.value"
        >
          {{ t.icon }} {{ t.label }}
          <span v-if="t.count" class="tab-count">{{ t.count }}</span>
        </button>
      </div>

      <div class="items-grid grid gap-5">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="lf-card glass-effect rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="card-type-badge" :class="item.type">{{ item.type === 'lost' ? '寻物' : '招领' }}</div>

          <div class="card-image-area" :class="{ 'has-image': item.image }">
            <img v-if="item.image" :src="item.image" :alt="item.title" class="card-img" />
            <div v-else class="no-image-placeholder" :class="item.type === 'lost' ? 'bg-orange-50' : 'bg-green-50'">
              <el-icon class="placeholder-icon" :class="item.type === 'lost' ? 'text-orange-400' : 'text-green-500'">
                <component :is="item.type === 'lost' ? 'Warning' : 'CircleCheck'" />
              </el-icon>
            </div>
          </div>

          <div class="card-body p-4">
            <h3 class="card-title text-base font-bold text-gray-900 mb-2 line-clamp-2">{{ item.title }}</h3>
            <p class="card-desc text-sm text-gray-500 mb-3 line-clamp-2">{{ item.description }}</p>

            <div class="card-meta flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
              <span class="meta-tag flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded-full">
                <el-icon><Location /></el-icon> {{ item.location }}
              </span>
              <span class="meta-tag flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded-full">
                <el-icon><Clock /></el-icon> {{ formatTime(item.publishTime) }}
              </span>
              <span v-if="item.reward" class="reward-tag flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold" :class="item.type === 'lost' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'">
                🎁 {{ item.reward }}
              </span>
            </div>

            <div class="card-footer flex justify-between items-center pt-3 border-t border-gray-100">
              <div class="publisher flex items-center gap-2">
                <img :src="item.publisherAvatar" alt="" class="w-7 h-7 rounded-full object-cover" />
                <span class="text-xs text-gray-600 font-medium">{{ item.publisherName }}</span>
                <span v-if="item.isResolved" class="resolved-badge ml-1">已解决</span>
              </div>
              <div class="actions flex items-center gap-2">
                <button class="action-icon-btn p-1.5 rounded-full hover:bg-pink-50 transition-colors" @click.stop="likeItem(item)">
                  <el-icon :class="{ 'text-pink-500': item.isLiked }"><StarFilled v-if="item.isLiked" /><Star v-else /></el-icon>
                  <span class="text-xs ml-0.5">{{ item.likes || 0 }}</span>
                </button>
                <button class="chat-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all" :class="item.type === 'lost' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'" @click.stop="openChat(item)">
                  {{ item.type === 'lost' ? '提供线索' : '联系TA' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0 && !loading" class="empty-state glass-effect rounded-2xl p-12 text-center mt-6">
        <el-icon class="empty-icon text-5xl text-blue-200 mb-4"><Box /></el-icon>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">暂无{{ currentTypeLabel }}信息</h3>
        <p class="text-sm text-gray-400 mb-4">发布一条信息，帮助更多同学</p>
      </div>
    </div>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showPublishModal" class="modal-overlay fixed inset-0 bg-black/45 backdrop-blur-md z-50 flex items-center justify-center p-4" @click.self="showPublishModal = false">
          <div class="publish-modal glass-effect rounded-2xl w-full max-w-lg overflow-hidden animate-modalIn">
            <div class="modal-head flex justify-between items-center p-5 border-b border-gray-100">
              <h3 class="text-lg font-bold">发布{{ activeType === 'lost' ? '寻物' : '招领' }}信息</h3>
              <button @click="showPublishModal = false" class="w-8 h-8 rounded-full bg-gray-100 border-none cursor-pointer flex items-center justify-center text-gray-500 hover:bg-gray-200"><el-icon><Close /></el-icon></button>
            </div>
            <div class="modal-body p-5 space-y-4">
              <div class="form-group">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">标题 *</label>
                <input v-model="newForm.title" type="text" placeholder="简要描述物品特征（如：黑色AirPods Pro）" class="form-input w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" maxlength="50" />
              </div>
              <div class="form-group">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">详细描述 *</label>
                <textarea v-model="newForm.description" rows="3" placeholder="详细描述物品的外观、丢失/拾获的时间地点等..." class="form-input w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 resize-y"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="block text-sm font-semibold text-gray-700 mb-1.5">位置 *</label>
                  <input v-model="newForm.location" type="text" placeholder="如：图书馆三楼" class="form-input w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div class="form-group">
                  <label class="block text-sm font-semibold text-gray-700 mb-1.5">联系方式 *</label>
                  <input v-model="newForm.contact" type="text" placeholder="微信/QQ/手机号" class="form-input w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
              </div>
              <div class="form-group" v-if="activeType === 'lost'">
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" v-model="newForm.hasReward" class="accent-blue-500 w-4 h-4" /> 提供酬谢
                </label>
                <input v-if="newForm.hasReward" v-model="newForm.rewardText" type="text" placeholder="如：请喝奶茶一杯" class="form-input flex-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 mt-2" />
              </div>
            </div>
            <div class="modal-actions flex gap-3 pt-2">
              <button @click="showPublishModal = false" class="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 transition-colors">取消</button>
              <button @click="submitPublish" class="flex-1 py-2.5 rounded-xl border-none bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">发布</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, Location, Clock, Star, StarFilled, Warning, CircleCheck, Close, Box } from '@element-plus/icons-vue'
import { useCommunityStore } from '@/stores/community'

const communityStore = useCommunityStore()

interface LFItem {
  id: number
  type: 'lost' | 'found'
  title: string
  description: string
  image?: string
  location: string
  publishTime: string
  publisherName: string
  publisherAvatar: string
  reward?: string
  likes?: number
  isLiked?: boolean
  isResolved?: boolean
}

const loading = computed(() => communityStore.loading)
const activeType = ref('all')
const showPublishModal = ref(false)

const typeTabs = computed(() => {
  const lostCount = communityStore.lostFoundList.filter(i => i.type === 'lost').length
  const foundCount = communityStore.lostFoundList.filter(i => i.type === 'found').length
  return [
    { value: 'all', label: '全部', icon: '📋', count: null },
    { value: 'lost', label: '寻物', icon: '🔍', count: lostCount },
    { value: 'found', label: '招领', icon: '🎁', count: foundCount }
  ]
})

const newForm = reactive({
  title: '',
  description: '',
  location: '',
  contact: '',
  hasReward: false,
  rewardText: ''
})

const items = computed(() => communityStore.lostFoundList as LFItem[])

function formatTime(timeStr: string): string {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const currentTypeLabel = computed(() => {
  const tab = typeTabs.value.find(t => t.value === activeType.value)
  return tab?.label ?? ''
})

const filteredItems = computed(() => {
  if (activeType.value === 'all') return items.value
  return items.value.filter(i => i.type === activeType.value)
})

function likeItem(item: LFItem) {
  item.isLiked = !item.isLiked
  item.likes = (item.likes || 0) + (item.isLiked ? 1 : -1)
}

function openChat(item: LFItem) {
  ElMessage.info(`正在打开与 ${item.publisherName} 的对话...`)
}

async function submitPublish() {
  if (!newForm.title.trim() || !newForm.description.trim() || !newForm.location || !newForm.contact) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    await communityStore.publishLF({
      type: activeType.value === 'all' ? 'lost' : activeType.value,
      ...newForm
    })
    ElMessage.success('发布成功！')
    showPublishModal.value = false
    Object.assign(newForm, { title: '', description: '', location: '', contact: '', hasReward: false, rewardText: '' })
    await communityStore.fetchLostFound()
  } catch (err: any) {
    ElMessage.error(err.message || '发布失败')
  }
}

onMounted(async () => {
  try {
    await communityStore.fetchLostFound()
  } catch (err: any) {
    ElMessage.error(err.message || '获取失物招领列表失败')
  }
})
</script>

<style scoped>
.lost-found-page { min-height: 100vh; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); }

.page-header { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); padding: 1.25rem 0; color: white; }
.page-title { font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
.publish-btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.625rem 1.25rem; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 9999px; color: white; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.publish-btn:hover { background: rgba(255,255,255,0.3); }
.type-tabs { display: inline-flex; gap: 0.25rem; background: white; border-radius: 14px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.type-tab { padding: 0.5rem 1.25rem; border: none; border-radius: 10px; background: transparent; font-size: 0.875rem; font-weight: 500; color: #6b7280; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.375rem; position: relative; }
.type-tab:hover { color: #d97706; background: #fffbeb; }
.type-tab.active { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: white; font-weight: 600; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3); }
.tab-count { min-width: 18px; height: 18px; line-height: 18px; padding: 0 5px; border-radius: 9999px; font-size: 0.6875rem; font-weight: 700; background: rgba(255,255,255,0.25); }
.items-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
.lf-card { border: 1px solid rgba(0,0,0,0.05); background: white; position: relative; }
.card-type-badge { position: absolute; top: 12px; right: 12px; z-index: 2; padding: 0.1875rem 0.625rem; border-radius: 6px; font-size: 0.6875rem; font-weight: 700; color: white; }
.card-type-badge.lost { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); }
.card-type-badge.found { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); }
.card-image-area { aspect-ratio: 16/10; overflow: hidden; background: #fafafa; }
.card-image-area.has-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.lf-card:hover .card-image-area.has-image img { transform: scale(1.05); }
.no-image-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.placeholder-icon { font-size: 3rem; }
.resolved-badge { padding: 0.125rem 0.5rem; background: #dcfce7; color: #16a34a; border-radius: 4px; font-size: 0.6875rem; font-weight: 600; }
.action-icon-btn { border: none; background: none; cursor: pointer; display: flex; align-items: center; color: #9ca3af; font-size: 0.875rem; padding: 0.25rem; border-radius: 50%; transition: all 0.2s; }
.action-icon-btn:hover { background: #fdf2f8; }
.chat-btn { border: none; cursor: pointer; font-size: 0.75rem; transition: all 0.2s; }
@keyframes modalIn { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-modalIn { animation: modalIn 0.3s ease; }
.modal-fade-enter-active { transition: opacity 0.3s ease; }
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.empty-state { border: 1px solid rgba(0,0,0,0.05); }
@media (max-width: 640px) { .items-grid { grid-template-columns: 1fr; } .publish-modal { max-height: 90vh; border-radius: 16px; overflow-y: auto; } }
</style>
